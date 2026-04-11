import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { AdminAction, AdminRegistration } from "../../types/admin";

interface AdminRowProps {
  registration: AdminRegistration;
  isActionLoading: boolean;
  onAction: (registrationId: string, action: AdminAction) => void;
}

const toDisplayValue = (value: string | undefined) => {
  return value && value.trim() ? value : "N/A";
};

const AdminRow = ({
  registration,
  isActionLoading,
  onAction,
}: AdminRowProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentStatus = registration.status.toLowerCase();
  const statusClassName = `status-badge status-${currentStatus}`;
  const hasRegistrationId = Boolean(registration.registration_id);

  const approveDisabled =
    isActionLoading || !hasRegistrationId || currentStatus === "approved";
  const rejectDisabled =
    isActionLoading || !hasRegistrationId || currentStatus === "rejected";

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  console.log("Rendering AdminRow for registration ID:", registration);

  return (
    <>
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
          <span className="admin-cell-label">Organization</span>
          <span className="admin-cell-value">
            {toDisplayValue(registration.organization)}
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
          <span className={statusClassName}>
            {currentStatus === "pending" && <span title="Pending">P</span>}
            {currentStatus === "approved" && <FontAwesomeIcon icon={faCheck} title="Approved" />}
            {currentStatus === "rejected" && <FontAwesomeIcon icon={faXmark} title="Rejected" />}
          </span>
        </div>

        <div className="admin-cell admin-actions" role="cell">
          <button
            type="button"
            className="admin-action-button view-details"
            onClick={handleViewDetails}
            title="View full registration details"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            type="button"
            className="admin-action-button approve"
            onClick={() => onAction(registration.registration_id, "approved")}
            disabled={approveDisabled}
            title="Approve this registration"
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
          <button
            type="button"
            className="admin-action-button reject"
            onClick={() => onAction(registration.registration_id, "rejected")}
            disabled={rejectDisabled}
            title="Reject this registration"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </article>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon-bg">
                  <FontAwesomeIcon icon={faEye} className="modal-title-icon" />
                </div>
                <h2>Registration Details</h2>
                <span className={`status-badge status-${currentStatus}`}>{currentStatus}</span>


                
              </div>
              <button
                type="button"
                className="modal-close-button"
                onClick={handleCloseModal}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-cards-container">
                <div className="detail-card">
                  <div className="detail-card-header">
                    <h3>Personal Information</h3>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value highlight">{toDisplayValue(registration.name)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">{toDisplayValue(registration.email)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone Number</span>
                    <span className="detail-value">{toDisplayValue(registration.phone_number)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">ID / Passport No</span>
                    <span className="detail-value">{toDisplayValue(registration.id_number)}</span>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-card-header">
                    <h3>Professional Details</h3>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Organization / Uni</span>
                    <span className="detail-value">{toDisplayValue(registration.organization)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Profession / Role</span>
                    <span className="detail-value">{toDisplayValue(registration.profession)}</span>
                  </div>
                 
                  <div className="detail-row">
                    <span className="detail-label">Designation</span>
                    <span className="detail-value">{toDisplayValue(registration.designation)}</span>
                  </div>
                  {registration.current_year_of_study && (
                    <div className="detail-row">
                      <span className="detail-label">Year of Study</span>
                      <span className="detail-value">{toDisplayValue(registration.current_year_of_study)}</span>
                    </div>
                  )}
                </div>

                <div className="detail-card full-span">
                  <div className="detail-card-header">
                    <h3>Additional Info</h3>
                  </div>
                  <div className="detail-grid-2">
                    <div className="detail-row">
                      <span className="detail-label">LinkedIn</span>
                      <span className="detail-value">
                        {registration.linkedin_url ? (
                          <div className="detail-link-wrap">
                            <a href={registration.linkedin_url} target="_blank" rel="noopener noreferrer">
                              {registration.linkedin_url}
                            </a>
                            <button
                              type="button"
                              className="linkedin-open-button"
                              onClick={() => window.open(registration.linkedin_url, "_blank")}
                              title="Open LinkedIn"
                            >
                              <FontAwesomeIcon icon={faLinkedin} />
                            </button>
                          </div>
                        ) : (
                          "Not provided"
                        )}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Food Preference</span>
                      <span className="detail-value">
                        <span className="pill-badge food-pill">{toDisplayValue(registration.food_preference)}</span>
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">T-Shirt Size</span>
                      <span className="detail-value">
                        <span className="pill-badge tshirt-pill">{toDisplayValue(registration.tshirt_size)}</span>
                      </span>
                    </div>
                  </div>
                  <div className="detail-row align-start expectations-row">
                    <span className="detail-label">Expectations</span>
                    <div className="detail-value expectations-box">
                      {toDisplayValue(registration.expectations)}
                    </div>
                  </div>
                  {/* Actions Buttons */}
                  <div className="modal-actions">
                    <button
                      type="button"
                      className="admin-action-button approve"
                      onClick={() => {
                        onAction(registration.registration_id, "approved");
                        handleCloseModal();
                      }}
                      disabled={approveDisabled}
                    >
                      <FontAwesomeIcon icon={faCheck} /> Approve
                    </button>
                    <button
                      type="button"
                      className="admin-action-button reject"
                      onClick={() => {
                        onAction(registration.registration_id, "rejected");
                        handleCloseModal();
                      }}
                      disabled={rejectDisabled}
                    >
                      <FontAwesomeIcon icon={faXmark} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>

           
          </div>
        </div>
      )}
    </>
  );
};

export default AdminRow;
