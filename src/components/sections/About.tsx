import React from "react";

const About = () => {
  return (
    <section id="about">
      <div className="container position-relative" data-aos="fade-up">
        <div className="row">
          <div className="col-lg-8 text-center text-lg-start">
            <h2>About The Event</h2>
            <p className="pe-lg-7">
              Global Azure 2025 took place on May 10th, with communities
              worldwide organizing localized hybrid events and live streams.
              This global event brought together Azure enthusiasts, offering
              everyone the opportunity to join and learn from top community
              leaders.
            </p>
            <p>
              In Sri Lanka, the Microsoft IT Pro Community proudly participated
              in this movement. Participants connected with fellow Azure
              professionals, engaged in insightful sessions, and enhanced their
              Azure skills. Whether seasoned experts or beginners on their Azure
              journey, attendees found something valuable at Global Azure 2025.
            </p>
          </div>
          <div className="col-lg-2 text-center text-lg-start">
            <h3>Where</h3>
            <p>Microsoft Sri Lanka</p>
            <h3>When</h3>
            <p>Saturday 10th May</p>
          </div>
          <div className="col-lg-2 text-lg-start">
            <h3>Hosted By</h3>
            <br></br>
            <img
              src="/assets/img/itpro.png"
              alt="Global Azure 2025"
              height="80"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
