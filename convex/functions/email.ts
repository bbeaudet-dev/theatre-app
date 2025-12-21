import { internalAction, action } from "../_generated/server";
import { v } from "convex/values";

/**
 * Send sync report email using Resend
 */
export const sendSyncReportEmail = internalAction({
  args: {
    reportId: v.id("syncReports"),
    showsScanned: v.number(),
    newShowsCount: v.number(),
    updatedShowsCount: v.number(),
    deletedShowsCount: v.number(),
    errors: v.optional(v.array(v.string())),
    newShows: v.array(
      v.object({
        title: v.string(),
        theatre: v.optional(v.string()),
        district: v.optional(v.string()),
        openingDate: v.optional(v.string()),
        closingDate: v.optional(v.string()),
        isOpenRun: v.optional(v.boolean()),
        syncSource: v.optional(v.string()),
        sourceUrl: v.optional(v.string()),
        confidence: v.optional(v.number()),
      })
    ),
    updatedShows: v.array(
      v.object({
        new: v.any(),
        old: v.union(v.any(), v.null()),
        showId: v.id("shows"),
      })
    ),
    deletedShows: v.array(
      v.object({
        title: v.string(),
        theatre: v.optional(v.string()),
        district: v.optional(v.string()),
        syncSource: v.optional(v.string()),
      })
    ),
    sourcesScanned: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;

    console.log("Sending email report...", { adminEmail, hasApiKey: !!resendApiKey });

    if (!resendApiKey) {
      const error = "RESEND_API_KEY not configured";
      console.error(error);
      throw new Error(error);
    }

    if (!adminEmail) {
      const error = "ADMIN_EMAIL not configured";
      console.error(error);
      throw new Error(error);
    }

    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Generate HTML email content
    const html = generateEmailHTML(date, args);

    try {
      console.log("Calling Resend API...", { from: "onboarding@resend.dev", to: adminEmail });
      
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev", // Use Resend test domain (or replace with your verified domain)
          to: [adminEmail],
          subject: `Daily Show Sync Report - ${date}`,
          html,
        }),
      });

      const responseText = await response.text();
      console.log("Resend API response:", { status: response.status, statusText: response.statusText, body: responseText });

      if (!response.ok) {
        const error = `Resend API error: ${response.status} ${response.statusText} - ${responseText}`;
        console.error(error);
        throw new Error(error);
      }

      const data = JSON.parse(responseText);
      console.log("Email sent successfully!", { messageId: data.id });
      return { success: true, messageId: data.id };
    } catch (error: any) {
      console.error("Failed to send email:", error);
      throw error;
    }
  },
});

/**
 * Test email sending (for debugging)
 */
export const testEmail = action({
  args: {
    to: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    const recipient = args.to || adminEmail;

    console.log("Testing email...", { recipient, hasApiKey: !!resendApiKey, hasAdminEmail: !!adminEmail });

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    if (!recipient) {
      throw new Error("No recipient email specified (provide 'to' arg or set ADMIN_EMAIL)");
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev",
          to: [recipient],
          subject: "Test Email from Theatre App",
          html: "<h1>Test Email</h1><p>If you receive this, email sending is working!</p>",
        }),
      });

      const responseText = await response.text();
      console.log("Resend API response:", { status: response.status, statusText: response.statusText, body: responseText });

      if (!response.ok) {
        throw new Error(`Resend API error: ${response.status} ${response.statusText} - ${responseText}`);
      }

      const data = JSON.parse(responseText);
      return { success: true, messageId: data.id, recipient };
    } catch (error: any) {
      console.error("Failed to send test email:", error);
      throw error;
    }
  },
});

function generateEmailHTML(date: string, args: any): string {
  const {
    showsScanned,
    newShowsCount,
    updatedShowsCount,
    deletedShowsCount,
    errors,
    newShows,
    updatedShows,
    deletedShows,
    sourcesScanned,
  } = args;

  // Helper to format date
  const formatDate = (dateStr: string | undefined | null): string => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // Helper to detect changes between old and new data
  const getChangeDescription = (oldData: any, newData: any): string => {
    const changes: string[] = [];
    if (oldData?.theatre !== newData?.theatre) {
      changes.push(`Theatre: "${oldData?.theatre || "N/A"}" → "${newData?.theatre || "N/A"}"`);
    }
    if (oldData?.district !== newData?.district) {
      changes.push(`District: "${oldData?.district || "N/A"}" → "${newData?.district || "N/A"}"`);
    }
    if (oldData?.isOpenRun !== newData?.isOpenRun) {
      changes.push(`Status: ${oldData?.isOpenRun ? "Open Run" : "Closed"} → ${newData?.isOpenRun ? "Open Run" : "Closed"}`);
    }
    if (oldData?.closingDate !== newData?.closingDate) {
      changes.push(`Closing Date: ${formatDate(oldData?.closingDate ? new Date(oldData.closingDate).toISOString() : null)} → ${formatDate(newData?.closingDate)}`);
    }
    return changes.length > 0 ? changes.join(", ") : "Minor updates";
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
    .summary { background-color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .summary-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .summary-item:last-child { border-bottom: none; }
    .section { background-color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .section h3 { margin-top: 0; color: #1f2937; }
    .show-list { list-style: none; padding: 0; }
    .show-item { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .show-item:last-child { border-bottom: none; }
    .show-title { font-weight: bold; color: #1f2937; }
    .show-details { color: #6b7280; font-size: 0.9em; }
    .error-list { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; }
    .error-item { color: #991b1b; margin: 5px 0; }
    .success { color: #059669; }
    .warning { color: #d97706; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Daily Show Sync Report</h1>
      <p>${date}</p>
    </div>
    
    <div class="content">
      <div class="summary">
        <h2>Summary</h2>
        <div class="summary-item">
          <span>Sources Scanned:</span>
          <strong>${sourcesScanned ? sourcesScanned.join(", ") : "N/A"}</strong>
        </div>
        <div class="summary-item">
          <span>Shows Scanned:</span>
          <strong>${showsScanned}</strong>
        </div>
        <div class="summary-item">
          <span>New Shows:</span>
          <strong class="success">${newShowsCount}</strong>
        </div>
        <div class="summary-item">
          <span>Updated Shows:</span>
          <strong class="warning">${updatedShowsCount}</strong>
        </div>
        <div class="summary-item">
          <span>Deleted/Closed Shows:</span>
          <strong>${deletedShowsCount}</strong>
        </div>
      </div>

      ${newShowsCount > 0 ? `
      <div class="section">
        <h3>New Shows (${newShowsCount})</h3>
        <ul class="show-list">
          ${newShows.map((show: any) => `
            <li class="show-item">
              <div class="show-title">${escapeHtml(show.title)}</div>
              <div class="show-details">
                ${show.theatre ? `<strong>Theatre:</strong> ${escapeHtml(show.theatre)}<br/>` : ""}
                ${show.district ? `<strong>District:</strong> ${escapeHtml(show.district)}<br/>` : ""}
                ${show.openingDate ? `<strong>Opening:</strong> ${formatDate(show.openingDate)}<br/>` : ""}
                ${show.closingDate ? `<strong>Closing:</strong> ${formatDate(show.closingDate)}<br/>` : show.isOpenRun ? `<strong>Status:</strong> Open Run<br/>` : ""}
                ${show.syncSource ? `<strong>Source:</strong> ${escapeHtml(show.syncSource)}<br/>` : ""}
                ${show.confidence !== undefined ? `<strong>Confidence:</strong> ${Math.round(show.confidence * 100)}%<br/>` : ""}
              </div>
            </li>
          `).join("")}
        </ul>
      </div>
      ` : ""}

      ${updatedShowsCount > 0 ? `
      <div class="section">
        <h3>Updated Shows (${updatedShowsCount})</h3>
        <ul class="show-list">
          ${updatedShows.map((item: any) => {
            const show = item.new || item;
            const oldShow = item.old;
            const changeDesc = oldShow ? getChangeDescription(oldShow, show) : "Updated";
            return `
            <li class="show-item">
              <div class="show-title">${escapeHtml(show.title || oldShow?.title || "Unknown")}</div>
              <div class="show-details">
                <strong>Changes:</strong> ${escapeHtml(changeDesc)}<br/>
                ${show.theatre ? `<strong>Theatre:</strong> ${escapeHtml(show.theatre)}<br/>` : ""}
                ${show.district ? `<strong>District:</strong> ${escapeHtml(show.district)}<br/>` : ""}
                ${show.syncSource ? `<strong>Source:</strong> ${escapeHtml(show.syncSource)}<br/>` : oldShow?.syncSource ? `<strong>Previous Source:</strong> ${escapeHtml(oldShow.syncSource)}<br/>` : ""}
              </div>
            </li>
          `;
          }).join("")}
        </ul>
      </div>
      ` : ""}

      ${deletedShowsCount > 0 ? `
      <div class="section">
        <h3>Deleted/Closed Shows (${deletedShowsCount})</h3>
        <ul class="show-list">
          ${deletedShows.map((show: any) => `
            <li class="show-item">
              <div class="show-title">${escapeHtml(show.title)}</div>
              <div class="show-details">
                ${show.theatre ? `<strong>Theatre:</strong> ${escapeHtml(show.theatre)}<br/>` : ""}
                ${show.district ? `<strong>District:</strong> ${escapeHtml(show.district)}<br/>` : ""}
                ${show.syncSource ? `<strong>Last Source:</strong> ${escapeHtml(show.syncSource)}<br/>` : ""}
              </div>
            </li>
          `).join("")}
        </ul>
      </div>
      ` : ""}

      ${errors && errors.length > 0 ? `
      <div class="section">
        <h3>Errors (${errors.length})</h3>
        <div class="error-list">
          ${errors.map((error: string) => `<div class="error-item">${escapeHtml(error)}</div>`).join("")}
        </div>
      </div>
      ` : ""}
    </div>
  </div>
</body>
</html>
  `;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
