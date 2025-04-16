import React from "react";

const About = () => {
  return (
    <section id="about">
      <div className="container position-relative" data-aos="fade-up">
        <div className="row">
          <div className="col-lg-7 text-center text-lg-start">
            <h2>About The Event</h2>
            <p className="pe-lg-5">
              Global Azure 2025 is here! On 10th May, communities around the
              world are organizing localized hybrid events and live streams for
              everyone around the world to join and learn about Azure from the
              best-in-class community leaders.
            </p>
          </div>
          <div className="col-lg-2 text-center text-lg-start">
            <h3>Where</h3>
            <p>Microsoft Sri Lanka</p>
          </div>
          <div className="col-lg-2 text-center text-lg-start">
            <h3>When</h3>
            <p>
              Saturday
              <br />
              10th May
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
