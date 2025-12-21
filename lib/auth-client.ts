import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Token storage key
const TOKEN_KEY = "theatre-app-auth-token";

// Get token from localStorage
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

// Set token in localStorage
export function setAuthToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

// Remove token from localStorage
export function removeAuthToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

// Sign up hook
export function useSignUp() {
  const signUpMutation = useMutation(api.auth.signUp);
  
  return async (email: string, password: string, name?: string) => {
    try {
      const result = await signUpMutation({ email, password, name });
      if (result.token) {
        setAuthToken(result.token);
      }
      return { success: true, userId: result.userId };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to sign up" };
    }
  };
}

// Sign in hook
export function useSignIn() {
  const signInMutation = useMutation(api.auth.signIn);
  
  return async (email: string, password: string) => {
    try {
      const result = await signInMutation({ email, password });
      if (result.token) {
        setAuthToken(result.token);
      }
      return { success: true, userId: result.userId };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to sign in" };
    }
  };
}

// Sign out hook
export function useSignOut() {
  const signOutMutation = useMutation(api.auth.signOut);
  
  return async () => {
    const token = getAuthToken();
    if (token) {
      signOutMutation({ token }).catch(() => {});
    }
    removeAuthToken();
  };
}

// Get current user hook
export function useCurrentUser() {
  const token = typeof window !== "undefined" ? getAuthToken() : null;
  return useQuery(api.auth.getCurrentUser, { token });
}

// Get current user profile hook
export function useCurrentUserProfile() {
  const token = typeof window !== "undefined" ? getAuthToken() : null;
  return useQuery(api.auth.getCurrentUserProfile, { token });
}
