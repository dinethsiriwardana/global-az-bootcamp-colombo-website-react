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
      // Azure Logic App endpoint
      const logicAppUrl =
        "https://prod-91.southeastasia.logic.azure.com:443/workflows/bca4172c20bf424da78129dfaff3b907/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ic2tFG_jNV70dQDMSduo5U8zDuNN-3mjLKD_VaN4HoM";

      // Map form data to the expected schema
      const formattedData = {
        name: data.name,
        email: data.email,
        Subject: data.subject, // Note: Case matches the schema requirement
        Message: data.message, // Note: Case matches the schema requirement
      };

      // Send POST request to Logic App
      const response = await fetch(logicAppUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Form submitted successfully:", data);
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

  // Function to reset the form and submission result
  const handleNewMessage = () => {
    setSubmitResult(null);
    reset();
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
              <address>
                Microsoft IT Pro community,<br></br>
                Colombo, Sri Lanka
              </address>
            </div>
          </div>

          <div className="col-md-4">
            <div className="contact-phone">
              <i className="bi bi-phone"></i>
              <h3>Phone Number</h3>
              <p>
                <a
                  href="tel:++94 77 772 4539"
                  style={{ textDecoration: "none" }}
                >
                  +94 77 772 4539<br></br>Pathum Udana
                </a>
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="contact-email">
              <i className="bi bi-envelope"></i>
              <h3>Email</h3>
              <p>
                <a
                  href="mailto:info@globalazure.lk"
                  style={{ textDecoration: "none" }}
                >
                  info@globalazure.lk
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="form">
          {submitResult?.status === "success" ? (
            <div className="text-center success-message py-5">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success fs-1"></i>
                <h3 className="mt-3">{submitResult.message}</h3>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="php-email-form">
              <div className="row">
                <div className="form-group col-md-6">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    placeholder="Your Name"
                    {...register("name", {
                      required: "Please enter your name",
                    })}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">
                      {errors.name.message}
                    </div>
                  )}
                </div>
                <div className="form-group col-md-6 mt-3 mt-md-0">
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
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
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group mt-3">
                <input
                  type="text"
                  className={`form-control ${
                    errors.subject ? "is-invalid" : ""
                  }`}
                  placeholder="Subject"
                  {...register("subject", {
                    required: "Please enter a subject",
                  })}
                />
                {errors.subject && (
                  <div className="invalid-feedback">
                    {errors.subject.message}
                  </div>
                )}
              </div>
              <div className="form-group mt-3">
                <textarea
                  className={`form-control ${
                    errors.message ? "is-invalid" : ""
                  }`}
                  rows={5}
                  placeholder="Message"
                  {...register("message", {
                    required: "Please enter your message",
                  })}
                ></textarea>
                {errors.message && (
                  <div className="invalid-feedback">
                    {errors.message.message}
                  </div>
                )}
              </div>
              <br></br>
              {submitResult?.status === "error" && (
                <div className="my-3 text-danger">
                  <div className="error-message">{submitResult.message}</div>
                </div>
              )}

              <div className="text-center">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
