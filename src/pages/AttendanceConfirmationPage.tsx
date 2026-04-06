import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  confirmRegistration,
  ConfirmRegistrationResponse,
} from "../utils/api";
import "./AttendanceConfirmationPage.css";

type ConfirmState = "loading" | "success" | "error";
const LOADING_WINDOW_MS = 3000;

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }

  return null;
};

const asNonEmptyText = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const text = value.trim();
  return text ? text : null;
};

const normalizeKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const readTextByAlias = (
  record: Record<string, unknown>,
  aliases: string[],
): string | null => {
  const aliasSet = new Set(aliases.map((alias) => normalizeKey(alias)));

  for (const [rawKey, rawValue] of Object.entries(record)) {
    if (!aliasSet.has(normalizeKey(rawKey))) {
      continue;
    }

    const text = asNonEmptyText(rawValue);
    if (text) {
      return text;
    }
  }

  return null;
};

const isLikelyPersonName = (value: string): boolean => {
  const compact = value.replace(/\s+/g, " ").trim();
  const lowered = compact.toLowerCase();

  if (!compact || compact.length > 80) {
    return false;
  }

  if (compact.includes("@") || /https?:\/\//i.test(compact)) {
    return false;
  }

  const blockedValues = new Set([
    "participant",
    "participants",
    "attendee",
    "attendees",
    "registration",
    "attendance",
    "confirmed",
    "success",
    "your",
    "you",
    "event",
    "details",
    "this",
    "that",
    "selected",
    "admin",
    "info",
    "support",
    "noreply",
    "no-reply",
  ]);

  if (blockedValues.has(lowered)) {
    return false;
  }

  if (
    lowered.includes("global azure") ||
    lowered.includes("bootcamp") ||
    lowered.includes("registration") ||
    lowered.includes("attendance confirmed")
  ) {
    return false;
  }

  return /^[A-Za-z][A-Za-z.'-]*(?:\s+[A-Za-z][A-Za-z.'-]*){0,5}$/.test(compact);
};

const asNameCandidate = (value: string | null): string | null => {
  if (!value) {
    return null;
  }

  const compact = value.replace(/\s+/g, " ").trim();
  return isLikelyPersonName(compact) ? compact : null;
};

const extractNameFromEmail = (value: string | null): string | null => {
  const email = asNonEmptyText(value);
  if (!email || !email.includes("@")) {
    return null;
  }

  const localPart = email.split("@")[0] || "";
  const formatted = localPart
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 4)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join(" ");

  return asNameCandidate(formatted);
};

const extractNameFromText = (value: string | null): string | null => {
  const text = asNonEmptyText(value);
  if (!text) {
    return null;
  }

  const compact = text.replace(/\s+/g, " ").trim();
  const patterns = [
    /\bhi\s+([A-Za-z][A-Za-z.'-]*(?:\s+[A-Za-z][A-Za-z.'-]*){0,5})[!,.]?/i,
    /\bfor\s+([A-Za-z][A-Za-z.'-]*(?:\s+[A-Za-z][A-Za-z.'-]*){0,5})[!,.]?/i,
    /\bparticipant\s*:\s*([A-Za-z][A-Za-z.'-]*(?:\s+[A-Za-z][A-Za-z.'-]*){0,5})\b/i,
    /\battendee\s*:\s*([A-Za-z][A-Za-z.'-]*(?:\s+[A-Za-z][A-Za-z.'-]*){0,5})\b/i,
  ];

  for (const pattern of patterns) {
    const match = compact.match(pattern);
    const candidate = asNameCandidate(match?.[1] ?? null);
    if (candidate) {
      return candidate;
    }
  }

  return null;
};

const getNameFromRecord = (record: Record<string, unknown>): string | null => {
  const directNameAliases = [
    "name",
    "full_name",
    "fullName",
    "fullname",
    "attendee_name",
    "attendeename",
    "participant_name",
    "participantname",
    "display_name",
    "displayName",
    "user_name",
    "username",
    "registrant_name",
    "registrantName",
    "person_name",
    "personName",
    "customer_name",
    "customerName",
  ];

  const directName = asNameCandidate(readTextByAlias(record, directNameAliases));
  if (directName) {
    return directName;
  }

  const firstName = asNameCandidate(
    readTextByAlias(record, [
      "first_name",
      "firstName",
      "firstname",
      "given_name",
      "givenName",
      "givenname",
      "fname",
      "first",
    ]),
  );
  const lastName = asNameCandidate(
    readTextByAlias(record, [
      "last_name",
      "lastName",
      "lastname",
      "surname",
      "family_name",
      "familyName",
      "familyname",
      "lname",
      "last",
    ]),
  );

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  if (firstName) {
    return firstName;
  }

  const nameFromText = extractNameFromText(
    readTextByAlias(record, [
      "message",
      "detail",
      "status_message",
      "statusMessage",
      "result_message",
      "resultMessage",
      "confirmation_message",
      "confirmationMessage",
      "description",
    ]),
  );

  if (nameFromText) {
    return nameFromText;
  }

  // Fallback when endpoint includes email but not an explicit attendee name.
  return extractNameFromEmail(
    readTextByAlias(record, ["email", "email_address", "emailAddress", "mail"]),
  );
};

const findNameInValue = (value: unknown, depth = 0): string | null => {
  if (depth > 5) {
    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const name = findNameInValue(item, depth + 1);
      if (name) {
        return name;
      }
    }
    return null;
  }

  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const directName = getNameFromRecord(record);
  if (directName) {
    return directName;
  }

  const nestedKeys = [
    "data",
    "user",
    "users",
    "profile",
    "profiles",
    "registration",
    "registration_data",
    "registrationData",
    "attendee",
    "attendee_details",
    "attendeeDetails",
    "participant",
    "participant_details",
    "participantDetails",
    "result",
    "payload",
    "details",
    "record",
    "item",
    "response",
  ];

  for (const key of nestedKeys) {
    const nestedName = findNameInValue(record[key], depth + 1);
    if (nestedName) {
      return nestedName;
    }
  }

  for (const nestedValue of Object.values(record)) {
    const nestedName = findNameInValue(nestedValue, depth + 1);
    if (nestedName) {
      return nestedName;
    }
  }

  return null;
};

const extractConfirmedName = (
  payload: ConfirmRegistrationResponse,
): string | null => {
  return findNameInValue(payload);
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const isExplicitFailureResponse = (
  payload: ConfirmRegistrationResponse,
): boolean => {
  const statusText = asNonEmptyText(payload.status)?.toLowerCase();
  const messageText = asNonEmptyText(payload.message)?.toLowerCase();
  const errorText =
    asNonEmptyText(payload.error) || asNonEmptyText(payload.error_message);

  if (payload.success === false || payload.ok === false) {
    return true;
  }

  if (statusText && ["error", "failed", "failure"].includes(statusText)) {
    return true;
  }

  if (errorText) {
    return true;
  }

  if (messageText && (messageText.includes("failed") || messageText.includes("error"))) {
    const hasSuccessSignal =
      payload.success === true ||
      payload.ok === true ||
      statusText === "success" ||
      statusText === "ok";

    if (!hasSuccessSignal) {
      return true;
    }
  }

  return false;
};

const AttendanceConfirmationPage = () => {
  const location = useLocation();
  const registrationId = useMemo(() => {
    const rawReg = new URLSearchParams(location.search).get("reg") || "";
    return rawReg.trim();
  }, [location.search]);

  const [status, setStatus] = useState<ConfirmState>("loading");
  const [confirmedName, setConfirmedName] = useState<string | null>(null);
  const [errorText, setErrorText] = useState("");
  const greetingName = confirmedName || "Participant";

  useEffect(() => {
    const images = ["bg.jpg", "bg2.png"];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const pageEl = document.getElementById("confirm-page");

    if (pageEl) {
      pageEl.style.background = `url('assets/img/${randomImage}') top center / cover no-repeat`;
    }
  }, []);

  useEffect(() => {
    if (!registrationId) {
      setStatus("error");
      setConfirmedName(null);
      setErrorText("This confirmation link is missing a registration reference.");
      return;
    }

    let cancelled = false;
    let successDelayTimer = 0;
    const startedAt = Date.now();

    const runConfirmation = async () => {
      setStatus("loading");
      setErrorText("");
      setConfirmedName(null);

      try {
        const response = await confirmRegistration(registrationId);
        console.log("[confirm-registration] response", response);

        if (cancelled) {
          return;
        }

        if (isExplicitFailureResponse(response)) {
          throw new Error(
            asNonEmptyText(response.error) ||
              asNonEmptyText(response.error_message) ||
              asNonEmptyText(response.message) ||
              "We could not confirm your attendance. Please try again later.",
          );
        }

        const confirmedNameFromResponse = extractConfirmedName(response);
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, LOADING_WINDOW_MS - elapsed);

        if (remaining === 0) {
          setConfirmedName(confirmedNameFromResponse);
          setStatus("success");
          return;
        }

        successDelayTimer = window.setTimeout(() => {
          if (cancelled) {
            return;
          }

          setConfirmedName(confirmedNameFromResponse);
          setStatus("success");
        }, remaining);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setStatus("error");
        setConfirmedName(null);
        setErrorText(
          getErrorMessage(
            error,
            "We could not confirm your attendance. Please try again later.",
          ),
        );
      }
    };

    void runConfirmation();

    return () => {
      cancelled = true;
      window.clearTimeout(successDelayTimer);
    };
  }, [registrationId]);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <main className="attendance-confirm-page" id="confirm-page">
        <div
          className="attendance-confirm-orb attendance-confirm-orb-one"
          aria-hidden="true"
        />
        <div
          className="attendance-confirm-orb attendance-confirm-orb-two"
          aria-hidden="true"
        />
        <div className="attendance-confirm-overlay" aria-hidden="true" />

        <section className="attendance-confirm-shell">
          <div className="attendance-confirm-logo-wrap">
            <img
              src="assets/img/globalazure2026.png"
              alt="Global Azure Bootcamp Logo"
              className="attendance-confirm-logo"
            />
          </div>

          <div
            className={`attendance-confirm-card attendance-confirm-card-${status}`}
            aria-live="polite"
          >
            {status === "loading" && (
              <>
                <div className="attendance-confirm-spinner" aria-hidden="true" />
                <h1 className="attendance-confirm-title">
                  Confirming your attendance
                </h1>
                <p className="attendance-confirm-text">
                  Please wait while we verify your registration details.
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="attendance-confirm-icon" aria-hidden="true">
                  <i className="bi bi-check-lg" />
                </div>
                <h1 className="attendance-confirm-title">Attendance Confirmed</h1>
                <div className="attendance-confirm-success-copy">
                  <p className="attendance-confirm-text">
                    {`Hi ${greetingName}, your attendance has been confirmed.`}
                  </p>
                  <p className="attendance-confirm-text attendance-confirm-text-muted">
                    We look forward to seeing you.
                  </p>
                  <p className="attendance-confirm-text attendance-confirm-text-highlight">
                    <span>Your QR code and event details have been sent to your email.</span>
                    <span>Please check your inbox.</span>
                  </p>
                </div>
                <Link to="/" className="attendance-confirm-button">
                  Back to Home
                </Link>
              </>
            )}

            {status === "error" && (
              <>
                <div className="attendance-confirm-icon" aria-hidden="true">
                  <i className="bi bi-exclamation-triangle" />
                </div>
                <h1 className="attendance-confirm-title">Confirmation Failed</h1>
                <p className="attendance-confirm-text">
                  {errorText || "This confirmation link is invalid or has expired."}
                </p>
                <Link to="/" className="attendance-confirm-button">
                  Go to Home
                </Link>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default AttendanceConfirmationPage;
