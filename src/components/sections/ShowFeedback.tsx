import React, { useCallback, useEffect, useMemo, useState } from "react";
import FeedbackModal from "../FeedbackModal";
import { FeedbackItem, getFeedbacks } from "../../utils/api";
import "./ShowFeedback.css";

const FEEDBACK_PREVIEW_CHAR_LIMIT = 180;
const FEEDBACK_PAGE_SIZE = 6;
const FEEDBACK_AUTO_ROTATE_MS = 4500;

const ShowFeedback = () => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [expandedFeedbackCards, setExpandedFeedbackCards] = useState<Record<string, boolean>>({});
  const [activeFeedbackPage, setActiveFeedbackPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getFeedbacks();
      setFeedbacks(list);
      setExpandedFeedbackCards({});
      setActiveFeedbackPage(0);
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

  const getCardKey = (item: FeedbackItem, index: number) =>
    String(item.id ?? `${item.name || "anonymous"}-${index}`);

  const getFeedbackText = (item: FeedbackItem) =>
    typeof item.feedback === "string" && item.feedback.trim().length > 0
      ? item.feedback.trim()
      : "No feedback message provided.";

  const toggleExpandFeedback = (cardKey: string) => {
    setExpandedFeedbackCards((prev) => ({
      ...prev,
      [cardKey]: !prev[cardKey],
    }));
  };

  const feedbackPages = useMemo(() => {
    if (feedbacks.length === 0) {
      return [];
    }

    const pages: FeedbackItem[][] = [];
    for (let i = 0; i < feedbacks.length; i += FEEDBACK_PAGE_SIZE) {
      pages.push(feedbacks.slice(i, i + FEEDBACK_PAGE_SIZE));
    }
    return pages;
  }, [feedbacks]);

  useEffect(() => {
    if (feedbackPages.length <= 1) {
      return;
    }

    const autoRotateTimer = window.setInterval(() => {
      setActiveFeedbackPage((currentPage) => (currentPage + 1) % feedbackPages.length);
    }, FEEDBACK_AUTO_ROTATE_MS);

    return () => window.clearInterval(autoRotateTimer);
  }, [feedbackPages.length]);

  const visibleFeedbacks = feedbackPages[activeFeedbackPage] || [];

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
              <>
                <div key={`feedback-page-${activeFeedbackPage}`} className="row g-3 feedback-cards-page">
                  {visibleFeedbacks.map((item, index) => {
                    const absoluteIndex = activeFeedbackPage * FEEDBACK_PAGE_SIZE + index;
                    const cardKey = getCardKey(item, absoluteIndex);
                    const feedbackText = getFeedbackText(item);
                    const shouldTruncate = feedbackText.length > FEEDBACK_PREVIEW_CHAR_LIMIT;
                    const isExpanded = Boolean(expandedFeedbackCards[cardKey]);
                    const previewText = shouldTruncate
                      ? `${feedbackText.slice(0, FEEDBACK_PREVIEW_CHAR_LIMIT).trimEnd()}...`
                      : feedbackText;
                    const displayedText = isExpanded ? feedbackText : previewText;
                    const feedbackTextId = `feedback-text-${cardKey}`;

                    return (
                      <div className=" col-md-6 col-lg-4" key={cardKey}>
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
                          <p id={feedbackTextId} style={{ marginBottom: shouldTruncate ? "8px" : 0, color: "#334155" }}>
                            {displayedText}
                          </p>
                          {shouldTruncate && (
                            <button
                              type="button"
                              onClick={() => toggleExpandFeedback(cardKey)}
                              aria-expanded={isExpanded}
                              aria-controls={feedbackTextId}
                              style={{
                                border: "none",
                                background: "transparent",
                                color: "#f82249",
                                padding: 0,
                                fontWeight: 700,
                                fontSize: "0.9rem",
                              }}
                            >
                              {isExpanded ? "See less" : "See more"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {feedbackPages.length > 1 && (
                  <div
                    className="d-flex justify-content-center align-items-center mt-4 feedback-page-dots"
                    role="tablist"
                    aria-label="Feedback pages"
                  >
                    {feedbackPages.map((_, pageIndex) => {
                      const isActive = pageIndex === activeFeedbackPage;
                      return (
                        <button
                          key={`feedback-page-dot-${pageIndex}`}
                          type="button"
                          onClick={() => setActiveFeedbackPage(pageIndex)}
                          aria-label={`Show feedback page ${pageIndex + 1}`}
                          aria-current={isActive ? "page" : undefined}
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            border: "none",
                            padding: 0,
                            background: isActive ? "#f82249" : "#cbd5e1",
                            transform: isActive ? "scale(1.18)" : "scale(1)",
                            transition: "all 180ms ease",
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <FeedbackModal show={showFeedbackModal} onHide={handleHideModal} />
    </section>
  );
};

export default ShowFeedback;
