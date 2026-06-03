import { NextResponse } from "next/server";
import {
  saveQuoteEnquiry,
  sendQuoteNotificationEmail,
  uploadQuotePhotos,
} from "@/lib/contact";
import { validateQuotePayload } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  let files: File[] = [];

  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body = Object.fromEntries(
        Array.from(formData.entries()).filter(([, value]) => typeof value === "string"),
      );
      files = formData
        .getAll("photos")
        .filter((value): value is File => value instanceof File && value.size > 0);
    } else {
      body = await request.json();
    }
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
    const photoResult = await uploadQuotePhotos(files);

    if (photoResult.error) {
      return NextResponse.json(
        {
          ok: false,
          errors: {
            form: photoResult.error,
          },
        },
        { status: 422 },
      );
    }

    const [saveResult, emailResult] = await Promise.all([
      saveQuoteEnquiry(result.data, photoResult.photos),
      sendQuoteNotificationEmail(result.data, photoResult.photos),
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
