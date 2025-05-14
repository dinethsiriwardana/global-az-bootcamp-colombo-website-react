import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
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
    <section id="hero">
      <div className="hero-container" data-aos="zoom-in" data-aos-delay="100">
        <img
          src="assets/img/GlobalAzure2025-500.png"
          alt="Global Azure Bootcamp Logo"
          title="Global Azure Bootcamp Logo"
          className="img-fluid"
          loading="lazy"
        />
        <h1 className="mb-4 pb-0">
          <span>Colombo</span>
        </h1>
        <p className="mb-4 pb-0">10th May, 2025</p>
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
            Register for Global Azure Bootcamp 2025 <br /> Virtual Edition
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegistrationForm onClose={handleCloseModal} />
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Hero;
