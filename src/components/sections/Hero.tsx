import React, { useEffect } from "react";

const Hero = () => {
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
        {/* <a
          href="#"
          className=" about-btn buy-tickets scrollto"
          target="_blank"
          rel="noopener noreferrer"
        >
          Registration Closed
        </a> */}
        <div className=" about-btn buy-tickets scrollto">
          Registration Closed
        </div>

        <a href="#about" className="about-btn scrollto">
          Event Details
        </a>
      </div>
    </section>
  );
};

export default Hero;
