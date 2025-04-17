import React from "react";

const About = () => {
  return (
    <section id="about">
      <div className="container position-relative" data-aos="fade-up">
        <div className="row">
          <div className="col-lg-8 text-center text-lg-start">
            <h2>About The Event</h2>
            <p className="pe-lg-7">
              Global Azure 2025 is here! On May 10th, communities around the
              world will organize localized hybrid events and live streams,
              offering everyone the opportunity to join and learn about Azure
              from top community leaders. This global event will take place
              simultaneously across various locations, bringing together Azure
              enthusiasts to share knowledge and experiences.
            </p>
            <p>
              In Sri Lanka, we are excited to be part of this worldwide
              celebration. Join us to connect with fellow Azure professionals,
              participate in insightful sessions, and enhance your skills.
              Whether you're a seasoned expert or just starting your Azure
              journey, there's something for everyone at Global Azure 2025.
            </p>
          </div>
          <div className="col-lg-2 text-center text-lg-start">
            <h3>Where</h3>
            <p>Microsoft Sri Lanka</p>
          </div>
          <div className="col-lg-2 text-center text-lg-start">
            <h3>When</h3>
            <p>Saturday 10th May</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
