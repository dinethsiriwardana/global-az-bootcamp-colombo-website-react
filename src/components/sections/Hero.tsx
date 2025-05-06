import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";

const Hero = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [track, setTrack] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: number;
    message: string;
  } | null>(null);

  // Randomly select a background image when the component mounts
  useEffect(() => {
    const images = ["bg.jpg", "bg2.png"];
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // Set the background image for the hero section
    const heroElement = document.getElementById("hero");
    if (heroElement) {
      heroElement.style.background = `url('assets/img/${randomImage}') top center`;
      heroElement.style.backgroundSize = "cover";
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Using Azure Logic App for registration
      const apiUrl =
        "https://prod-87.southeastasia.logic.azure.com:443/workflows/a24ce410c15846efb40d065a01234eae/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=w0UzCn03icyPnH1ezYWd5qa1upRu6_NIbxhbsCbrrJQ";

      console.log("Submitting registration:", { email, track });

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, track }),
      });

      // Just getting the status code as requested
      const statusCode = response.status;
      console.log("API response status:", statusCode);

      let message = "";
      if (statusCode === 200) {
        message =
          "Registration successful! We look forward to seeing you at the event.";
      } else if (statusCode === 404) {
        message = "Registration failed. Please check your information.";
      } else {
        message = "An error occurred. Please try again later.";
      }

      setResult({
        status: statusCode,
        message: message,
      });
    } catch (error) {
      console.error("Registration error:", error);
      setResult({
        status: 500,
        message: "Failed to connect to the server. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setResult(null);
    setEmail("");
    setTrack("");
  };

  return (
    <section id="hero">
      <div className="hero-container" data-aos="zoom-in" data-aos-delay="100">
        <img
          src="assets/img/GlobalAzure2025-500.png"
          alt="Global Azure Bootcamp Logo"
          title="Global Azure Bootcamp Logo"
          className="img-fluid"
        />
        <h1 className="mb-4 pb-0">
          <span>Colombo</span>
        </h1>
        <p className="mb-4 pb-0">10th May, 2025</p>
        <a
          href="#"
          className="about-btn buy-tickets scrollto"
          onClick={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
        >
          Go Virtual
        </a>

        <a href="#about" className="about-btn scrollto">
          Event Details
        </a>
      </div>

      {/* Registration Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header
          style={{
            background: "#f82249",
            color: "#fff",
            justifyContent: "center",
          }}
        >
          <Modal.Title>Register for Global Azure Bootcamp 2025</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {result && (
            <Alert
              variant={result.status === 200 ? "success" : "danger"}
              className="mb-4"
            >
              {result.message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="p-2"
                style={{ borderRadius: "50px", paddingLeft: "25px" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Track</Form.Label>
              <Form.Select
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                required
                className="p-2"
                style={{ borderRadius: "50px", paddingLeft: "25px" }}
              >
                <option value="" disabled>
                  Select your track
                </option>
                <option value="Infrastructure & Security">
                  Infrastructure & Security
                </option>
                <option value="Data & AI">Data & AI</option>
                <option value="Apps & DevOps">Apps & DevOps</option>
              </Form.Select>
            </Form.Group>

            <div className="d-grid mt-4">
              <Button
                type="submit"
                disabled={loading}
                style={{
                  background: "#f82249",
                  color: "#fff",
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  letterSpacing: "1px",
                  padding: "12px 32px",
                  borderRadius: "50px",
                  transition: "0.5s",
                  lineHeight: 1,
                  border: "2px solid #f82249",
                }}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Registering...
                  </>
                ) : (
                  "Register Now"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Hero;
