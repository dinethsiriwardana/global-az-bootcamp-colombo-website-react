import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

interface RegistrationFormProps {
  onClose: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    track: "",
    mobile: "",
    organization: "",
    name: "",
    position: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: number;
    message: string;
  } | null>(null);

  // Updated handleChange function to fix TypeScript errors with Form.Control
  const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    const { name, value } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Using Azure Logic App for registration
      const apiUrl =
        "https://prod-87.southeastasia.logic.azure.com:443/workflows/a24ce410c15846efb40d065a01234eae/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=w0UzCn03icyPnH1ezYWd5qa1upRu6_NIbxhbsCbrrJQ";

      console.log("Submitting registration:", formData);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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

  return (
    <>
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
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            className="p-2"
            style={{ borderRadius: "50px", paddingLeft: "25px" }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
            className="p-2"
            style={{ borderRadius: "50px", paddingLeft: "25px" }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            required
            className="p-2"
            style={{ borderRadius: "50px", paddingLeft: "25px" }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Organization</Form.Label>
          <Form.Control
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder="Enter your organization name"
            required
            className="p-2"
            style={{ borderRadius: "50px", paddingLeft: "25px" }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Position</Form.Label>
          <Form.Control
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Enter your job position"
            required
            className="p-2"
            style={{ borderRadius: "50px", paddingLeft: "25px" }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Select Track</Form.Label>
          <Form.Select
            name="track"
            value={formData.track}
            onChange={handleChange}
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
    </>
  );
};

export default RegistrationForm;
