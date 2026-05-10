// API utilities for Supabase functions

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

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

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  "apikey": SUPABASE_ANON_KEY,
};

const parseApiError = async (response: Response) => {
  let message = `${response.status} ${response.statusText}`;
  const contentType = response.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      const body = await response.json();
      if (typeof body === "string") {
        message = body;
      } else if (body?.error) {
        message = body.error;
      } else if (body?.message) {
        message = body.message;
      } else {
        message = JSON.stringify(body);
      }
    } else {
      const text = await response.text();
      if (text) {
        try {
          const parsed = JSON.parse(text);
          if (parsed?.error) {
            message = parsed.error;
          } else if (parsed?.message) {
            message = parsed.message;
          } else {
            message = text;
          }
        } catch {
          message = text;
        }
      }
    }
  } catch {
    // Keep default status message when parsing fails
  }

  throw new Error(message);
};

export const sendOtp = async (email: string) => {
  const response = await fetch(`${SUPABASE_URL}/send-otp`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    await parseApiError(response);
  }
  return response.json();
};

export const checkStatus = async (email: string) => {
  const response = await fetch(`${SUPABASE_URL}/check-status`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    await parseApiError(response);
  }
  return response.json();
};

export const verifyOtp = async (email: string, otp: string) => {
  const response = await fetch(`${SUPABASE_URL}/verify-otp`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email, otp }),
  });
  if (!response.ok) {
    await parseApiError(response);
  }
  return response.json();
};

export const submitRegistration = async (data: any) => {
  const response = await fetch(`${SUPABASE_URL}/submit-registration`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    await parseApiError(response);
  }
  return response.json();
};

export type FeedbackPayload = {
  feedback: string;
  stars: number;
  name?: string;
};

export type FeedbackItem = {
  id?: string | number;
  name?: string;
  feedback: string;
  stars: number;
  created_at?: string;
};

export async function createFeedback(payload: FeedbackPayload) {
  const response = await fetch(`${getFunctionsBaseUrl()}/feedback`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  try {
    const json = text ? JSON.parse(text) : {};
    if (!response.ok) {
      return { error: json?.error || json?.message || `HTTP ${response.status}` };
    }
    return json;
  } catch (err) {
    if (!response.ok) return { error: `HTTP ${response.status}` };
    return { data: text };
  }
}

const parseFeedbackListPayload = (payload: any): FeedbackItem[] => {
  if (Array.isArray(payload)) {
    return payload as FeedbackItem[];
  }

  if (Array.isArray(payload?.data)) {
    return payload.data as FeedbackItem[];
  }

  if (Array.isArray(payload?.feedbacks)) {
    return payload.feedbacks as FeedbackItem[];
  }

  if (Array.isArray(payload?.items)) {
    return payload.items as FeedbackItem[];
  }

  return [];
};

export async function getFeedbacks(): Promise<FeedbackItem[]> {
  const response = await fetch(`${getFunctionsBaseUrl()}/feedback`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    await parseApiError(response);
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const json = await response.json();
    return parseFeedbackListPayload(json);
  }

  const text = await response.text();
  if (!text.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(text);
    return parseFeedbackListPayload(parsed);
  } catch {
    return [];
  }
}

export type ConfirmRegistrationResponse = Record<string, unknown>;

const parseSuccessPayload = async (
  response: Response,
): Promise<ConfirmRegistrationResponse> => {
  const contentType = response.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      const jsonBody = await response.json();

      if (jsonBody && typeof jsonBody === "object") {
        return jsonBody as ConfirmRegistrationResponse;
      }

      return {
        data: jsonBody,
        ok: true,
        statusCode: response.status,
      };
    }

    const textBody = await response.text();

    if (!textBody.trim()) {
      return {
        ok: true,
        statusCode: response.status,
      };
    }

    try {
      const parsedBody = JSON.parse(textBody);

      if (parsedBody && typeof parsedBody === "object") {
        return parsedBody as ConfirmRegistrationResponse;
      }

      return {
        data: parsedBody,
        ok: true,
        statusCode: response.status,
      };
    } catch {
      return {
        message: textBody,
        ok: true,
        statusCode: response.status,
      };
    }
  } catch {
    return {
      ok: true,
      statusCode: response.status,
    };
  }
};

export const confirmRegistration = async (
  registrationId: string,
): Promise<ConfirmRegistrationResponse> => {
  const trimmedId = registrationId.trim();

  if (!trimmedId) {
    throw new Error("Registration id is required.");
  }

  const response = await fetch(`${getFunctionsBaseUrl()}/confirm-registration`, {
    method: "POST",
    headers,
    body: JSON.stringify({ registration_id: trimmedId }),
  });

  if (!response.ok) {
    await parseApiError(response);
  }

  const payload = await parseSuccessPayload(response);

  return {
    ok: true,
    statusCode: response.status,
    ...payload,
  };
};
