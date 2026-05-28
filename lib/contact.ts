import { Resend } from "resend";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { ValidQuotePayload } from "@/lib/validation";

type SaveQuoteResult = {
  saved: boolean;
  reason?: string;
};

type EmailQuoteResult = {
  sent: boolean;
  reason?: string;
};

export async function saveQuoteEnquiry(
  enquiry: ValidQuotePayload,
): Promise<SaveQuoteResult> {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    // Server-side warning only: the service role key must never be exposed to
    // the browser. Until it exists, accept enquiries but do not persist them.
    console.warn(
      "Quote enquiry accepted without saving because Supabase service role configuration is missing.",
    );

    return {
      saved: false,
      reason:
        "Supabase service role configuration is missing. The API accepted the enquiry, but production saving or email sending still needs to be connected.",
    };
  }

  const { error } = await supabase.from("quote_enquiries").insert({
    full_name: enquiry.name,
    phone: enquiry.phone,
    email: enquiry.email || null,
    property_area: enquiry.area,
    customer_type: enquiry.customerType,
    service_needed: enquiry.service,
    message: enquiry.message || null,
    source: "website",
    status: "new",
  });

  if (error) {
    console.error("Quote enquiry Supabase save failed", error);

    return {
      saved: false,
      reason:
        "Supabase is configured, but saving failed. Check the quote_enquiries table and permissions.",
    };
  }

  return { saved: true };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatOptional(value: string) {
  return value.trim() || "Not provided";
}

export async function sendQuoteNotificationEmail(
  enquiry: ValidQuotePayload,
): Promise<EmailQuoteResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_NOTIFICATION_EMAIL;
  const from = process.env.FROM_EMAIL;
  const submittedAt = new Date();

  if (!apiKey || !to || !from) {
    console.warn(
      "Quote notification email not sent because Resend environment variables are missing.",
    );

    return {
      sent: false,
      reason:
        "Resend is not configured. The enquiry was accepted, but no email notification was sent.",
    };
  }

  const resend = new Resend(apiKey);
  const submitted = submittedAt.toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/London",
  });

  const rows = [
    ["Full name", enquiry.name],
    ["Phone", enquiry.phone],
    ["Email", formatOptional(enquiry.email)],
    ["Property area", enquiry.area],
    ["Customer type", enquiry.customerType],
    ["Service needed", enquiry.service],
    ["Message", formatOptional(enquiry.message)],
    ["Submitted", submitted],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const htmlRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #ddd0bd;font-weight:700;color:#123226;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #ddd0bd;color:#1d4635;">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join("");

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `New Noble Grounds quote request from ${enquiry.name}`,
    text,
    html: `
      <div style="font-family:Arial,sans-serif;background:#fbf8f1;padding:24px;color:#16261e;">
        <div style="max-width:680px;margin:0 auto;background:#fffdf7;border:1px solid #ddd0bd;border-radius:8px;overflow:hidden;">
          <div style="background:#123226;color:#fffdf7;padding:20px 24px;">
            <h1 style="margin:0;font-size:26px;">New quote request</h1>
            <p style="margin:8px 0 0;color:#dce4cf;">Noble Grounds website enquiry</p>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:15px;">
            <tbody>${htmlRows}</tbody>
          </table>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error("Quote notification email failed", error);

    return {
      sent: false,
      reason:
        "Resend is configured, but the email notification failed. Check Resend logs and sender verification.",
    };
  }

  return { sent: true };
}
