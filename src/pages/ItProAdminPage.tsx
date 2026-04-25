import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminTable from "../components/admin/AdminTable";
import FilterBar from "../components/admin/FilterBar";
import SearchInput from "../components/admin/SearchInput";
import {
  AdminAction,
  AdminFilterStatus,
  AdminRegistration,
} from "../types/admin";
import {
  listRegistrations,
  updateRegistrationStatus,
} from "../utils/adminApi";
import "./ItProAdminPage.css";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const LOCAL_STORAGE_ADMIN_SECRET_KEY = "REACT_APP_ADMIN_SECRET";
const ALL_USER_TYPES = "all";
const ALL_TSHIRT_SIZES = "all";
const ALL_FOOD_PREFERENCES = "all";
const USER_TYPE_OPTIONS = [
  { label: "Undergraduate", value: "Undergraduate" },
  { label: "Working Professional", value: "Working professional" },
];
const DEFAULT_TSHIRT_SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
const DEFAULT_FOOD_PREFERENCE_OPTIONS = ["veg", "non-veg"];
const CSV_EXPORT_HEADERS = [
  "Name",
  "Email",
  "Profession",
  "Organization",
  "T-shirt size",
  "Food preference",
  "Approval Status",
  "Confirmation Status",
];

const sanitizeOptionalValue = (value: string | undefined) => {
  return value?.trim() ?? "";
};

const buildFilterOptions = (values: Array<string | undefined>) => {
  const optionSet = new Set<string>();

  values.forEach((value) => {
    const trimmed = sanitizeOptionalValue(value);
    if (!trimmed) {
      return;
    }

    optionSet.add(trimmed);
  });

  return Array.from(optionSet.values()).sort((left, right) => {
    return left.localeCompare(right, undefined, { sensitivity: "base" });
  });
};

const mergeFilterOptions = (defaults: string[], dynamic: string[]) => {
  const merged = [...defaults, ...dynamic];
  const mergedSet = new Set<string>();

  return merged.filter((value) => {
    const trimmed = sanitizeOptionalValue(value);
    if (!trimmed || mergedSet.has(trimmed)) {
      return false;
    }

    mergedSet.add(trimmed);
    return true;
  });
};

const formatCsvValue = (value: unknown) => {
  if (value === undefined || value === null) {
    return '""';
  }

  const escapedValue = String(value).replace(/"/g, '""');
  return `"${escapedValue}"`;
};

const toSentenceCase = (value: string | undefined) => {
  const normalizedValue = sanitizeOptionalValue(value);
  if (!normalizedValue) {
    return "";
  }

  return (
    normalizedValue.charAt(0).toUpperCase() +
    normalizedValue.slice(1).toLowerCase()
  );
};

const registrationMatchesStatus = (
  registration: AdminRegistration,
  status: AdminFilterStatus,
) => {
  if (status === "all") {
    return true;
  }

  if (status === "confirmed") {
    return Boolean(registration.is_confirmed);
  }

  return registration.status.toLowerCase() === status;
};

const ItProAdminPage = () => {
  const [statusFilter, setStatusFilter] = useState<AdminFilterStatus>("pending");
  const [userTypeFilter, setUserTypeFilter] = useState<string>(ALL_USER_TYPES);
  const [tshirtSizeFilter, setTshirtSizeFilter] = useState<string>(ALL_TSHIRT_SIZES);
  const [foodPreferenceFilter, setFoodPreferenceFilter] =
    useState<string>(ALL_FOOD_PREFERENCES);
  const [searchTerm, setSearchTerm] = useState("");
  const [registrations, setRegistrations] = useState<AdminRegistration[]>([]);
  const [allRegistrations, setAllRegistrations] = useState<AdminRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [adminSecretPresent, setAdminSecretPresent] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [secretError, setSecretError] = useState<string | null>(null);

  useEffect(() => {
    const images = ["bg.jpg", "bg2.png"];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const pageEl = document.getElementById("itpro-admin-page");

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

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data =
        statusFilter === "confirmed" || statusFilter === "all"
          ? await listRegistrations()
          : await listRegistrations(statusFilter);

      const filteredData =
        statusFilter === "confirmed"
          ? data.filter((registration) => registration.is_confirmed)
          : data;

      setRegistrations(filteredData);
    } catch (fetchError) {
      const message = getErrorMessage(
        fetchError,
        "Failed to load registrations. Please try again.",
      );

      if (typeof message === "string" && message.toLowerCase().includes("forbidden")) {
        window.localStorage.removeItem(LOCAL_STORAGE_ADMIN_SECRET_KEY);
        setAdminSecretPresent(false);
        setSecretError("Saved admin secret is invalid. Please enter it again.");
      }

      setError(message);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const fetchAllRegistrations = useCallback(async () => {
    try {
      const data = await listRegistrations();
      setAllRegistrations(data);
    } catch (fetchError) {
      const message = getErrorMessage(
        fetchError,
        "Failed to load registration summary. Please try again.",
      );
      setError(message);
      setAllRegistrations([]);
    }
  }, []);

  useEffect(() => {
    if (!adminSecretPresent) {
      return;
    }

    void fetchRegistrations();
  }, [fetchRegistrations, adminSecretPresent]);

  useEffect(() => {
    if (!adminSecretPresent) {
      return;
    }

    void fetchAllRegistrations();
  }, [fetchAllRegistrations, adminSecretPresent]);

  useEffect(() => {
    if (!feedbackMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [feedbackMessage]);

  const tshirtSizeOptions = useMemo(() => {
    return mergeFilterOptions(
      DEFAULT_TSHIRT_SIZE_OPTIONS,
      buildFilterOptions(
        allRegistrations.map((registration) => registration.tshirt_size),
      ),
    );
  }, [allRegistrations]);

  const foodPreferenceOptions = useMemo(() => {
    return mergeFilterOptions(
      DEFAULT_FOOD_PREFERENCE_OPTIONS,
      buildFilterOptions(
        allRegistrations.map((registration) => registration.food_preference),
      ),
    );
  }, [allRegistrations]);

  const filteredRegistrations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const selectedUserType = sanitizeOptionalValue(userTypeFilter);
    const selectedTshirtSize = sanitizeOptionalValue(tshirtSizeFilter);
    const selectedFoodPreference = sanitizeOptionalValue(foodPreferenceFilter);

    return registrations.filter((registration) => {
      const matchesSearch =
        !normalizedSearch ||
        registration.name.toLowerCase().includes(normalizedSearch) ||
        registration.email.toLowerCase().includes(normalizedSearch);

      const matchesTshirtSize =
        tshirtSizeFilter === ALL_TSHIRT_SIZES ||
        sanitizeOptionalValue(registration.tshirt_size) === selectedTshirtSize;

      const matchesFoodPreference =
        foodPreferenceFilter === ALL_FOOD_PREFERENCES ||
        sanitizeOptionalValue(registration.food_preference) === selectedFoodPreference;

      const matchesUserType =
        userTypeFilter === ALL_USER_TYPES ||
        sanitizeOptionalValue(registration.profession) === selectedUserType;

      return (
        matchesSearch &&
        matchesUserType &&
        matchesTshirtSize &&
        matchesFoodPreference
      );
    });
  }, [registrations, searchTerm, userTypeFilter, tshirtSizeFilter, foodPreferenceFilter]);

  const registrationSummary = useMemo(() => {
    return allRegistrations.reduce(
      (summary, registration) => {
        const currentStatus = registration.status.toLowerCase();

        if (currentStatus === "pending") {
          summary.pending += 1;
        } else if (currentStatus === "approved") {
          summary.approved += 1;
        } else if (currentStatus === "rejected") {
          summary.rejected += 1;
        }

        if (registration.is_confirmed) {
          summary.confirmed += 1;
        }

        return summary;
      },
      {
        pending: 0,
        approved: 0,
        rejected: 0,
        confirmed: 0,
      },
    );
  }, [allRegistrations]);

  const handleAction = async (registrationId: string, action: AdminAction) => {
    const nextStatus = action;
    const currentSnapshot = registrations;

    setActionLoadingId(registrationId);
    setError(null);
    setFeedbackMessage(null);

    setRegistrations((current) => {
      return current
        .map((registration) => {
          if (registration.registration_id !== registrationId) {
            return registration;
          }

          return {
            ...registration,
            status: nextStatus,
          };
        })
        .filter((registration) => registrationMatchesStatus(registration, statusFilter));
    });

    try {
      await updateRegistrationStatus(registrationId, action);
      setFeedbackMessage(`Registration ${action} successfully.`);
      void fetchAllRegistrations();
    } catch (actionError) {
      setRegistrations(currentSnapshot);
      setError(
        getErrorMessage(
          actionError,
          "Could not update registration status. Please retry.",
        ),
      );
    } finally {
      setActionLoadingId(null);
    }
  };

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

  const hasRegistrationsForExport = filteredRegistrations.length > 0;

  const handleDownloadCsv = useCallback(() => {
    if (!hasRegistrationsForExport) {
      setFeedbackMessage("No registered members available for export.");
      return;
    }

    const csvRows = filteredRegistrations.map((registration) => {
      return [
        registration.name,
        registration.email,
        registration.profession,
        registration.organization,
        registration.tshirt_size,
        registration.food_preference,
        toSentenceCase(registration.status),
        registration.is_confirmed ? "Confirmed" : "Not Confirmed",
      ];
    });

    const csvData = [CSV_EXPORT_HEADERS, ...csvRows]
      .map((row) => row.map((value) => formatCsvValue(value)).join(","))
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${statusFilter}_registered_members.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }, [filteredRegistrations, hasRegistrationsForExport, statusFilter]);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <main className="itpro-admin-page" id="itpro-admin-page">
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
              <h1>
                Registration <span>Approvals</span>
              </h1>
              <p className="itpro-admin-subtitle">
                Review pending attendees, search quickly, and approve or reject
                in one click.
              </p>
            </header>

            {!adminSecretPresent ? (
              <div className="admin-secret-card">
                <h2>Enter admin secret</h2>
                <p>
                  To access the admin panel, enter your 
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
                <section className="itpro-admin-top-actions" aria-label="Attendance actions">
                  <Link to="/itproadmin/attendance" className="itpro-admin-attendance-button">
                    <i className="bi bi-qr-code-scan" aria-hidden="true" />
                    Scan QR / Mark Attendance
                  </Link>
                </section>

                <section className="itpro-admin-toolbar" aria-label="Admin controls">
                  <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    disabled={loading}
                    placeholder="Search by email, name, or organization"
                  />
                  <FilterBar
                    status={statusFilter}
                    onChange={setStatusFilter}
                    onDownloadCsv={handleDownloadCsv}
                    userType={userTypeFilter}
                    onUserTypeChange={setUserTypeFilter}
                    userTypeOptions={USER_TYPE_OPTIONS}
                    tshirtSize={tshirtSizeFilter}
                    onTshirtSizeChange={setTshirtSizeFilter}
                    tshirtSizeOptions={tshirtSizeOptions}
                    foodPreference={foodPreferenceFilter}
                    onFoodPreferenceChange={setFoodPreferenceFilter}
                    foodPreferenceOptions={foodPreferenceOptions}
                    isDownloadDisabled={
                      loading || Boolean(actionLoadingId) || !hasRegistrationsForExport
                    }
                    downloadTitle={
                      hasRegistrationsForExport
                        ? "Download registered members as CSV"
                        : "No registered members available for export"
                    }
                    disabled={loading || Boolean(actionLoadingId)}
                  />
                </section>

                <section className="admin-summary" aria-label="Registration summary">
                  <div className="admin-summary-card status-pending">
                    <span className="admin-summary-label">Pending</span>
                    <span className="admin-summary-value">
                      {registrationSummary.pending}
                    </span>
                  </div>
                  <div className="admin-summary-card status-approved">
                    <span className="admin-summary-label">Approved</span>
                    <span className="admin-summary-value">
                      {registrationSummary.approved}
                    </span>
                  </div>
                  <div className="admin-summary-card status-rejected">
                    <span className="admin-summary-label">Rejected</span>
                    <span className="admin-summary-value">
                      {registrationSummary.rejected}
                    </span>
                  </div>
                  <div className="admin-summary-card status-confirmed">
                    <span className="admin-summary-label">Confirmed</span>
                    <span className="admin-summary-value">
                      {registrationSummary.confirmed}
                    </span>
                  </div>
                </section>

                {error ? (
                  <div className="admin-alert error" role="alert">
                    {error}
                  </div>
                ) : null}

                {feedbackMessage ? (
                  <div className="admin-alert success" role="status" aria-live="polite">
                    {feedbackMessage}
                  </div>
                ) : null}

                <AdminTable
                  registrations={filteredRegistrations}
                  loading={loading}
                  actionLoadingId={actionLoadingId}
                  onAction={handleAction}
                />
              </>
            )}
          </section>

          <p className="itpro-admin-disclaimer">
            Your data is secure · Admin operations are logged
          </p>
        </div>
      </main>
    </>
  );
};

export default ItProAdminPage;
