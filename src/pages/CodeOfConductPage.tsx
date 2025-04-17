import React from "react";

const CodeOfConductPage = () => {
  // Function to handle scrolling to top
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <main id="main" style={{ backgroundColor: "#0e1b4d", color: "white" }}>
        <br></br>
        <br></br>
        {/* =======  F.A.Q Section ======= */}
        <section id="faq">
          <div className="container" data-aos="fade-up">
            <div className="section-header">
              <h2 className="text-white">Code of Conduct</h2>
            </div>

            <div
              className="row justify-content-center"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="col-lg-9">
                <ul className="faq-list text-white">
                  <li>
                    <div
                      data-bs-toggle="collapse"
                      className="collapsed question text-white"
                      data-bs-target="#faq1"
                    >
                      Who does this Code of Conduct apply to?
                      <i className="bi bi-chevron-down icon-show"></i>
                      <i className="bi bi-chevron-up icon-close"></i>
                    </div>
                    <div
                      id="faq1"
                      className="collapse text-white"
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
                      className="collapsed question text-white"
                    >
                      The Quick Version
                      <i className="bi bi-chevron-down icon-show"></i>
                      <i className="bi bi-chevron-up icon-close"></i>
                    </div>
                    <div
                      id="faq2"
                      className="collapse text-white"
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
                      className="collapsed question text-white"
                    >
                      The Less Quick Version
                      <i className="bi bi-chevron-down icon-show"></i>
                      <i className="bi bi-chevron-up icon-close"></i>
                    </div>
                    <div
                      id="faq3"
                      className="collapse text-white"
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
