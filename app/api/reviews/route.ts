import { NextResponse } from "next/server";
import { createPendingReview } from "@/lib/reviews";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        errors: {
          form: "The review could not be read. Please try again.",
        },
      },
      { status: 400 },
    );
  }

  const data = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const result = await createPendingReview({
    customerName: String(data.customerName ?? ""),
    customerType: String(data.customerType ?? ""),
    location: String(data.location ?? ""),
    rating: Number(data.rating) || 5,
    reviewText: String(data.reviewText ?? ""),
    website: String(data.website ?? ""),
  });

  if (result.error) {
    return NextResponse.json(
      {
        ok: false,
        errors: {
          form: result.error,
        },
      },
      { status: 422 },
    );
  }

  return NextResponse.json({
    ok: true,
    saved: result.saved,
    message: "Thank you. Your review has been submitted and will appear after approval.",
  });
}
