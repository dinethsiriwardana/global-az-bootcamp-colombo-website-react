import React, { useState, useEffect } from "react";
import { sendOtp, verifyOtp, submitRegistration } from "../utils/api";

// ─── Inline styles ────────────────────────────────────────────────────────────

const S = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative" as const,
    overflow: "hidden",
  },
  orb1: {
    position: "fixed" as const,
    width: 600,
    height: 600,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(248,34,73,0.12) 0%, transparent 70%)",
    top: -200,
    right: -200,
    pointerEvents: "none" as const,
    zIndex: 0,
  },
  orb2: {
    position: "fixed" as const,
    width: 400,
    height: 400,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(14,27,77,0.9) 0%, transparent 70%)",
    bottom: -100,
    left: -100,
    pointerEvents: "none" as const,
    zIndex: 0,
  },
  wrapper: {
    position: "relative" as const,
    zIndex: 1,
    width: "100%",
    maxWidth: 560,
  },
  bgOverlay: {
    position: "absolute" as const,
    inset: 0,
    background: "rgba(0, 0, 0, 0.60)",
    zIndex: 0,
  },

  // Header
  header: { textAlign: "center" as const, marginBottom: "2rem" },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 50,
    padding: "0.4rem 1rem",
    marginBottom: "1.2rem",
    color: "rgba(255,255,255,0.8)",
    fontSize: "0.72rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    fontWeight: 500,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#f82249",
    boxShadow: "0 0 8px rgba(248,34,73,0.5)",
  },
  h1: {
    fontFamily: "'Playfair Display', serif",
    color: "#ffffff",
    fontSize: "2.4rem",
    lineHeight: 1.15,
    marginBottom: "0.5rem",
  },
  h1Span: { color: "#f82249" },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "0.9rem",
    fontWeight: 300,
  },

  // Card
  card: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 24,
    padding: "2rem",
    backdropFilter: "blur(20px)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
  },

  // Alert
  alertSuccess: {
    borderRadius: 14,
    padding: "0.85rem 1.1rem",
    marginBottom: "1.5rem",
    fontSize: "0.875rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6rem",
    background: "rgba(16,185,129,0.12)",
    border: "1px solid rgba(16,185,129,0.3)",
    color: "#6ee7b7",
  },
  alertError: {
    borderRadius: 14,
    padding: "0.85rem 1.1rem",
    marginBottom: "1.5rem",
    fontSize: "0.875rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6rem",
    background: "rgba(248,34,73,0.12)",
    border: "1px solid rgba(248,34,73,0.3)",
    color: "#fca5a5",
  },

  // Step progress
  steps: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "2rem",
  },
  stepItem: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "0.35rem",
    flex: 1,
  },
  stepCircle: (active: boolean, done: boolean) => ({
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    fontWeight: 600,
    border: `2px solid ${active ? "#f82249" : done ? "#10b981" : "rgba(255,255,255,0.15)"}`,
    background: active
      ? "#f82249"
      : done
        ? "rgba(16,185,129,0.2)"
        : "rgba(255,255,255,0.04)",
    color: active ? "white" : done ? "#10b981" : "rgba(255,255,255,0.7)",
    boxShadow: active ? "0 0 16px rgba(248,34,73,0.4)" : "none",
    zIndex: 1,
    position: "relative" as const,
    transition: "all 0.3s ease",
  }),
  stepLabel: (active: boolean) => ({
    fontSize: "0.68rem",
    fontWeight: 500,
    textAlign: "center" as const,
    color: active ? "white" : "rgba(255,255,255,0.5)",
  }),

  // Panel
  panelTitle: {
    fontFamily: "'Playfair Display', serif",
    color: "white",
    fontSize: "1.3rem",
    marginBottom: "0.3rem",
  },
  panelSub: {
    color: "rgba(255,255,255,0.65)",
    fontSize: "0.85rem",
    marginBottom: "1.5rem",
  },

  // Fields
  field: { marginBottom: "1.1rem" },
  label: {
    display: "block",
    color: "rgba(255,255,255,0.75)",
    fontSize: "0.8rem",
    fontWeight: 500,
    marginBottom: "0.4rem",
    letterSpacing: "0.04em",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 12,
    color: "white",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.9rem",
    padding: "0.75rem 1rem 0.75rem 1rem",
    outline: "none",
    transition: "all 0.2s ease",
    WebkitAppearance: "none" as const,
    MozAppearance: "none" as const,
    appearance: "none" as const,
  },
  textarea: {
    width: "100%",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 14,
    color: "white",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.9rem",
    padding: "0.75rem 1rem",
    outline: "none",
    resize: "vertical" as const,
    minHeight: 80,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1rem",
    width: "100%",
  },
  otpFieldRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    marginBottom: "1.1rem",
  },
  otpIconButton: {
    flexShrink: 0,
    width: 44,
    height: 44,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.07)",
    color: "rgba(255,255,255,0.8)",
    fontSize: "1.1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
  },

  // Buttons
  btnPrimary: {
    background: "#f82249",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "0.82rem 2rem",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    boxShadow: "0 4px 20px rgba(248,34,73,0.35)",
    transition: "all 0.2s ease",
  },
  btnGhost: {
    background: "rgba(255,255,255,0.07)",
    color: "rgba(255,255,255,0.8)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: "0.82rem 1.5rem",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.9rem",
    fontWeight: 500,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  btnRow: {
    display: "flex",
    justifyContent: "center",
    gap: "0.75rem",
    flexWrap: "wrap" as const,
    marginTop: "1.5rem",
  },
};

// ─── Component ─────────────────────────────────────────────────────────────────

const EventRegistrationPage = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone_number: "",
    id_number: "",
    profession: "",
    organization: "",
    designation: "",
    current_year_of_study: "",
    linkedin_url: "",
    food_preference: "",
    expectations: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [submissionComplete, setSubmissionComplete] = useState(false);

  useEffect(() => {
    const images = ["bg.jpg", "bg2.png"];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const pageEl = document.getElementById("reg-page");
    if (pageEl) {
      pageEl.style.background = `url('assets/img/${randomImage}') top center / cover no-repeat`;
    }
  }, []);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 8000);
  };

  const getErrorText = (error: unknown, fallback: string) => {
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return fallback;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendOtp(email);
      showMsg("success", "OTP sent to your email!");
      setTimeout(() => setStep(1), 600);
    } catch (error) {
      showMsg(
        "error",
        getErrorText(error, "Failed to send OTP. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      showMsg("success", "Email verified!");
      setFormData((prev) => ({ ...prev, email }));
      setTimeout(() => setStep(2), 600);
    } catch (error) {
      showMsg("error", getErrorText(error, "Invalid OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await sendOtp(email);
      showMsg("success", "OTP resent!");
    } catch (error) {
      showMsg("error", getErrorText(error, "Failed to resend OTP."));
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";

    const total = digits.length;
    const codeLength = total > 9 ? Math.min(3, total - 9) : 2;
    const country = digits.slice(0, codeLength);
    const rest = digits.slice(codeLength);

    const part1 = rest.slice(0, 2);
    const part2 = rest.slice(2, 5);
    const part3 = rest.slice(5, 9);

    let formatted = `+${country}`;
    if (part1) formatted += ` ${part1}`;
    if (part2) formatted += ` ${part2}`;
    if (part3) formatted += ` ${part3}`;
    return formatted;
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "phone_number") {
      setFormData((prev) => ({ ...prev, [name]: formatPhoneNumber(value) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.phone_number.trim()) return "Phone number is required";
    if (!/^\+\d{2,3} \d{2} \d{3} \d{4}$/.test(formData.phone_number))
      return "Phone number must be in the format +XX XX XXX XXXX";
    if (!formData.id_number.trim()) return "ID number is required";
    if (!formData.profession) return "Profession is required";
    if (
      formData.profession === "Undergraduate" &&
      !formData.current_year_of_study
    )
      return "Year of study is required";
    if (
      formData.profession === "Working professional" &&
      !formData.designation.trim()
    )
      return "Designation is required";
    if (!formData.organization.trim()) return "Organization is required";
    if (!formData.food_preference) return "Food preference is required";
    if (!formData.linkedin_url.trim()) return "LinkedIn URL is required";
    if (!formData.expectations.trim()) return "Expectations are required";
    return null;
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      showMsg("error", err);
      return;
    }
    setLoading(true);
    try {
      await submitRegistration(formData);
      showMsg("success", "🎉 Registration successful!");
      setSubmissionComplete(true);
    } catch (error) {
      showMsg(
        "error",
        getErrorText(error, "Registration failed. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{`#reg-page select { background-color: rgba(255,255,255,0.07) !important; color: #fff !important; -webkit-appearance: none; -moz-appearance: none; appearance: none; }
      #reg-page select option { background-color: rgba(0,0,0,0.95) !important; color: #fff !important; }
      #reg-page select::-ms-expand { display: none; }`}</style>

      <div id="reg-page" style={S.page}>
        <div style={S.orb1} />
        <div style={S.orb2} />
        <div style={S.bgOverlay} />

        <div style={S.wrapper}>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <img
              src="assets/img/globalazure2026.png"
              alt="Global Azure Bootcamp Logo"
              style={{ maxWidth: 200 }}
            />
          </div>
          {/* Header */}
          <div style={S.header}>
            <h1 style={S.h1}>
              Event <span style={S.h1Span}>Registration</span>
            </h1>
            <p style={S.subtitle}>Secure your spot in three quick steps</p>
          </div>

          {/* Card */}
          <div style={S.card}>
            {/* Alert */}
            {message && (
              <div
                style={
                  message.type === "success" ? S.alertSuccess : S.alertError
                }
              >
                <span>
                  {message.text}
                  {message.type === "success" ? " ✓ " : "! "}
                </span>
              </div>
            )}

            {submissionComplete ? (
              <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                <h2 style={{ ...S.panelTitle, color: "#10b981" }}>
                  Registration Complete
                </h2>

                <br />
                <p style={S.panelSub}>
                  Thank you for your submission. Due to the high number of
                  registrations, a selection process will be conducted.
                  Confirmation messages will be sent to selected participants as
                  soon as possible.
                  <br />
                  <br />
                  Please note that registering for this event does not guarantee
                  a seat.
                </p>
              </div>
            ) : (
              <>
                {/* Step indicators */}
                <div style={S.steps}>
                  {["Email", "Verify", "Details"].map((label, i) => (
                    <div key={i} style={S.stepItem}>
                      <div style={S.stepCircle(step === i, step > i)}>
                        {step > i ? "✓" : i === 2 ? "✦" : i + 1}
                      </div>
                      <span style={S.stepLabel(step === i)}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Step 1: Email */}
                {step === 0 && (
                  <form onSubmit={handleEmailSubmit}>
                    <h2 style={S.panelTitle}>Enter your email</h2>
                    <p style={S.panelSub}>
                      We'll send a one-time code to verify your identity.
                    </p>
                    <div style={S.field}>
                      <label style={S.label}>Email Address</label>
                      <input
                        style={S.input}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div style={S.btnRow}>
                      <button
                        type="submit"
                        style={S.btnPrimary}
                        disabled={loading}
                      >
                        {loading ? "Sending…" : "Send OTP"} →
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 2: OTP */}
                {step === 1 && (
                  <form onSubmit={handleOtpSubmit}>
                    <h2 style={S.panelTitle}>Verify your email</h2>
                    <p style={S.panelSub}>
                      Enter the code sent to{" "}
                      <strong style={{ color: "white" }}>{email}</strong>
                    </p>
                    <label style={{ ...S.label, textAlign: "center" as const }}>
                      One-Time Password
                    </label>
                    <div style={S.otpFieldRow}>
                      <input
                        style={{
                          ...S.input,
                          width: 200,
                          flexShrink: 0,
                          textAlign: "center" as const,
                          letterSpacing: "0.3em",
                          fontSize: "1.2rem",
                          fontWeight: 600,
                          marginBottom: 0,
                        }}
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="· · · · · ·"
                        maxLength={6}
                        required
                      />
                    </div>
                    <div style={S.btnRow}>
                      <button
                        type="submit"
                        style={S.btnPrimary}
                        disabled={loading}
                      >
                        {loading ? "Verifying…" : "Verify OTP"} →
                      </button>
                      <button
                        type="button"
                        style={S.btnGhost}
                        onClick={handleResendOtp}
                        disabled={loading}
                      >
                        Resend OTP
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3: Details */}
                {step === 2 && (
                  <form onSubmit={handleDetailsSubmit}>
                    <h2 style={S.panelTitle}>Complete your profile</h2>
                    <p style={S.panelSub}>
                      Almost there — just a few more details.
                    </p>

                    <div style={S.grid2}>
                      <div style={S.field}>
                        <label style={S.label}>Full Name</label>
                        <input
                          style={S.input}
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div style={S.field}>
                        <label style={S.label}>Phone Number</label>
                        <input
                          style={S.input}
                          type="tel"
                          inputMode="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleFormChange}
                          placeholder="+94 77 123 4567"
                          required
                        />
                      </div>
                    </div>

                    <div style={S.grid2}>
                      <div style={S.field}>
                        <label style={S.label}>ID / NIC Number</label>
                        <input
                          style={S.input}
                          type="text"
                          name="id_number"
                          value={formData.id_number}
                          onChange={handleFormChange}
                          placeholder="123456789V"
                          required
                        />
                      </div>
                      <div style={S.field}>
                        <label style={S.label}>Profession</label>
                        <select
                          style={S.input}
                          name="profession"
                          value={formData.profession}
                          onChange={handleFormChange}
                          required
                        >
                          <option value="">Select…</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Working professional">
                            Working Professional
                          </option>
                        </select>
                      </div>
                    </div>

                    {formData.profession === "Undergraduate" && (
                      <div style={S.field}>
                        <label style={S.label}>Year of Study</label>
                        <select
                          style={S.input}
                          name="current_year_of_study"
                          value={formData.current_year_of_study}
                          onChange={handleFormChange}
                          required
                        >
                          <option value="">Select Year</option>
                          <option>First Year</option>
                          <option>Second Year</option>
                          <option>Third Year</option>
                          <option>Final Year</option>
                        </select>
                      </div>
                    )}

                    {formData.profession === "Working professional" && (
                      <div style={S.field}>
                        <label style={S.label}>Designation</label>
                        <input
                          style={S.input}
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleFormChange}
                          placeholder="Software Engineer"
                          required
                        />
                      </div>
                    )}

                    <div style={S.grid2}>
                      <div style={S.field}>
                        <label style={S.label}>Organization</label>
                        <input
                          style={S.input}
                          type="text"
                          name="organization"
                          value={formData.organization}
                          onChange={handleFormChange}
                          placeholder="Company / University"
                          required
                        />
                      </div>
                      <div style={S.field}>
                        <label style={S.label}>Food Preference</label>
                        <select
                          style={S.input}
                          name="food_preference"
                          value={formData.food_preference}
                          onChange={handleFormChange}
                          required
                        >
                          <option value="">Select…</option>
                          <option value="veg">Vegetarian</option>
                          <option value="non-veg">Non-Vegetarian</option>
                        </select>
                      </div>
                    </div>

                    <div style={S.field}>
                      <label style={S.label}>LinkedIn URL</label>
                      <input
                        style={S.input}
                        type="url"
                        name="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={handleFormChange}
                        placeholder="https://linkedin.com/in/you"
                        required
                      />
                    </div>

                    <div style={S.field}>
                      <label style={S.label}>Expectations</label>
                      <textarea
                        style={S.textarea}
                        name="expectations"
                        value={formData.expectations}
                        onChange={handleFormChange}
                        placeholder="What do you hope to gain from this event?"
                        rows={3}
                        required
                      />
                    </div>

                    <div style={S.btnRow}>
                      <button
                        type="submit"
                        style={S.btnPrimary}
                        disabled={loading}
                      >
                        {loading ? "Submitting…" : "Submit Registration"} ✓
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>

          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.25)",
              fontSize: "0.72rem",
              marginTop: "1.2rem",
            }}
          >
            Your data is secure · By registering you agree to our Terms
          </p>
        </div>
      </div>
    </>
  );
};

export default EventRegistrationPage;
