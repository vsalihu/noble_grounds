import { NextResponse } from "next/server";
import { saveQuoteEnquiry, sendQuoteNotificationEmail } from "@/lib/contact";
import { validateQuotePayload } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        errors: {
          form: "The quote request could not be read. Please try again.",
        },
      },
      { status: 400 },
    );
  }

  const result = validateQuotePayload(body);

  if (result.isSpam) {
    return NextResponse.json({
      ok: true,
      message:
        "Your quote request has been sent. Noble Grounds will get back to you soon.",
      saved: false,
    });
  }

  if (Object.keys(result.errors).length > 0) {
    return NextResponse.json(
      {
        ok: false,
        errors: result.errors,
      },
      { status: 422 },
    );
  }

  try {
    const [saveResult, emailResult] = await Promise.all([
      saveQuoteEnquiry(result.data),
      sendQuoteNotificationEmail(result.data),
    ]);
    const notes = [saveResult.reason, emailResult.reason].filter(Boolean);

    return NextResponse.json({
      ok: true,
      message:
        "Your quote request has been sent. Noble Grounds will get back to you soon.",
      saved: saveResult.saved,
      emailSent: emailResult.sent,
      note: notes.length > 0 ? notes.join(" ") : undefined,
    });
  } catch (error) {
    console.error("Quote enquiry submission failed", error);

    return NextResponse.json(
      {
        ok: false,
        errors: {
          form: "Something went wrong sending your quote request. Please call, WhatsApp, or try again.",
        },
      },
      { status: 500 },
    );
  }
}
