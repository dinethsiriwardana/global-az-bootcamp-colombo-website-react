import React from "react";

const Hero = () => {
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
          href="https://forms.office.com/r/GW90BFyq7B"
          className="about-btn scrollto"
          target="_blank"
          rel="noopener noreferrer"
        >
          Register
        </a>
        <a href="#about" className="about-btn scrollto">
          Event Details
        </a>
      </div>
    </section>
  );
};

export default Hero;
