import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createFeedback } from "../utils/api";

type Props = {
  show: boolean;
  onHide: () => void;
};

const FeedbackModal: React.FC<Props> = ({ show, onHide }) => {
  const [name, setName] = useState("");
  const [stars, setStars] = useState<number>(5);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (show) {
      setError(null);
      setSuccess(false);
      // focus the first input for accessibility
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [show]);

  const validate = () => {
    if (!feedback || feedback.trim().length === 0) {
      setError("Feedback message is required");
      return false;
    }
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      setError("Stars must be an integer between 1 and 5");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = { feedback: feedback.trim(), stars, name: name.trim() || undefined };
      const res = await createFeedback(payload);
      // API returns { data: {...} } on success per docs
      if ((res as any).error) {
        setError((res as any).error || "Unknown error");
      } else {
        setSuccess(true);
        setFeedback("");
        setName("");
        // auto-close after a short delay
        setTimeout(() => {
          setSuccess(false);
          onHide();
        }, 1250);
      }
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header style={{ background: "#f82249", color: "#fff", justifyContent: "center" }}>
          <Modal.Title style={{ textAlign: "center" }}>Share Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {success ? (
            <div style={{ padding: "12px", textAlign: "center", color: "#FFF" }}>
              Thanks for your feedback!
            </div>
          ) : (
            <>
              <Form.Group className="mb-3" controlId="feedback-name">
                <Form.Label>Name (optional)</Form.Label>
                <Form.Control
                  ref={firstInputRef}
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="feedback-stars">
                <Form.Label>Rating</Form.Label>
                <Form.Select value={String(stars)} onChange={(e) => setStars(parseInt(e.target.value || "5", 10))}>
                  <option value="5">5 — Excellent</option>
                  <option value="4">4 — Very good</option>
                  <option value="3">3 — Good</option>
                  <option value="2">2 — Fair</option>
                  <option value="1">1 — Poor</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="feedback-message">
                <Form.Label>Feedback</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Tell us what you liked or how we can improve"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </Form.Group>

              {error && (
                <div style={{ color: "#b91c1c", marginBottom: 8 }}>{error}</div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={submitting}>
            Cancel
          </Button>
          {!success && (
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Sending..." : "Send Feedback"}
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FeedbackModal;
