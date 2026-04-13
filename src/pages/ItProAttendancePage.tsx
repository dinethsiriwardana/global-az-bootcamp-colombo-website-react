import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import QrScanner from "../components/admin/attendance/QrScanner";
import {
  LOCAL_STORAGE_ADMIN_SECRET_KEY,
  listRegistrations,
  markAttendance,
  MarkAttendanceStatus,
} from "../utils/adminApi";
import { AdminRegistration } from "../types/admin";
import { extractRegistrationIdFromInput } from "../utils/attendanceQr";
import "./ItProAdminPage.css";
import "./ItProAttendancePage.css";

type AttendanceUiState =
  | "idle"
  | "scanner-starting"
  | "scanning"
  | "processing"
  | "success"
  | "warning"
  | "error";

type AttendanceResultState =
  | "success"
  | "already-attended"
  | "not-found"
  | "api-error"
  | "invalid-qr"
  | "camera-permission-denied";

type AttendanceSource = "qr" | "search";

interface ResultAttendeeInfo {
  name: string | null;
  email: string | null;
  profession: string | null;
  tshirtSize: string | null;
  foodPreference: string | null;
}

interface AttendanceResultItem {
  id: string;
  status: AttendanceResultState;
  registrationId: string | null;
  message: string;
  scannedAt: number;
  attended: boolean | null;
  attendedAt: string | null;
  attendee: ResultAttendeeInfo;
}

interface LastScanRecord {
  value: string;
  at: number;
}

const SCAN_COOLDOWN_MS = 4000;
const AUTO_SCAN_RESUME_DELAY_MS = 2500;
const RECENT_DUPLICATE_WINDOW_MS = 5000;
const SEARCH_DEBOUNCE_MS = 300;
const MAX_RECENT_SCANS = 10;
const MAX_SEARCH_RESULTS = 12;

type RecentTrackableStatus = "success" | "already-attended" | "not-found" | "api-error";

const STATUS_META: Record<
  AttendanceResultState,
  { label: string; className: string; icon: string }
> = {
  success: {
    label: "Success",
    className: "attendance-result-success",
    icon: "bi-check-circle",
  },
  "already-attended": {
    label: "Already Attended",
    className: "attendance-result-already-attended",
    icon: "bi-person-check",
  },
  "invalid-qr": {
    label: "Invalid QR",
    className: "attendance-result-invalid-qr",
    icon: "bi-upc-scan",
  },
  "not-found": {
    label: "Not Found",
    className: "attendance-result-not-found",
    icon: "bi-search",
  },
  "api-error": {
    label: "API Error",
    className: "attendance-result-api-error",
    icon: "bi-exclamation-triangle",
  },
  "camera-permission-denied": {
    label: "Camera Denied",
    className: "attendance-result-camera-permission-denied",
    icon: "bi-camera-video-off",
  },
};

const UI_STATE_META: Record<AttendanceUiState, { label: string; className: string }> = {
  idle: {
    label: "Idle",
    className: "attendance-state-idle",
  },
  "scanner-starting": {
    label: "Scanner Starting",
    className: "attendance-state-scanner-starting",
  },
  scanning: {
    label: "Scanning",
    className: "attendance-state-scanning",
  },
  processing: {
    label: "Processing",
    className: "attendance-state-processing",
  },
  success: {
    label: "Success",
    className: "attendance-state-success",
  },
  warning: {
    label: "Warning",
    className: "attendance-state-warning",
  },
  error: {
    label: "Error",
    className: "attendance-state-error",
  },
};

const RESULT_CARD_META: Record<
  AttendanceResultState,
  {
    title: string;
    subtitle: string;
    cardClassName: string;
  }
> = {
  success: {
    title: "✅ Attendance Marked",
    subtitle: "Successfully checked in",
    cardClassName: "attendance-result-card-success",
  },
  "already-attended": {
    title: "⚠️ Already Checked In",
    subtitle: "This attendee has already been marked present",
    cardClassName: "attendance-result-card-warning",
  },
  "not-found": {
    title: "❌ Invalid QR",
    subtitle: "Registration not found or not eligible",
    cardClassName: "attendance-result-card-error",
  },
  "api-error": {
    title: "❌ Invalid QR",
    subtitle: "Registration not found or not eligible",
    cardClassName: "attendance-result-card-error",
  },
  "invalid-qr": {
    title: "❌ Invalid QR",
    subtitle: "Registration not found or not eligible",
    cardClassName: "attendance-result-card-error",
  },
  "camera-permission-denied": {
    title: "❌ Camera Access Required",
    subtitle: "Camera access is required to scan QR codes",
    cardClassName: "attendance-result-card-error",
  },
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
};

const asNonEmptyText = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
};

const normalizeKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const findNameInPayload = (value: unknown, depth = 0): string | null => {
  if (depth > 5) {
    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findNameInPayload(item, depth + 1);
      if (found) {
        return found;
      }
    }

    return null;
  }

  const record = asRecord(value);
  if (!record) {
    return null;
  }

  for (const [rawKey, rawValue] of Object.entries(record)) {
    const normalized = normalizeKey(rawKey);
    if (!["name", "fullname", "attendeename", "participantname"].includes(normalized)) {
      continue;
    }

    const text = asNonEmptyText(rawValue);
    if (text) {
      return text;
    }
  }

  for (const nested of Object.values(record)) {
    const found = findNameInPayload(nested, depth + 1);
    if (found) {
      return found;
    }
  }

  return null;
};

const toResultStatus = (
  status: MarkAttendanceStatus,
): Exclude<AttendanceResultState, "invalid-qr" | "camera-permission-denied"> => {
  if (status === "success") {
    return "success";
  }

  if (status === "already-attended") {
    return "already-attended";
  }

  if (status === "not-found") {
    return "not-found";
  }

  return "api-error";
};

const toUiState = (
  status: AttendanceResultState,
): Exclude<AttendanceUiState, "idle" | "scanner-starting" | "scanning" | "processing"> => {
  if (status === "success") {
    return "success";
  }

  if (status === "already-attended") {
    return "warning";
  }

  return "error";
};

const isTrackableRecentStatus = (
  status: AttendanceResultState,
): status is RecentTrackableStatus => {
  return ["success", "already-attended", "not-found", "api-error"].includes(status);
};

const formatBoolean = (value: boolean | null | undefined) => {
  if (value === null || value === undefined) {
    return "-";
  }

  return value ? "Yes" : "No";
};

const formatDateTime = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const date = typeof value === "number" ? new Date(value) : new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
};

const getAttendanceStatusLabel = (registration: AdminRegistration) => {
  if (registration.attended === true) {
    return "Attended";
  }

  if (registration.attended === false) {
    return "Not Attended";
  }

  return "Unknown";
};

const ItProAttendancePage = () => {
  const [adminSecretPresent, setAdminSecretPresent] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [secretError, setSecretError] = useState<string | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannerMessage, setScannerMessage] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<AttendanceResultItem | null>(null);
  const [recentScans, setRecentScans] = useState<AttendanceResultItem[]>([]);
  const [uiState, setUiState] = useState<AttendanceUiState>("idle");
  const [allRegistrations, setAllRegistrations] = useState<AdminRegistration[]>([]);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchActionRegistrationId, setSearchActionRegistrationId] = useState<
    string | null
  >(null);

  const processingLockRef = useRef(false);
  const releaseLockTimeoutRef = useRef<number | null>(null);
  const lastQrValueRef = useRef<LastScanRecord | null>(null);
  const lastProcessedValueRef = useRef<LastScanRecord | null>(null);

  useEffect(() => {
    const images = ["bg.jpg", "bg2.png"];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const pageEl = document.getElementById("itpro-attendance-page");

    if (pageEl) {
      pageEl.style.background = `url('assets/img/${randomImage}') top center / cover no-repeat`;
    }
  }, []);

  useEffect(() => {
    const storedSecret = window.localStorage.getItem(LOCAL_STORAGE_ADMIN_SECRET_KEY);
    if (storedSecret?.trim()) {
      setAdminSecretPresent(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (releaseLockTimeoutRef.current !== null) {
        window.clearTimeout(releaseLockTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const invalidateStoredSecret = useCallback((message: string) => {
    const lowered = message.toLowerCase();

    if (!lowered.includes("forbidden") && !lowered.includes("unauthorized")) {
      return;
    }

    window.localStorage.removeItem(LOCAL_STORAGE_ADMIN_SECRET_KEY);
    setAdminSecretPresent(false);
    setIsScannerActive(false);
    setSecretError("Saved admin secret is invalid. Please enter it again.");
  }, []);

  useEffect(() => {
    if (!adminSecretPresent) {
      return;
    }

    let isCancelled = false;

    const loadRegistrations = async () => {
      setIsLoadingRegistrations(true);
      setSearchError(null);

      try {
        const registrations = await listRegistrations();

        if (!isCancelled) {
          setAllRegistrations(registrations);
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        const message = getErrorMessage(
          error,
          "Unable to load attendee records for manual search.",
        );

        invalidateStoredSecret(message);
        setSearchError(message);
      } finally {
        if (!isCancelled) {
          setIsLoadingRegistrations(false);
        }
      }
    };

    void loadRegistrations();

    return () => {
      isCancelled = true;
    };
  }, [adminSecretPresent, invalidateStoredSecret]);

  const registrationsById = useMemo(() => {
    const map = new Map<string, AdminRegistration>();

    allRegistrations.forEach((registration) => {
      if (registration.registration_id) {
        map.set(registration.registration_id, registration);
      }
    });

    return map;
  }, [allRegistrations]);

  const searchResults = useMemo(() => {
    const normalized = debouncedSearchTerm.toLowerCase();
    if (!normalized) {
      return [];
    }

    return allRegistrations
      .filter((registration) => {
        const name = registration.name.toLowerCase();

        return name.includes(normalized);
      })
      .slice(0, MAX_SEARCH_RESULTS);
  }, [allRegistrations, debouncedSearchTerm]);

  const appendRecentScan = useCallback((item: AttendanceResultItem) => {
    setRecentScans((current) => {
      const duplicateIndex = current.findIndex((existing) => {
        if (!existing.registrationId || !item.registrationId) {
          return false;
        }

        const isSameAttendee = existing.registrationId === item.registrationId;
        const isRecent = Math.abs(item.scannedAt - existing.scannedAt) < RECENT_DUPLICATE_WINDOW_MS;

        return isSameAttendee && isRecent;
      });

      if (duplicateIndex === 0) {
        return [{ ...current[0], ...item, id: current[0].id }, ...current.slice(1)].slice(
          0,
          MAX_RECENT_SCANS,
        );
      }

      if (duplicateIndex > 0) {
        const existing = current[duplicateIndex];
        const merged = { ...existing, ...item, id: existing.id };
        const remaining = current.filter((_, index) => index !== duplicateIndex);

        return [merged, ...remaining].slice(0, MAX_RECENT_SCANS);
      }

      return [item, ...current].slice(0, MAX_RECENT_SCANS);
    });
  }, []);

  const processAttendance = useCallback(
    async (
      registrationId: string,
      source: AttendanceSource,
      preferredName?: string | null,
    ) => {
      const normalizedRegistrationId = registrationId.trim();
      if (!normalizedRegistrationId) {
        return;
      }

      const now = Date.now();
      const lastProcessed = lastProcessedValueRef.current;

      if (processingLockRef.current) {
        return;
      }

      if (
        lastProcessed &&
        lastProcessed.value === normalizedRegistrationId &&
        now - lastProcessed.at < SCAN_COOLDOWN_MS
      ) {
        return;
      }

      processingLockRef.current = true;
      lastProcessedValueRef.current = {
        value: normalizedRegistrationId,
        at: now,
      };

      setIsProcessing(true);
      setUiState("processing");
      setScannerMessage(null);

      try {
        const apiResult = await markAttendance(normalizedRegistrationId);
        const status = toResultStatus(apiResult.status);
        const resolvedRegistrationId =
          apiResult.registration?.id || apiResult.registrationId || normalizedRegistrationId;
        const resolvedRegistration = registrationsById.get(resolvedRegistrationId);
        const resolvedAttendee: ResultAttendeeInfo = {
          name:
            preferredName?.trim() ||
            resolvedRegistration?.name.trim() ||
            findNameInPayload(apiResult.payload),
          email: resolvedRegistration?.email?.trim() || null,
          profession: resolvedRegistration?.profession?.trim() || null,
          tshirtSize: resolvedRegistration?.tshirt_size?.trim() || null,
          foodPreference: resolvedRegistration?.food_preference?.trim() || null,
        };
        const attended =
          apiResult.registration?.attended ??
          (status === "success" || status === "already-attended" ? true : null);
        const attendedAt =
          apiResult.registration?.attended_at || resolvedRegistration?.attended_at || null;

        const resultItem: AttendanceResultItem = {
          id: `${Date.now()}-${resolvedRegistrationId}`,
          status,
          registrationId: resolvedRegistrationId,
          message: apiResult.message || "Attendance request finished.",
          scannedAt: Date.now(),
          attended,
          attendedAt,
          attendee: {
            name: resolvedAttendee.name || null,
            email: resolvedAttendee.email,
            profession: resolvedAttendee.profession,
            tshirtSize: resolvedAttendee.tshirtSize,
            foodPreference: resolvedAttendee.foodPreference,
          },
        };

        setCurrentResult(resultItem);

        if (isTrackableRecentStatus(status)) {
          appendRecentScan(resultItem);
        }

        setUiState(toUiState(status));

        if (status === "api-error") {
          invalidateStoredSecret(resultItem.message);
        }

        if (attended !== null) {
          setAllRegistrations((current) => {
            return current.map((registration) => {
              if (registration.registration_id !== resolvedRegistrationId) {
                return registration;
              }

              return {
                ...registration,
                attended,
                attended_at: apiResult.registration?.attended_at || registration.attended_at,
              };
            });
          });
        }
      } catch (error) {
        const message = getErrorMessage(error, "Failed to call attendance API. Please try again.");
        const resolvedRegistration = registrationsById.get(normalizedRegistrationId);

        invalidateStoredSecret(message);

        const resultItem: AttendanceResultItem = {
          id: `${Date.now()}-${normalizedRegistrationId}-error`,
          status: "api-error",
          registrationId: normalizedRegistrationId,
          message,
          scannedAt: Date.now(),
          attended: null,
          attendedAt: null,
          attendee: {
            name: preferredName?.trim() || resolvedRegistration?.name.trim() || null,
            email: resolvedRegistration?.email?.trim() || null,
            profession: resolvedRegistration?.profession?.trim() || null,
            tshirtSize: resolvedRegistration?.tshirt_size?.trim() || null,
            foodPreference: resolvedRegistration?.food_preference?.trim() || null,
          },
        };

        setCurrentResult(resultItem);
        appendRecentScan(resultItem);
        setUiState("error");
      } finally {
        if (source === "search") {
          setSearchActionRegistrationId(null);
        }

        if (releaseLockTimeoutRef.current !== null) {
          window.clearTimeout(releaseLockTimeoutRef.current);
        }

        releaseLockTimeoutRef.current = window.setTimeout(() => {
          processingLockRef.current = false;
          setIsProcessing(false);
          releaseLockTimeoutRef.current = null;
        }, AUTO_SCAN_RESUME_DELAY_MS);
      }
    },
    [appendRecentScan, invalidateStoredSecret, registrationsById],
  );

  const handleQrDetected = useCallback(
    (rawValue: string) => {
      const normalizedRawValue = rawValue.trim();
      if (!normalizedRawValue || processingLockRef.current) {
        return;
      }

      const now = Date.now();
      const lastRawValue = lastQrValueRef.current;

      if (
        lastRawValue &&
        lastRawValue.value === normalizedRawValue &&
        now - lastRawValue.at < SCAN_COOLDOWN_MS
      ) {
        return;
      }

      lastQrValueRef.current = {
        value: normalizedRawValue,
        at: now,
      };

      const registrationId = extractRegistrationIdFromInput(normalizedRawValue);

      if (!registrationId) {
        setUiState("error");
        setCurrentResult({
          id: `${Date.now()}-invalid`,
          status: "invalid-qr",
          registrationId: null,
          message: "Invalid QR payload. QR must contain a UUID or JSON with registration_id.",
          scannedAt: Date.now(),
          attended: null,
          attendedAt: null,
          attendee: {
            name: null,
            email: null,
            profession: null,
            tshirtSize: null,
            foodPreference: null,
          },
        });
        return;
      }

      void processAttendance(registrationId, "qr");
    },
    [processAttendance],
  );

  const handleSearchMarkAttendance = useCallback(
    (registration: AdminRegistration) => {
      if (processingLockRef.current || !registration.registration_id) {
        return;
      }

      setSearchActionRegistrationId(registration.registration_id);
      void processAttendance(registration.registration_id, "search", registration.name || null);
    },
    [processAttendance],
  );

  const handleSecretSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSecret = secretInput.trim();
    if (!trimmedSecret) {
      setSecretError("Please enter the admin secret.");
      return;
    }

    try {
      window.localStorage.setItem(LOCAL_STORAGE_ADMIN_SECRET_KEY, trimmedSecret);
      setSecretError(null);
      setSecretInput("");
      setAdminSecretPresent(true);
    } catch {
      setSecretError("Unable to save admin secret to local storage.");
    }
  };

  const handlePermissionDenied = useCallback(
    (_message: string) => {
      const permissionMessage = "Camera access is required to scan QR codes";
      setIsScannerActive(false);
      setUiState("error");
      setScannerMessage(permissionMessage);
      setCurrentResult({
        id: `${Date.now()}-camera-permission`,
        status: "camera-permission-denied",
        registrationId: null,
        message: permissionMessage,
        scannedAt: Date.now(),
        attended: null,
        attendedAt: null,
        attendee: {
          name: null,
          email: null,
          profession: null,
          tshirtSize: null,
          foodPreference: null,
        },
      });
    },
    [],
  );

  const handleScannerError = useCallback((message: string) => {
    setScannerMessage(message);

    if (message) {
      setUiState("error");
    }
  }, []);

  const handleScannerStarted = useCallback(() => {
    if (!processingLockRef.current) {
      setUiState("scanning");
    }
  }, []);

  const handleStartScanner = useCallback(() => {
    setScannerMessage(null);
    setUiState("scanner-starting");
    setIsScannerActive(true);
  }, []);

  const handleStopScanner = useCallback(() => {
    setIsScannerActive(false);

    if (!isProcessing) {
      setUiState("idle");
    }
  }, [isProcessing]);

  const currentResultMeta = currentResult ? RESULT_CARD_META[currentResult.status] : null;
  const uiMeta = UI_STATE_META[uiState];

  const searchHintText = debouncedSearchTerm
    ? searchResults.length
      ? null
      : "No attendees found for that name."
    : "Type at least part of a name to search attendees.";

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <main className="itpro-admin-page" id="itpro-attendance-page">
        <div className="itpro-admin-orb orb-1" aria-hidden="true" />
        <div className="itpro-admin-orb orb-2" aria-hidden="true" />
        <div className="itpro-admin-bg-overlay" aria-hidden="true" />

        <div className="itpro-admin-wrapper">
          <div className="itpro-admin-logo-wrap">
            <img
              src="assets/img/globalazure2026.png"
              alt="Global Azure Bootcamp Logo"
              className="itpro-admin-logo"
            />
          </div>

          <section className="itpro-admin-shell">
            <header className="itpro-admin-header">
              <div className="itpro-admin-badge">
                <span className="itpro-admin-badge-dot" /> IT Pro Admin
              </div>
              <h1>Attendance Scanner</h1>
              <p className="itpro-admin-subtitle">
                Scan attendee QR code to mark attendance
              </p>
            </header>

            {!adminSecretPresent ? (
              <div className="admin-secret-card">
                <h2>Enter admin secret</h2>
                <p>
                  To access the attendance scanner, enter your
                  <strong> Admin Key</strong>
                </p>
                {secretError ? (
                  <div className="admin-alert error" role="alert">
                    {secretError}
                  </div>
                ) : null}
                <form className="admin-secret-form" onSubmit={handleSecretSubmit}>
                  <input
                    className="admin-secret-input"
                    type="password"
                    value={secretInput}
                    onChange={(event) => {
                      setSecretInput(event.target.value);
                      if (secretError) {
                        setSecretError(null);
                      }
                    }}
                    placeholder="Admin secret"
                    aria-label="Admin secret"
                  />
                  <button className="admin-secret-submit" type="submit">
                    Save secret
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className={`attendance-state-pill ${uiMeta.className}`}>
                  <span className="attendance-state-dot" aria-hidden="true" />
                  State: {uiMeta.label}
                </div>

                <div className="attendance-admin-grid">
                  <section className="attendance-panel" aria-label="QR scanner panel">
                    <div className="attendance-panel-header">
                      <h2>Scanner</h2>
                      <div className="attendance-panel-controls">
                        <div className="attendance-panel-actions">
                          <button
                            type="button"
                            className="attendance-action-button attendance-action-start"
                            onClick={handleStartScanner}
                            disabled={isScannerActive || isProcessing}
                          >
                            <i className="bi bi-play-fill" aria-hidden="true" /> Start Scanner
                          </button>
                          <button
                            type="button"
                            className="attendance-action-button attendance-action-stop"
                            onClick={handleStopScanner}
                            disabled={!isScannerActive || isProcessing}
                          >
                            <i className="bi bi-stop-fill" aria-hidden="true" /> Stop Scanner
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="attendance-helper-text">
                      Click Start Scanner, then point the camera at the attendee QR code.
                      Detection and attendance marking happen automatically with duplicate
                      protection.
                    </p>

                    <QrScanner
                      isRunning={isScannerActive}
                      onDetected={handleQrDetected}
                      onPermissionDenied={handlePermissionDenied}
                      onScannerError={handleScannerError}
                      onScannerStarted={handleScannerStarted}
                    />

                    {scannerMessage ? (
                      <div className="admin-alert error attendance-inline-alert" role="alert">
                        {scannerMessage}
                      </div>
                    ) : null}

                    {isProcessing ? (
                      <div className="admin-table-state attendance-processing-state" role="status">
                        <span className="admin-spinner" aria-hidden="true" />
                        Verifying and marking attendance...
                      </div>
                    ) : null}

                    <section className="attendance-search-block" aria-label="Manual attendee search">
                      <h3>Search attendee manually</h3>
                      <div className="attendance-search-input-wrap">
                        <i className="bi bi-search" aria-hidden="true" />
                        <input
                          className="attendance-search-input"
                          type="text"
                          value={searchTerm}
                          onChange={(event) => setSearchTerm(event.target.value)}
                          placeholder="Search by attendee name"
                          disabled={isProcessing || isLoadingRegistrations}
                        />
                      </div>

                      {isLoadingRegistrations ? (
                        <div className="admin-table-state attendance-search-state" role="status">
                          <span className="admin-spinner" aria-hidden="true" />
                          Loading attendees...
                        </div>
                      ) : null}

                      {searchError ? (
                        <div className="admin-alert error attendance-inline-alert" role="alert">
                          {searchError}
                        </div>
                      ) : null}

                      {!isLoadingRegistrations && !searchError && searchHintText ? (
                        <p className="attendance-search-hint">{searchHintText}</p>
                      ) : null}

                      {!isLoadingRegistrations && !searchError && searchResults.length ? (
                        <ul className="attendance-search-results">
                          {searchResults.map((registration) => {
                            const isActionLoading =
                              isProcessing &&
                              searchActionRegistrationId === registration.registration_id;

                            return (
                              <li key={registration.registration_id} className="attendance-search-item">
                                <div className="attendance-search-item-main">
                                  <p className="attendance-search-name">{registration.name || "-"}</p>
                                  <p className="attendance-search-email">{registration.email || "-"}</p>
                                  <div className="attendance-search-meta">
                                    <span>Profession: {registration.profession || "-"}</span>
                                    <span>T-shirt: {registration.tshirt_size || "-"}</span>
                                    <span>Food: {registration.food_preference || "-"}</span>
                                    <span>Status: {getAttendanceStatusLabel(registration)}</span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="attendance-action-button attendance-action-submit"
                                  onClick={() => handleSearchMarkAttendance(registration)}
                                  disabled={isProcessing}
                                >
                                  {isActionLoading ? "Marking..." : "Mark as Attended"}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </section>
                  </section>

                  <section className="attendance-panel" aria-label="Attendance results panel">
                    <div className="attendance-panel-header attendance-panel-header-tight">
                      <h2>Scan result</h2>
                      <Link to="/itproadmin" className="attendance-back-link">
                        Back to approvals
                      </Link>
                    </div>

                    {currentResult && currentResultMeta ? (
                      <article className={`attendance-result-card ${currentResultMeta.cardClassName}`}>
                        <header className="attendance-result-header">
                          <h3>{currentResultMeta.title}</h3>
                          <p>{currentResultMeta.subtitle}</p>
                        </header>

                        {currentResult.status === "success" ||
                        currentResult.status === "already-attended" ? (
                          <>
                            <p className="attendance-result-name-primary">
                              {currentResult.attendee.name || "-"}
                            </p>

                            <dl className="attendance-result-detail-grid">
                              <div>
                                <dt>Email</dt>
                                <dd>{currentResult.attendee.email || "-"}</dd>
                              </div>
                              <div>
                                <dt>Profession</dt>
                                <dd>{currentResult.attendee.profession || "-"}</dd>
                              </div>
                              <div>
                                <dt>T-shirt size</dt>
                                <dd>{currentResult.attendee.tshirtSize || "-"}</dd>
                              </div>
                              <div>
                                <dt>Food preference</dt>
                                <dd>{currentResult.attendee.foodPreference || "-"}</dd>
                              </div>
                            </dl>

                            <p className="attendance-result-time-line">
                              {currentResult.status === "already-attended"
                                ? "Previously checked in at:"
                                : "Checked in at:"}{" "}
                              <strong>
                                {formatDateTime(currentResult.attendedAt || currentResult.scannedAt)}
                              </strong>
                            </p>
                          </>
                        ) : (
                          <p className="attendance-result-time-line">
                            {currentResultMeta.subtitle}
                          </p>
                        )}
                      </article>
                    ) : (
                      <div className="admin-table-state attendance-empty-result" role="status">
                        Scan a QR or mark attendance from search results.
                      </div>
                    )}

                    <div className="attendance-recent">
                      <h3>Recent scans</h3>
                      {!recentScans.length ? (
                        <p className="attendance-recent-empty">No scans yet in this session.</p>
                      ) : (
                        <div className="attendance-recent-table-wrap">
                          <table className="attendance-recent-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Attended</th>
                                <th>Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {recentScans.map((scan) => {
                                const scanMeta = STATUS_META[scan.status];

                                return (
                                  <tr key={scan.id}>
                                    <td>{scan.attendee.name || "-"}</td>
                                    <td>
                                      <span
                                        className={`attendance-recent-badge ${scanMeta.className}`}
                                      >
                                        {scanMeta.label}
                                      </span>
                                    </td>
                                    <td>{formatBoolean(scan.attended)}</td>
                                    <td>{formatDateTime(scan.scannedAt)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </>
            )}
          </section>

          <p className="itpro-admin-disclaimer">
            Your data is secure · Attendance operations are logged
          </p>
        </div>
      </main>
    </>
  );
};

export default ItProAttendancePage;
