import React from "react";

const CodeOfConductPage = () => {
  // Function to handle scrolling to top
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <header
        id="header"
        className="d-flex align-items-center"
        style={{ background: "rgba(6, 12, 34, 0.8)" }}
      >
        <div className="container-fluid container-xxl d-flex align-items-center">
          <div id="logo" className="me-auto">
            {/* Uncomment below if you prefer to use a text logo */}
            {/* <h1><a href="index.html">The<span>Event</span></a></h1> */}
            <a href="index.html" className="scrollto">
              <img
                src="assets/img/GlobalAzure2025-762.png"
                alt="Global Azure Bootcamp Logo"
                title=""
              />
            </a>
          </div>

          <nav id="navbar" className="navbar order-last order-lg-0">
            <ul>
              <li>
                <a className="nav-link scrollto" href="./index.html#hero">
                  Home
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="./index.html#about">
                  About
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="./index.html#speakers">
                  Speakers
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="./index.html#schedule">
                  Schedule
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="./index.html#venue">
                  Venue
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="./index.html#supporters">
                  Sponsors
                </a>
              </li>
              <li>
                <a className="nav-link scrollto active" href="#code-of-conduct">
                  Code of Conduct
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="./2024.html">
                  2024 Event
                </a>
              </li>
            </ul>
            <i className="bi bi-list mobile-nav-toggle"></i>
          </nav>
          {/* .navbar */}
          <a
            className="buy-tickets scrollto"
            href="https://www.meetup.com/Colombo-azure-nights/events/297604687/"
          >
            Register
          </a>
        </div>
      </header>
      {/* End Header */}

      <main id="main">
        <br />
        <br />
        {/* =======  F.A.Q Section ======= */}
        <section id="faq">
          <div className="container" data-aos="fade-up">
            <div className="section-header">
              <h2>Code of Conduct</h2>
            </div>

            <div
              className="row justify-content-center"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="col-lg-9">
                <ul className="faq-list">
                  <li>
                    <div
                      data-bs-toggle="collapse"
                      className="collapsed question"
                      data-bs-target="#faq1"
                    >
                      Who does this Code of Conduct apply to?
                      <i className="bi bi-chevron-down icon-show"></i>
                      <i className="bi bi-chevron-up icon-close"></i>
                    </div>
                    <div
                      id="faq1"
                      className="collapse"
                      data-bs-parent=".faq-list"
                    >
                      <p>
                        All attendees, speakers, sponsors and volunteers at our
                        conference are required to agree with the following code
                        of conduct. Organisers will enforce this code throughout
                        the event. We are expecting cooperation from all
                        participants to help ensuring a safe environment for
                        everybody. If you have any questions, or are harassed in
                        any way, please contact any of the staff. All reports
                        are confidential.
                      </p>
                    </div>
                  </li>

                  <li>
                    <div
                      data-bs-toggle="collapse"
                      data-bs-target="#faq2"
                      className="collapsed question"
                    >
                      The Quick Version
                      <i className="bi bi-chevron-down icon-show"></i>
                      <i className="bi bi-chevron-up icon-close"></i>
                    </div>
                    <div
                      id="faq2"
                      className="collapse"
                      data-bs-parent=".faq-list"
                    >
                      <p>
                        Our conference is dedicated to providing a
                        harassment-free conference experience for everyone,
                        regardless of gender, gender identity and expression,
                        age, sexual orientation, disability, physical
                        appearance, body size, race, ethnicity, or religion (or
                        lack thereof). We do not tolerate harassment of
                        conference participants in any form. Sexual language and
                        imagery is not appropriate for any conference venue,
                        including talks, workshops, parties, social-media and
                        other online media. Conference participants violating
                        these rules may be sanctioned or expelled from the
                        conference without a refund at the discretion of the
                        conference organisers.
                      </p>
                    </div>
                  </li>

                  <li>
                    <div
                      data-bs-toggle="collapse"
                      data-bs-target="#faq3"
                      className="collapsed question"
                    >
                      The Less Quick Version
                      <i className="bi bi-chevron-down icon-show"></i>
                      <i className="bi bi-chevron-up icon-close"></i>
                    </div>
                    <div
                      id="faq3"
                      className="collapse"
                      data-bs-parent=".faq-list"
                    >
                      <p>
                        Harassment includes offensive verbal comments related to
                        gender, gender identity and expression, age, sexual
                        orientation, disability, physical appearance, body size,
                        race, ethnicity, religion, sexual images in public
                        spaces, deliberate intimidation, stalking, following,
                        harassing photography or recording, sustained disruption
                        of talks or other events, inappropriate physical
                        contact, and unwelcome sexual attention.
                      </p>
                      <p>
                        Participants asked to stop any harassing behavior are
                        expected to comply immediately.
                      </p>
                      <p>
                        Sponsors are also subject to the anti-harassment policy.
                        In particular, sponsors should not use sexualised
                        images, activities, or other material. Booth staff
                        (including volunteers) should not use sexualised
                        clothing/uniforms/costumes, or otherwise create a
                        sexualised environment.
                      </p>
                      <p>
                        If a participant engages in harassing behavior, the
                        conference organisers may take any action they deem
                        appropriate, including warning the offender or expulsion
                        from the conference with no refund.
                      </p>
                      <p>
                        If you are being harassed, notice that someone else is
                        being harassed, or have any other concerns, please
                        contact a member of conference staff immediately.
                        Conference staff can be identified as they'll be wearing
                        branded t-shirts.
                      </p>
                      <p>
                        Conference staff will be happy to help participants
                        contact hotel/venue security or local law enforcement,
                        provide escorts, or otherwise assist those experiencing
                        harassment to feel safe for the duration of the
                        conference. We value your attendance.
                      </p>
                      <p>
                        We expect participants to follow these rules at
                        conference and workshop venues and conference-related
                        social events.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* End  F.A.Q Section */}
      </main>
      {/* End #main */}

      {/* ======= Footer ======= */}
      <footer id="footer">
        <div className="footer-top">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6 footer-info">
                <img
                  src="assets/img/GlobalAzure2025-500.png"
                  alt="GlobalAzureLogo"
                />
                <p>
                  Global Azure 2025 is here! Over 3 days, communities around the
                  world are organizing localized hybrid events and live streams
                  for everyone around the world to join and learn about Azure
                  from the best-in-class community leaders.
                </p>
              </div>

              <div className="col-lg-3 col-md-6 footer-links">
                <h4>Useful Links</h4>
                <ul>
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <a href="./index.html#hero">Home</a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <a href="./index.html#speakers">Speakers</a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <a href="./index.html#schedule">Sessions</a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <a href="#code-of-conduct">Code of Conduct</a>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <a href="./index.html#venue">Getting There</a>
                  </li>
                </ul>
              </div>

              {/* <div className="col-lg-3 col-md-6 footer-contact">
              <h4>Contact Us</h4>
              <p>
                A108 Adam Street <br/>
                New York, NY 535022<br/>
                United States <br/>
                <strong>Phone:</strong> +1 5589 55488 55<br/>
                <strong>Email:</strong> info@example.com<br/>
              </p>

              <div className="social-links">
                <a href="#" className="twitter"><i className="bi bi-twitter"></i></a>
                <a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
                <a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
                <a href="#" className="google-plus"><i className="bi bi-instagram"></i></a>
                <a href="#" className="linkedin"><i className="bi bi-linkedin"></i></a>
              </div>

            </div> */}
            </div>
          </div>
        </div>

        <div className="container">
          <div className="credits">
            {/*
          All the links in the footer should remain intact.
          You can delete the links only if you purchased the pro version.
          Licensing information: https://bootstrapmade.com/license/
          Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/buy/?theme=TheEvent
        */}
            Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
          </div>
        </div>
      </footer>
      {/* End  Footer */}

      <a
        href="#code-of-conduct"
        onClick={scrollToTop}
        className="back-to-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </div>
  );
};

export default CodeOfConductPage;
