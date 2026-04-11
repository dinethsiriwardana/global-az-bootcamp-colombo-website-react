import React from "react";
import { AdminAction, AdminRegistration } from "../../types/admin";
import AdminRow from "./AdminRow";

interface AdminTableProps {
  registrations: AdminRegistration[];
  loading: boolean;
  actionLoadingId: string | null;
  onAction: (registrationId: string, action: AdminAction) => void;
}

const AdminTable = ({
  registrations,
  loading,
  actionLoadingId,
  onAction,
}: AdminTableProps) => {
  if (loading) {
    return (
      <div className="admin-table-state" role="status" aria-live="polite">
        <span className="admin-spinner" aria-hidden="true" />
        Loading registrations...
      </div>
    );
  }

  if (!registrations.length) {
    return (
      <div className="admin-table-state" role="status" aria-live="polite">
        No registrations found for the current filter.
      </div>
    );
  }

  return (
    <div className="admin-table-scroll">
      <section className="admin-table" aria-label="Registration approval table">
        <div className="admin-table-head" role="row">
          <span>Name</span>
          <span>Email</span>
          <span>Organization</span>
          <span>Profession</span>
          <span>Status</span>
          <span className="text-center">Actions</span>
        </div>

        <div className="admin-table-body" role="rowgroup">
          {registrations.map((registration) => (
            <AdminRow
              key={registration.registration_id}
              registration={registration}
              isActionLoading={actionLoadingId === registration.registration_id}
              onAction={onAction}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminTable;
