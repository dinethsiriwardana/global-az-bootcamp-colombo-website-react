import {
  AdminAction,
  AdminFilterStatus,
  AdminRegistration,
} from "../types/admin";

const SUPABASE_URL = (process.env.REACT_APP_SUPABASE_URL || "").trim();
const SUPABASE_ANON_KEY = (process.env.REACT_APP_SUPABASE_ANON_KEY || "").trim();
export const LOCAL_STORAGE_ADMIN_SECRET_KEY = "REACT_APP_ADMIN_SECRET";

export type MarkAttendanceStatus =
  | "success"
  | "already-attended"
  | "not-found"
  | "api-error";

export interface AttendanceRegistration {
  id: string;
  event_id: string | null;
  status: string | null;
  is_confirmed: boolean | null;
  attended: boolean | null;
  attended_at: string | null;
  profile_id: string | null;
  approved_at: string | null;
  confirmed_at: string | null;
  registered_at: string | null;
}

export interface MarkAttendanceResult {
  status: MarkAttendanceStatus;
  message: string;
  registrationId: string;
  registration: AttendanceRegistration | null;
  payload: unknown;
}

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const getAdminSecret = (): string => {
  if (typeof window !== "undefined") {
    const storedSecret = window.localStorage.getItem(LOCAL_STORAGE_ADMIN_SECRET_KEY);
    if (storedSecret?.trim()) {
      return storedSecret.trim();
    }
  }

  const envSecret = (process.env.REACT_APP_ADMIN_SECRET || "").trim();
  if (envSecret) {
    return envSecret;
  }

  throw new Error(
    "Admin secret is not configured. Save REACT_APP_ADMIN_SECRET in localStorage to continue."
  );
};

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
    "x-admin-secret": getAdminSecret(),
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

const asBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return false;
};

const asNullableBoolean = (value: unknown): boolean | null => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true") {
      return true;
    }

    if (normalized === "false") {
      return false;
    }
  }

  return null;
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
};

const asOptionalText = (value: unknown): string | null => {
  const text = asText(value).trim();
  return text || null;
};

const parseResponsePayload = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      return await response.json();
    }

    const text = await response.text();
    if (!text.trim()) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch {
    return null;
  }
};

const getPayloadMessage = (payload: unknown): string => {
  if (typeof payload === "string") {
    return payload.trim();
  }

  const record = asRecord(payload);
  if (!record) {
    return "";
  }

  const message =
    asOptionalText(record.message) ||
    asOptionalText(record.error) ||
    asOptionalText(record.error_message) ||
    asOptionalText(record.detail);

  return message || "";
};

const extractAttendanceRegistration = (
  payload: unknown,
): AttendanceRegistration | null => {
  const record = asRecord(payload);
  if (!record) {
    return null;
  }

  const candidate =
    asRecord(record.registration) ||
    asRecord(record.data) ||
    asRecord(record.registration_data) ||
    null;

  if (!candidate) {
    return null;
  }

  const id = asOptionalText(candidate.id ?? candidate.registration_id ?? candidate.uuid);

  if (!id) {
    return null;
  }

  return {
    id,
    event_id: asOptionalText(candidate.event_id),
    status: asOptionalText(candidate.status),
    is_confirmed: asNullableBoolean(candidate.is_confirmed),
    attended: asNullableBoolean(candidate.attended),
    attended_at: asOptionalText(candidate.attended_at),
    profile_id: asOptionalText(candidate.profile_id),
    approved_at: asOptionalText(candidate.approved_at),
    confirmed_at: asOptionalText(candidate.confirmed_at),
    registered_at: asOptionalText(candidate.registered_at),
  };
};

const isAlreadyAttendedMessage = (message: string) => {
  const normalized = message.toLowerCase();

  return [
    "already attended",
    "already been marked",
    "already marked",
    "already checked",
    "already processed",
    "already exists",
  ].some((phrase) => normalized.includes(phrase));
};

const isNotFoundMessage = (message: string) => {
  const normalized = message.toLowerCase();

  return [
    "not found",
    "does not exist",
    "unknown registration",
    "invalid registration",
    "not eligible",
  ].some((phrase) => normalized.includes(phrase));
};

const resolveMarkAttendanceStatus = (
  response: Response,
  message: string,
): MarkAttendanceStatus => {
  if (isAlreadyAttendedMessage(message)) {
    return "already-attended";
  }

  if (response.status === 404 || isNotFoundMessage(message)) {
    return "not-found";
  }

  if (response.ok) {
    return "success";
  }

  return "api-error";
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
  const profile =
    registration.profiles && typeof registration.profiles === "object"
      ? (registration.profiles as Record<string, unknown>)
      : {};
  const event =
    registration.events && typeof registration.events === "object"
      ? (registration.events as Record<string, unknown>)
      : {};

  return {
    registration_id: getRegistrationId(registration),
    name: asText(registration.name || profile.name),
    email: asText(registration.email || profile.email),
    phone_number: asText(registration.phone_number || profile.phone_number),
    profession: asText(registration.profession || profile.profession),
    status: asText(registration.status || "pending").toLowerCase(),
    is_confirmed: asBoolean(registration.is_confirmed ?? profile.is_confirmed),
    organization: asText(registration.organization || profile.organization),
    designation: asText(registration.designation || profile.designation),
    food_preference: asText(registration.food_preference || profile.food_preference),
    event_title: asText(event.title),
    linkedin_url: asText(profile.linkedin_url),
    registered_at: asText(registration.registered_at),
    tshirt_size: asText(registration.tshirt_size || profile.tshirt_size),
    attended: asNullableBoolean(registration.attended ?? profile.attended),
    attended_at: asText(registration.attended_at ?? profile.attended_at),
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
  status?: AdminFilterStatus,
): Promise<AdminRegistration[]> => {
  const baseUrl = getFunctionsBaseUrl();
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const response = await fetch(`${baseUrl}/list-registrations${query}`, {
    method: "GET",
    headers: buildHeaders(),
  });

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

export const markAttendance = async (
  registrationId: string,
): Promise<MarkAttendanceResult> => {
  const trimmedRegistrationId = registrationId.trim();

  if (!trimmedRegistrationId) {
    throw new Error("Registration id is required.");
  }

  const baseUrl = getFunctionsBaseUrl();
  const response = await fetch(`${baseUrl}/mark-attendance`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      registration_id: trimmedRegistrationId,
    }),
  });

  const payload = await parseResponsePayload(response);
  const message = getPayloadMessage(payload);
  const status = resolveMarkAttendanceStatus(response, message);
  const registration = extractAttendanceRegistration(payload);

  const fallbackMessage =
    status === "success"
      ? "Attendance marked successfully."
      : status === "already-attended"
        ? "This attendee has already been marked attended."
        : status === "not-found"
          ? "Registration was not found."
          : message || `${response.status} ${response.statusText}`;

  return {
    status,
    message: message || fallbackMessage,
    registrationId: registration?.id || trimmedRegistrationId,
    registration,
    payload,
  };
};
