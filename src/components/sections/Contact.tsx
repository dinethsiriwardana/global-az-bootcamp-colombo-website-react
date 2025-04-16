import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // In a real application, this would send the data to a server
      // For now, we'll just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Form submitted:", data);
      setSubmitResult({
        status: "success",
        message: "Your message has been sent. Thank you!",
      });
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitResult({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-bg">
      <div className="container" data-aos="fade-up">
        <div className="section-header">
          <h2>Contact Us</h2>
          <p>Contact us for any inquiries about the Global Azure 2025 event</p>
        </div>

        <div className="row contact-info">
          <div className="col-md-4">
            <div className="contact-address">
              <i className="bi bi-geo-alt"></i>
              <h3>Address</h3>
              <address>Colombo, Sri Lanka</address>
            </div>
          </div>

          <div className="col-md-4">
            <div className="contact-phone">
              <i className="bi bi-phone"></i>
              <h3>Phone Number</h3>
              <p>
                <a href="tel:+9411234567">+94 11 234 567</a>
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="contact-email">
              <i className="bi bi-envelope"></i>
              <h3>Email</h3>
              <p>
                <a href="mailto:info@globalazure.lk">info@globalazure.lk</a>
              </p>
            </div>
          </div>
        </div>

        <div className="form">
          <form onSubmit={handleSubmit(onSubmit)} className="php-email-form">
            <div className="row">
              <div className="form-group col-md-6">
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Your Name"
                  {...register("name", { required: "Please enter your name" })}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name.message}</div>
                )}
              </div>
              <div className="form-group col-md-6 mt-3 mt-md-0">
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Your Email"
                  {...register("email", {
                    required: "Please enter your email",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
                )}
              </div>
            </div>
            <div className="form-group mt-3">
              <input
                type="text"
                className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                placeholder="Subject"
                {...register("subject", { required: "Please enter a subject" })}
              />
              {errors.subject && (
                <div className="invalid-feedback">{errors.subject.message}</div>
              )}
            </div>
            <div className="form-group mt-3">
              <textarea
                className={`form-control ${errors.message ? "is-invalid" : ""}`}
                rows={5}
                placeholder="Message"
                {...register("message", {
                  required: "Please enter your message",
                })}
              ></textarea>
              {errors.message && (
                <div className="invalid-feedback">{errors.message.message}</div>
              )}
            </div>

            {submitResult && (
              <div
                className={`my-3 ${
                  submitResult.status === "success"
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                <div className={`loading ${isSubmitting ? "" : "d-none"}`}>
                  Loading
                </div>
                <div
                  className={`error-message ${
                    submitResult.status === "error" ? "" : "d-none"
                  }`}
                >
                  {submitResult.message}
                </div>
                <div
                  className={`sent-message ${
                    submitResult.status === "success" ? "" : "d-none"
                  }`}
                >
                  {submitResult.message}
                </div>
              </div>
            )}

            <div className="text-center">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
