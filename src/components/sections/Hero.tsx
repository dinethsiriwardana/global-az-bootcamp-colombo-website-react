import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import RegistrationForm from "../forms/RegistrationForm";

const Hero = () => {
  const [showModal, setShowModal] = useState(false);

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

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <style>
        {`
          #hero .hero-main-logo {
            width: 100%;
            max-width: 530px;
            height: auto;
            object-fit: contain;
            display: block;
            margin: 0 auto;
          }

          #hero .hero-content-stack {
            width: 100%;
            max-width: 760px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 18px;
            margin: 0 auto;
            transform: translateY(-22px);
          }

          #hero .hero-logo-wrap {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 10px;
            margin-bottom: 8px;
            transform: translateY(16px);
          }

          #hero .hero-title,
          #hero .hero-date {
            margin: 0;
          }

          #hero .hero-date {
            line-height: 1.35;
          }

          #hero .hero-register-btn {
            display: inline-block;
            margin-top: 8px;
            padding: 12px 32px;
            border-radius: 9999px;
            color: #ffffff;
            font-family: "Raleway", sans-serif;
            font-weight: 600;
            font-size: 16px;
            line-height: 1;
            text-decoration: none;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.25),
              0 4px 6px -4px rgba(0, 0, 0, 0.3);
            transition: transform 300ms ease, background 300ms ease,
              box-shadow 300ms ease;
          }

          #hero .hero-register-btn:hover,
          #hero .hero-register-btn:focus {
            color: #ffffff;
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            transform: scale(1.05);
            box-shadow: 0 16px 25px -5px rgba(0, 0, 0, 0.3),
              0 10px 10px -5px rgba(0, 0, 0, 0.28);
          }

          @media (min-width: 320px) and (max-width: 768px) {
            #hero,
            #hero .hero-container {
              overflow-x: hidden;
              max-width: 100%;
            }

            #hero .hero-container {
              padding-left: 16px;
              padding-right: 16px;
            }

            #hero .hero-content-stack {
              gap: 14px;
              transform: translateY(-12px);
            }

            #hero .hero-container[data-aos] {
              transform: none !important;
            }

            #hero .hero-logo-wrap {
              width: 100%;
              max-width: 320px;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 6px auto 4px;
              transform: translateY(14px);
            }

            #hero .hero-main-logo {
              width: 100%;
              max-width: 315px;
              height: auto !important;
              transform: none !important;
              scale: 1 !important;
              object-fit: contain;
              display: block;
              margin: 0 auto;
            }

            #hero .hero-register-btn {
              font-size: 14px;
              padding: 12px 24px;
              margin-top: 6px;
            }
          }
        `}
      </style>
      <section id="hero">
        <div className="hero-container" data-aos="zoom-in" data-aos-delay="100">
          <div className="hero-content-stack">
            <div className="hero-logo-wrap">
              <img
                src="assets/img/globalazure2026.png"
                alt="Global Azure Bootcamp Logo"
                title="Global Azure Bootcamp Logo"
                className="img-fluid hero-main-logo"
                loading="lazy"
                style={{ maxWidth: "530px", height: "auto" }}
              />
            </div>
            <h1 className="hero-title">
              <span>Colombo</span>
            </h1>
            <p className="hero-date">26th April, 2026</p>
            <a
              href="/registration"
              className="hero-register-btn"
            >
              Register Now
            </a>
          </div>
        {/* Replacing the anchor tag with a button to fix the accessibility warning */}
        {/* <Button
          className="about-btn buy-tickets scrollto"
          onClick={() => setShowModal(true)}
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
          Go Virtual
        </Button>

        <a href="#about" className="about-btn scrollto">
          Event Details
        </a> */}
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
            <Modal.Title style={{ textAlign: "center" }}>
              Register for Global Azure Bootcamp 2026 <br /> Virtual Edition
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RegistrationForm onClose={handleCloseModal} />
          </Modal.Body>
        </Modal>
      </section>
    </>
  );
};

export default Hero;
