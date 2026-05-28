export type QuotePayload = {
  name: string;
  phone: string;
  email: string;
  area: string;
  customerType: string;
  service: string;
  message: string;
  website: string;
  startedAt: string;
};

export type QuoteField = keyof Omit<QuotePayload, "website" | "startedAt">;

export type QuoteErrors = Partial<Record<QuoteField | "form", string>>;

export type ValidQuotePayload = Omit<QuotePayload, "website" | "startedAt">;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function normaliseQuotePayload(input: unknown): QuotePayload {
  const data =
    input && typeof input === "object" ? (input as Record<string, unknown>) : {};

  return {
    name: cleanString(data.name, 120),
    phone: cleanString(data.phone, 60),
    email: cleanString(data.email, 160),
    area: cleanString(data.area, 180),
    customerType: cleanString(data.customerType, 80),
    service: cleanString(data.service, 100),
    message: cleanString(data.message, 1200),
    website: cleanString(data.website, 200),
    startedAt: cleanString(data.startedAt, 40),
  };
}

export function validateQuotePayload(input: unknown): {
  data: ValidQuotePayload;
  errors: QuoteErrors;
  isSpam: boolean;
} {
  const payload = normaliseQuotePayload(input);
  const errors: QuoteErrors = {};

  if (!payload.name) {
    errors.name = "Add your full name.";
  }

  if (!payload.phone) {
    errors.phone = "Add a phone number for the quote.";
  }

  if (payload.email && !emailPattern.test(payload.email)) {
    errors.email = "Add a valid email address or leave it blank.";
  }

  if (!payload.area) {
    errors.area = "Add the property address or area.";
  }

  if (!payload.customerType) {
    errors.customerType = "Choose a customer type.";
  }

  if (!payload.service) {
    errors.service = "Choose the service needed.";
  }

  const startedAt = Number(payload.startedAt);
  const isVeryFast =
    Number.isFinite(startedAt) && Date.now() - startedAt > 0 && Date.now() - startedAt < 1800;
  const isSpam = Boolean(payload.website) || isVeryFast;

  return {
    data: {
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      area: payload.area,
      customerType: payload.customerType,
      service: payload.service,
      message: payload.message,
    },
    errors,
    isSpam,
  };
}
