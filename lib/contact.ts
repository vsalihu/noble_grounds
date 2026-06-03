import { Resend } from "resend";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { ValidQuotePayload } from "@/lib/validation";

export const quotePhotosBucket = "quote-photos";
export const maxQuotePhotoCount = 4;
export const maxQuotePhotoSize = 5 * 1024 * 1024;
export const allowedQuotePhotoTypes = ["image/jpeg", "image/png", "image/webp"];

type SaveQuoteResult = {
  saved: boolean;
  reason?: string;
};

type EmailQuoteResult = {
  sent: boolean;
  reason?: string;
};

export type QuotePhotoUpload = {
  url: string;
  storagePath: string;
  signedUrl?: string;
};

export async function saveQuoteEnquiry(
  enquiry: ValidQuotePayload,
  photos: QuotePhotoUpload[] = [],
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
    photo_urls: photos.map((photo) => photo.signedUrl ?? photo.url),
    photo_storage_paths: photos.map((photo) => photo.storagePath),
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

export async function uploadQuotePhotos(files: File[]): Promise<{
  photos: QuotePhotoUpload[];
  error?: string;
}> {
  const supabase = createSupabaseAdminClient();

  if (files.length === 0) {
    return { photos: [] };
  }

  if (!supabase) {
    return {
      photos: [],
      error:
        "Photo upload is not configured yet. Please send the quote without photos or contact Noble Grounds directly.",
    };
  }

  const validationError = validateQuotePhotos(files);

  if (validationError) {
    return { photos: [], error: validationError };
  }

  const uploaded: QuotePhotoUpload[] = [];

  for (const file of files) {
    const storagePath = `quote-photos/${Date.now()}-${createSafeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage
      .from(quotePhotosBucket)
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      await supabase.storage
        .from(quotePhotosBucket)
        .remove(uploaded.map((photo) => photo.storagePath));

      return { photos: [], error: uploadError.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(quotePhotosBucket).getPublicUrl(storagePath);

    const signed = await supabase.storage
      .from(quotePhotosBucket)
      .createSignedUrl(storagePath, 60 * 60 * 24 * 7);

    uploaded.push({
      url: publicUrl,
      storagePath,
      signedUrl: signed.data?.signedUrl,
    });
  }

  return { photos: uploaded };
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

function parseNotificationRecipients(value: string) {
  return value
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}

export async function sendQuoteNotificationEmail(
  enquiry: ValidQuotePayload,
  photos: QuotePhotoUpload[] = [],
): Promise<EmailQuoteResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipients = parseNotificationRecipients(
    process.env.QUOTE_NOTIFICATION_EMAIL ?? "",
  );
  const from = process.env.FROM_EMAIL;
  const submittedAt = new Date();

  if (!apiKey || recipients.length === 0 || !from) {
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
    ["Photos uploaded", String(photos.length)],
    ["Submitted", submitted],
  ];

  const photoLinks = photos
    .map((photo, index) => `Photo ${index + 1}: ${photo.signedUrl ?? photo.storagePath}`)
    .join("\n");
  const text = [
    rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
    photoLinks ? `\nQuote photos:\n${photoLinks}` : "",
  ].join("");
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
  const htmlPhotoLinks =
    photos.length > 0
      ? `
        <div style="padding:16px 24px;">
          <h2 style="margin:0 0 10px;font-size:18px;color:#123226;">Quote photos</h2>
          <ul style="margin:0;padding-left:18px;color:#1d4635;">
            ${photos
              .map(
                (photo, index) => `
                  <li style="margin:6px 0;">
                    ${
                      photo.signedUrl
                        ? `<a href="${escapeHtml(photo.signedUrl)}" style="color:#123226;">View photo ${index + 1}</a>`
                        : `Photo ${index + 1} stored at ${escapeHtml(photo.storagePath)}`
                    }
                  </li>
                `,
              )
              .join("")}
          </ul>
          <p style="margin:10px 0 0;color:#806447;font-size:13px;">Signed photo links may expire. Permanent storage paths are saved in Supabase.</p>
        </div>
      `
      : "";

  const { error } = await resend.emails.send({
    from,
    to: recipients,
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
          ${htmlPhotoLinks}
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

export function validateQuotePhotos(files: File[]) {
  if (files.length > maxQuotePhotoCount) {
    return `Upload up to ${maxQuotePhotoCount} photos.`;
  }

  const invalidFile = files.find(
    (file) =>
      !allowedQuotePhotoTypes.includes(file.type) || file.size > maxQuotePhotoSize,
  );

  if (invalidFile) {
    return "Quote photos must be JPEG, PNG, or WebP images under 5MB each.";
  }

  return "";
}

function createSafeFileName(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${baseName || "quote-photo"}.${extension}`;
}
