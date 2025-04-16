import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section id="hero">
      <div className="hero-container" data-aos="zoom-in" data-aos-delay="100">
        <img
          src="/assets/img/GlobalAzure2025-500.png"
          alt="Global Azure Bootcamp Logo"
          title="Global Azure Bootcamp Logo"
          className="img-fluid"
        />
        <h1 className="mb-4 pb-0">
          <span>Colombo</span>
        </h1>
        <p className="mb-4 pb-0">10th May, 2025</p>
        <a href="https://lu.ma/0m4wdoer" className="about-btn scrollto">
          Register
        </a>
        <a href="#about" className="about-btn scrollto">
          Event Details
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
