import React, { useCallback, useEffect, useState } from "react";
import FeedbackModal from "../FeedbackModal";
import { FeedbackItem, getFeedbacks } from "../../utils/api";

const ShowFeedback = () => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getFeedbacks();
      setFeedbacks(list);
    } catch (err: any) {
      setError(err?.message || "Failed to load feedbacks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  const renderStars = (stars: number) => {
    const safeStars = Number.isFinite(stars) ? Math.max(0, Math.min(5, Math.round(stars))) : 0;
    return "★".repeat(safeStars) + "☆".repeat(5 - safeStars);
  };

  const handleHideModal = async () => {
    setShowFeedbackModal(false);
    await loadFeedbacks();
  };

  return (
    <section id="show-feedback" className="py-5" style={{ background: "#f6f7fd" }}>
      <div className="container" data-aos="fade-up">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <h2 style={{ color: "#0e1b4d", marginBottom: "0.75rem" }}>Share Your Feedback</h2>
            <p style={{ color: "#4f5a7d", marginBottom: "1.25rem" }}>
              We would love to hear about your event experience. Your feedback helps us improve future sessions.
            </p>
            <button
              type="button"
              className="btn"
              style={{ background: "#f82249", color: "#fff", padding: "10px 22px", borderRadius: "999px" }}
              onClick={() => setShowFeedbackModal(true)}
            >
              Open Feedback Form
            </button>
          </div>
        </div>

        <div className="row justify-content-center mt-4">
          <div className="col-lg-10">
            {loading && <p className="text-center mb-0">Loading feedbacks...</p>}

            {!loading && error && (
              <p className="text-center mb-0" style={{ color: "#b91c1c" }}>
                {error}
              </p>
            )}

            {!loading && !error && feedbacks.length === 0 && (
              <p className="text-center mb-0">No feedbacks yet. Be the first to share one.</p>
            )}

            {!loading && !error && feedbacks.length > 0 && (
              <div className="row g-3">
                {feedbacks.map((item, index) => (
                  <div
                    className=" col-md-6 col-lg-4"
                    key={String(item.id ?? `${item.name || "anonymous"}-${index}`)}
                  >
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        padding: "16px",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "12px",
                          marginBottom: "8px",
                          alignItems: "center",
                        }}
                      >
                        <strong style={{ color: "#0e1b4d" }}>{item.name?.trim() || "Anonymous"}</strong>
                        <span style={{ color: "#f59e0b", whiteSpace: "nowrap" }}>
                          {renderStars(Number(item.stars))}
                        </span>
                      </div>
                      <p style={{ marginBottom: 0, color: "#334155" }}>{item.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <FeedbackModal show={showFeedbackModal} onHide={handleHideModal} />
    </section>
  );
};

export default ShowFeedback;