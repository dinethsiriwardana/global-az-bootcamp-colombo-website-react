import React from "react";
import { AdminAction, AdminRegistration } from "../../types/admin";

interface AdminRowProps {
  registration: AdminRegistration;
  isActionLoading: boolean;
  onAction: (registrationId: string, action: AdminAction) => void;
}

const toDisplayValue = (value: string) => {
  return value.trim() ? value : "N/A";
};

const AdminRow = ({
  registration,
  isActionLoading,
  onAction,
}: AdminRowProps) => {
  const currentStatus = registration.status.toLowerCase();
  const statusClassName = `status-badge status-${currentStatus}`;
  const hasRegistrationId = Boolean(registration.registration_id);

  const approveDisabled =
    isActionLoading || !hasRegistrationId || currentStatus === "approved";
  const rejectDisabled =
    isActionLoading || !hasRegistrationId || currentStatus === "rejected";

  return (
    <article className="admin-row" role="row">
      <div className="admin-cell" role="cell">
        <span className="admin-cell-label">Name</span>
        <span className="admin-cell-value">{toDisplayValue(registration.name)}</span>
      </div>

      <div className="admin-cell" role="cell">
        <span className="admin-cell-label">Email</span>
        <span className="admin-cell-value">{toDisplayValue(registration.email)}</span>
      </div>

      <div className="admin-cell" role="cell">
        <span className="admin-cell-label">Phone</span>
        <span className="admin-cell-value">
          {toDisplayValue(registration.phone_number)}
        </span>
      </div>

      <div className="admin-cell" role="cell">
        <span className="admin-cell-label">Profession</span>
        <span className="admin-cell-value">
          {toDisplayValue(registration.profession)}
        </span>
      </div>

      <div className="admin-cell" role="cell">
        <span className="admin-cell-label">Status</span>
        <span className={statusClassName}>{currentStatus}</span>
      </div>

      <div className="admin-cell admin-actions" role="cell">
        <button
          type="button"
          className="admin-action-button approve"
          onClick={() => onAction(registration.registration_id, "approved")}
          disabled={approveDisabled}
        >
          {isActionLoading ? "Updating..." : "Approve"}
        </button>
        <button
          type="button"
          className="admin-action-button reject"
          onClick={() => onAction(registration.registration_id, "rejected")}
          disabled={rejectDisabled}
        >
          {isActionLoading ? "Updating..." : "Reject"}
        </button>
      </div>
    </article>
  );
};

export default AdminRow;
