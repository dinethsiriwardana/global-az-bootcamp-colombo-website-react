import React from "react";

const About = () => {
  return (
    <section id="about">
      <div className="container position-relative" data-aos="fade-up">
        <div className="row">
          <div className="col-lg-8 text-center text-lg-start">
            <h2>About The Event</h2>
            <p className="pe-lg-7">
            Global Azure 2026 will take place on April 26th, bringing together Azure communities worldwide through expert-led sessions. The event will offer valuable opportunities to learn from industry experts, explore the latest technologies, and connect with the global tech community. In Sri Lanka, the Microsoft IT Pro Community will proudly contribute by bringing local professionals together to learn, connect, and empower the next generation of tech enthusiasts.
            </p>
            
          </div>
          <div className="col-lg-2 text-center text-lg-start">
            <h3 style={{marginTop: '2rem', marginBottom: '0.5rem', paddingLeft: '1.5rem'}}>Where</h3>
            <p style={{marginTop: '0.5rem', marginBottom: '0.5rem', paddingLeft: '1.5rem'}}>Microsoft Sri Lanka</p>
            <h3 style={{marginTop: '2rem', marginBottom: '0.5rem', paddingLeft: '1.5rem'}}>When</h3>
            <p style={{marginTop: '0.5rem', marginBottom: '0.5rem', paddingLeft: '1.5rem'}}>Sunday 26th April</p>
          </div>
          <div className="col-lg-2 text-lg-start">
            <h3 style={{marginTop: '2rem', marginBottom: '0.5rem', paddingLeft: '1rem'}}>Hosted By</h3>
            <br></br>
            <img
              src="/assets/img/itpro.png"
              alt="Global Azure 2026"
              height="80"
              style={{marginTop: '-1rem', marginBottom: '0.5rem', paddingLeft: '0rem'}}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
