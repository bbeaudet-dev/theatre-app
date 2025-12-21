import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Simple password hashing using Web Crypto API (built-in, no dependencies)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Generate a random token
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Helper to get user from session token
async function getUserFromToken(ctx: any, token: string | null) {
  if (!token) return null;
  
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q: any) => q.eq("token", token))
    .first();
  
  if (!session || session.expiresAt < Date.now()) {
    // Session expired or doesn't exist
    if (session) {
      await ctx.db.delete(session._id);
    }
    return null;
  }
  
  return await ctx.db.get(session.userId);
}

// Sign up with email and password
export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    if (args.password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    // Hash password
    const passwordHash = await hashPassword(args.password);

    // Create user
    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      email,
      passwordHash,
      name: args.name || email.split("@")[0],
      createdAt: now,
      updatedAt: now,
    });

    // Create session (30 days expiration)
    const token = generateToken();
    const expiresAt = now + 30 * 24 * 60 * 60 * 1000;
    await ctx.db.insert("sessions", {
      userId,
      token,
      expiresAt,
      createdAt: now,
    });

    return { userId, token };
  },
});

// Sign in with email and password
export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValid = await verifyPassword(args.password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    // Create new session (30 days expiration)
    const token = generateToken();
    const now = Date.now();
    const expiresAt = now + 30 * 24 * 60 * 60 * 1000;
    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
      createdAt: now,
    });

    return { userId: user._id, token };
  },
});

// Sign out (delete session)
export const signOut = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q: any) => q.eq("token", args.token))
      .first();
    
    if (session) {
      await ctx.db.delete(session._id);
    }
    
    return { success: true };
  },
});

// Get current user ID from session token
export const getCurrentUser = query({
  args: {
    token: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromToken(ctx, args.token);
    return user?._id || null;
  },
});

// Get current user profile
export const getCurrentUserProfile = query({
  args: {
    token: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromToken(ctx, args.token);
    if (!user) return null;
    
    // Don't return password hash
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});
