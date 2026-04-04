// API utilities for Supabase functions

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

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