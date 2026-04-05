import React, { useCallback, useEffect, useMemo, useState } from "react";
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

const ItProAdminPage = () => {
  const [statusFilter, setStatusFilter] = useState<AdminFilterStatus>("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [registrations, setRegistrations] = useState<AdminRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const images = ["bg.jpg", "bg2.png"];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const pageEl = document.getElementById("itpro-admin-page");

    if (pageEl) {
      pageEl.style.background = `url('assets/img/${randomImage}') top center / cover no-repeat`;
    }
  }, []);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listRegistrations(statusFilter);
      setRegistrations(data);
    } catch (fetchError) {
      setError(
        getErrorMessage(
          fetchError,
          "Failed to load registrations. Please try again.",
        ),
      );
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void fetchRegistrations();
  }, [fetchRegistrations]);

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

  const filteredRegistrations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return registrations;
    }

    return registrations.filter((registration) => {
      return (
        registration.name.toLowerCase().includes(normalizedSearch) ||
        registration.email.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [registrations, searchTerm]);

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
        .filter((registration) => registration.status.toLowerCase() === statusFilter);
    });

    try {
      await updateRegistrationStatus(registrationId, action);
      setFeedbackMessage(`Registration ${action} successfully.`);
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

            <section className="itpro-admin-toolbar" aria-label="Admin controls">
              <FilterBar
                status={statusFilter}
                onChange={setStatusFilter}
                disabled={loading || Boolean(actionLoadingId)}
              />
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                disabled={loading}
              />
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
