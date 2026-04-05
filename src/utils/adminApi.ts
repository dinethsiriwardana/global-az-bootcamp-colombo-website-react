import {
  AdminAction,
  AdminFilterStatus,
  AdminRegistration,
} from "../types/admin";

const SUPABASE_URL = (process.env.REACT_APP_SUPABASE_URL || "").trim();
const SUPABASE_ANON_KEY = (process.env.REACT_APP_SUPABASE_ANON_KEY || "").trim();
const ADMIN_SECRET = (
  process.env.REACT_APP_ADMIN_SECRET || "your-strong-admin-secret"
).trim();

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const getFunctionsBaseUrl = () => {
  const base = stripTrailingSlash(SUPABASE_URL);

  if (!base) {
    throw new Error("REACT_APP_SUPABASE_URL is not configured.");
  }

  if (base.endsWith("/functions/v1")) {
    return base;
  }

  return `${base}/functions/v1`;
};

const buildHeaders = (): HeadersInit => {
  if (!SUPABASE_ANON_KEY) {
    throw new Error("REACT_APP_SUPABASE_ANON_KEY is not configured.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    apikey: SUPABASE_ANON_KEY,
    "x-admin-secret": ADMIN_SECRET,
  };
};

const parseApiError = async (response: Response) => {
  let message = `${response.status} ${response.statusText}`;

  try {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await response.json();
      if (typeof body === "string") {
        message = body;
      } else if (body && typeof body === "object") {
        const parsedBody = body as Record<string, unknown>;
        if (typeof parsedBody.error === "string") {
          message = parsedBody.error;
        } else if (typeof parsedBody.message === "string") {
          message = parsedBody.message;
        } else {
          message = JSON.stringify(parsedBody);
        }
      }
    } else {
      const text = await response.text();
      if (text) {
        message = text;
      }
    }
  } catch {
    // Preserve default HTTP status error message if parsing fails.
  }

  throw new Error(message);
};

const asText = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }

  if (value === undefined || value === null) {
    return "";
  }

  return String(value);
};

const getRegistrationId = (item: Record<string, unknown>) => {
  return asText(item.registration_id ?? item.id ?? item._id ?? item.uuid);
};

const normalizeRegistration = (item: unknown): AdminRegistration => {
  const fallback: AdminRegistration = {
    registration_id: "",
    name: "",
    email: "",
    phone_number: "",
    profession: "",
    status: "pending",
  };

  if (!item || typeof item !== "object") {
    return fallback;
  }

  const registration = item as Record<string, unknown>;

  return {
    registration_id: getRegistrationId(registration),
    name: asText(registration.name),
    email: asText(registration.email),
    phone_number: asText(registration.phone_number),
    profession: asText(registration.profession),
    status: asText(registration.status || "pending").toLowerCase(),
  };
};

const extractRegistrations = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const parsedPayload = payload as Record<string, unknown>;

  if (Array.isArray(parsedPayload.data)) {
    return parsedPayload.data;
  }

  if (Array.isArray(parsedPayload.registrations)) {
    return parsedPayload.registrations;
  }

  if (Array.isArray(parsedPayload.items)) {
    return parsedPayload.items;
  }

  return [];
};

export const listRegistrations = async (
  status: AdminFilterStatus,
): Promise<AdminRegistration[]> => {
  const baseUrl = getFunctionsBaseUrl();
  const response = await fetch(
    `${baseUrl}/list-registrations?status=${encodeURIComponent(status)}`,
    {
      method: "GET",
      headers: buildHeaders(),
    },
  );

  if (!response.ok) {
    await parseApiError(response);
  }

  const payload = await response.json();

  return extractRegistrations(payload)
    .map(normalizeRegistration)
    .filter((registration) => Boolean(registration.registration_id));
};

export const updateRegistrationStatus = async (
  registrationId: string,
  action: AdminAction,
): Promise<void> => {
  if (!registrationId) {
    throw new Error("Registration id is required.");
  }

  const baseUrl = getFunctionsBaseUrl();
  const response = await fetch(`${baseUrl}/admin-approve`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      registration_id: registrationId,
      action,
    }),
  });

  if (!response.ok) {
    await parseApiError(response);
  }
};
