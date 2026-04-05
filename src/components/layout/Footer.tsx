import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            #footer .footer-info-responsive {
              margin-left: 0 !important;
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
            }

            #footer .footer-info-logo {
              width: 100%;
              max-width: 320px;
              height: auto;
              object-fit: contain;
              margin: 0 auto 12px;
              display: block;
            }

            #footer .footer-description-text {
              width: 100%;
              max-width: 680px;
              margin: 0 auto;
              padding-left: 18px;
              padding-right: 18px;
              text-align: center;
              font-size: 0.98rem;
              line-height: 1.7;
              overflow-wrap: anywhere;
              word-break: normal;
              white-space: normal;
            }
          }
        `}
      </style>
      <footer id="footer">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 footer-info footer-info-responsive" style={{marginLeft: '-20px'}}>
              <img
                src="/assets/img/GlobalAzure2025-250.png"
                alt="Global Azure 2025"
                className="footer-info-logo"
              />
              <p className="footer-description-text">
                Global Azure is a yearly community event that offers hundreds of
                user communities around the world to learn about Azure and the
                cloud computing topics.
              </p>
            </div>

            <div className="col-lg-4 col-md-6 footer-links  text-start  text-decoration-none">
              <h4>Useful Links</h4>
              <ul>
                {/* <li>
                  <i className="bi bi-chevron-right text-decoration-none"></i>{" "}
                  <a href="#hero" className="text-decoration-none">
                    Home
                  </a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>{" "}
                  <a href="#about" className="text-decoration-none">
                    About
                  </a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>{" "}
                  <a href="#speakers" className="text-decoration-none">
                    Speakers
                  </a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>{" "}
                  <a href="#counter-stats" className="text-decoration-none">
                    Event Statistics
                  </a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>{" "}
                  <a href="#schedule" className="text-decoration-none">
                    Schedule
                  </a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>{" "}
                  <a href="#venue" className="text-decoration-none">
                    Venue
                  </a>
                </li>
                <li>
                  <i className="bi bi-chevron-right"></i>{" "}
                  <a href="#sponsors" className="text-decoration-none">
                    Sponsors
                  </a>
                </li>
                */}
                <li>
                  <i className="bi bi-chevron-right"></i>{" "}
                  <a href="/2025" className="text-decoration-none">
                    Global Azure 2025
                  </a>
                </li> 
                <li>
                  <i className="bi bi-chevron-right"></i>{" "}
                  <Link to="/codeofconduct" className="text-decoration-none">
                    Code of Conduct
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-6 footer-contact">
              <h4>Contact Us</h4>
              <p>
                Colombo, Sri Lanka <br />
                <strong>Email:</strong> info@globalazure.lk
                <br />
              </p>

              <div className="social-links">
                <a
                  href="https://www.linkedin.com/company/microsoft-it-pro-community/"
                  className="linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="credits">
          <br />
          Designed by{" "}
          <a
            href="https://bootstrapmade.com/"
            style={{ color: "#f82249" }}
            className="text-decoration-none"
          >
            BootstrapMade
          </a>{" "}
          | Developed by{" "}
          <a
            href="https://www.linkedin.com/in/dinethsiriwardana/"
            className="text-decoration-none"
            style={{ color: "#f82249" }}
          >
            Dineth Siriwardana
          </a>
        </div>
      </div>
      </footer>
    </>
  );
};

export default Footer;
