import React from "react";

const Faq = () => {
  return (
    <section id="faq">
      <div className="container" data-aos="fade-up">
        <div className="section-header">
          <h2>F.A.Q</h2>
        </div>

        <div
          className="row justify-content-center"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="col-lg-9">
            <ul className="faq-list text-start ">
              <li>
                <div
                  data-bs-toggle="collapse"
                  className="collapsed question"
                  data-bs-target="#faq1"
                >
                  Do I need to pay for a ticket?
                  <i className="bi bi-chevron-down icon-show"></i>
                  <i className="bi bi-chevron-up icon-close"></i>
                </div>
                <div id="faq1" className="collapse" data-bs-parent=".faq-list">
                  <p>
                    No! Global Azure is organised globally by individuals
                    looking to give back to the Technology community. The event
                    is completely free.
                  </p>
                </div>
              </li>

              <li>
                <div
                  data-bs-toggle="collapse"
                  data-bs-target="#faq2"
                  className="collapsed question"
                >
                  How do I attend the event?
                  <i className="bi bi-chevron-down icon-show"></i>
                  <i className="bi bi-chevron-up icon-close"></i>
                </div>
                <div id="faq2" className="collapse" data-bs-parent=".faq-list">
                  <p>
                    Once registrations are open, you will need to register to
                    secure your spot. You can choose to attend either in person
                    or online. Please note that in-person seats are limited.
                  </p>
                </div>
              </li>

              <li>
                <div
                  data-bs-toggle="collapse"
                  data-bs-target="#faq3"
                  className="collapsed question"
                >
                  Can I present at the event?
                  <i className="bi bi-chevron-down icon-show"></i>
                  <i className="bi bi-chevron-up icon-close"></i>
                </div>
                <div id="faq3" className="collapse" data-bs-parent=".faq-list">
                  <p>
                    Our Call for Speakers will open on April 1st 2025. If you're
                    a Sri Lankan and looking to contribute to community events,
                    please feel free to reach out via
                    <a href="mailto:info@globalazure.lk">info@globalazure.lk</a>
                    and we can book you a dedicated session at our user group!
                  </p>
                </div>
              </li>

              <li>
                <div
                  data-bs-toggle="collapse"
                  data-bs-target="#faq4"
                  className="collapsed question"
                >
                  Do I need to bring lunch?
                  <i className="bi bi-chevron-down icon-show"></i>
                  <i className="bi bi-chevron-up icon-close"></i>
                </div>
                <div id="faq4" className="collapse" data-bs-parent=".faq-list">
                  <p>
                    Thanks to our generous <a href="#sponsors">sponsors</a>, we
                    have organised a lunch and afternoon tea for attendees.
                  </p>
                </div>
              </li>

              <li>
                <div
                  data-bs-toggle="collapse"
                  data-bs-target="#faq5"
                  className="collapsed question"
                >
                  Can my company sponsor this event?
                  <i className="bi bi-chevron-down icon-show"></i>
                  <i className="bi bi-chevron-up icon-close"></i>
                </div>
                <div id="faq5" className="collapse" data-bs-parent=".faq-list">
                  <p>
                    Yes! If your organisation is interested in sponsoring,
                    please reach our to our organisers via
                    <a href="mailto:info@globalazure.lk">info@globalazure.lk</a>
                  </p>
                </div>
              </li>

              <li>
                <div
                  data-bs-toggle="collapse"
                  data-bs-target="#faq6"
                  className="collapsed question"
                >
                  Will the sessions be available online?
                  <i className="bi bi-chevron-down icon-show"></i>
                  <i className="bi bi-chevron-up icon-close"></i>
                </div>
                <div id="faq6" className="collapse" data-bs-parent=".faq-list">
                  <p>
                    Yes, Microsoft Teams Live will be available for all
                    registered online participants, allowing you to attend the
                    sessions virtually.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
