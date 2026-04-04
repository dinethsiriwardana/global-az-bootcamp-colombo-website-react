import React from "react";

const About = () => {
  return (
    <>
      <style>
        {`
          @media (min-width: 320px) and (max-width: 768px) {
            #about.about-mobile-safe {
              overflow-x: hidden;
            }

            #about .about-meta-column,
            #about .about-hosted-column {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center !important;
            }

            #about .about-meta-title,
            #about .about-meta-text,
            #about .about-hosted-title {
              padding-left: 0 !important;
              text-align: center !important;
            }

            #about .about-meta-column {
              margin-top: 0.5rem;
            }

            #about .about-hosted-logo-wrap {
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            #about .about-hosted-logo {
              width: 100%;
              max-width: 180px;
              height: auto !important;
              object-fit: contain;
              padding-left: 0 !important;
              margin-top: 0 !important;
            }
          }
        `}
      </style>
      <section id="about" className="about-mobile-safe">
        <div className="container position-relative" data-aos="fade-up">
          <div className="row">
            <div className="col-lg-8 text-center text-lg-start">
              <h2>About The Event</h2>
              <p className="pe-lg-7" style={{fontSize: '1.1em'}}>
              Global Azure 2026 will take place on April 26th, bringing together Azure communities worldwide through expert-led sessions. The event will offer valuable opportunities to learn from industry experts, explore the latest technologies, and connect with the global tech community. In Sri Lanka, the Microsoft IT Pro Community will proudly contribute by bringing local professionals together to learn, connect, and empower the next generation of tech enthusiasts.
              </p>
              
            </div>
            <div className="col-lg-2 text-center text-lg-start about-meta-column">
              <h3 className="about-meta-title" style={{marginTop: '2rem', marginBottom: '0.5rem', paddingLeft: '1.5rem'}}>Where</h3>
              <p className="about-meta-text" style={{marginTop: '0.5rem', marginBottom: '0.5rem', paddingLeft: '1.5rem', fontSize: '1.1em'}}>Microsoft Sri Lanka</p>
              <h3 className="about-meta-title" style={{marginTop: '2rem', marginBottom: '0.5rem', paddingLeft: '1.5rem'}}>When</h3>
              <p className="about-meta-text" style={{marginTop: '0.5rem', marginBottom: '0.5rem', paddingLeft: '1.5rem', fontSize: '1.1em'}}>Sunday 26th April</p>
            </div>
            <div className="col-lg-2 text-center text-lg-start about-hosted-column">
              <h3 className="about-hosted-title" style={{marginTop: '2rem', marginBottom: '0.5rem', paddingLeft: '1rem'}}>Hosted By</h3>
              <br></br>
              <div className="about-hosted-logo-wrap">
                <img
                  src="/assets/img/itpro.png"
                  alt="Global Azure 2026"
                  height="80"
                  className="about-hosted-logo"
                  style={{marginTop: '-1rem', marginBottom: '0.5rem', paddingLeft: '0rem'}}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
