import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

const RegistrationPage = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [track, setTrack] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Using Azure Logic App for verification
      const apiUrl =
        "https://prod-01.southeastasia.logic.azure.com:443/workflows/c84d15f7d85c4bf198d586fbba3d4052/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=SHCd0VovLVc2T4WpcdNkHbZ-EdCZhd99zuAw1atSZ4U";

      console.log("Submitting registration verification:", { email, track });

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code, track }),
      });

      const data = await response.json();

      console.log("API response:", data);

      if (response.status === 200) {
        setResult({
          status: "success",
          message:
            "Registration verified successfully! We look forward to seeing you at the event.",
        });
      } else if (response.status === 404) {
        setResult({
          status: "error",
          message: "Registration not found. Please check your email and code.",
        });
      } else {
        setResult({
          status: "error",
          message: `An error occurred: ${
            data.message || "Please try again later."
          }`,
        });
      }
    } catch (error) {
      console.error("Registration verification error:", error);
      setResult({
        status: "error",
        message: "Failed to connect to the server. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <section id="hero">
      <div className="hero-container" data-aos="zoom-in" data-aos-delay="100">
        <img
          src="assets/img/GlobalAzure2025-250.png"
          alt="Global Azure Bootcamp Logo"
          title="Global Azure Bootcamp Logo"
          className="img-fluid"
          style={{ maxWidth: "250px", marginBottom: "1rem" }}
        />
        <h2 className="mb-4 pb-0" style={{ color: "#fff" }}>
          <span>Colombo</span>
        </h2>
        <p className="mb-4 pb-0">10th May, 2025</p>
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={4}>
              <div
                className="card border-0 rounded-3 p-4"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                }}
              >
                <h4 className="text-center" style={{ color: "#fff" }}>
                  Verification Closed
                </h4>

                {/* {result && (
                  <Alert
                    variant={result.status === "success" ? "success" : "danger"}
                  >
                    {result.message}
                  </Alert>
                )} */}

                {/* <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
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
                    <Form.Control
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Enter your confirmation code"
                      required
                      className="p-2"
                      style={{ borderRadius: "50px", paddingLeft: "25px" }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
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

                  <div className="d-grid">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="about-btn"
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
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Verifying...
                        </>
                      ) : (
                        "Verify Registration"
                      )}
                    </Button>
                  </div>
                </Form> */}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default RegistrationPage;
