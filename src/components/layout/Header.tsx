import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  // Close mobile nav when a link is clicked
  const closeMobileNav = () => {
    if (mobileNavOpen) {
      setMobileNavOpen(false);
    }
  };

  return (
    <header
      id="header"
      className={`d-flex align-items-center ${
        scrolled ? "header-scrolled" : ""
      }`}
    >
      <div className="container-fluid container-xxl d-flex align-items-center">
        <div id="logo" className="me-auto">
          <Link to="/" onClick={closeMobileNav}>
            <img
              src="/assets/img/GlobalAzure2025-500.png"
              alt="Global Azure 2025 Logo"
              className="img-fluid"
            />
          </Link>
        </div>

        <nav
          id="navbar"
          className={`navbar order-last order-lg-0 ${
            mobileNavOpen ? "navbar-mobile" : ""
          }`}
        >
          <ul>
            <li>
              {isHomePage ? (
                <a
                  className="nav-link scrollto active"
                  href="#hero"
                  onClick={closeMobileNav}
                >
                  Home
                </a>
              ) : (
                <Link className="nav-link" to="/" onClick={closeMobileNav}>
                  Home
                </Link>
              )}
            </li>
            <li>
              {isHomePage ? (
                <a
                  className="nav-link scrollto"
                  href="#about"
                  onClick={closeMobileNav}
                >
                  About
                </a>
              ) : (
                <Link
                  className="nav-link"
                  to="/#about"
                  onClick={closeMobileNav}
                >
                  About
                </Link>
              )}
            </li>
            <li>
              {isHomePage ? (
                <a
                  className="nav-link scrollto"
                  href="#speakers"
                  onClick={closeMobileNav}
                >
                  Speakers
                </a>
              ) : (
                <Link
                  className="nav-link"
                  to="/#speakers"
                  onClick={closeMobileNav}
                >
                  Speakers
                </Link>
              )}
            </li>
            <li>
              {isHomePage ? (
                <a
                  className="nav-link scrollto"
                  href="#gallery"
                  onClick={closeMobileNav}
                >
                  Gallery
                </a>
              ) : (
                <Link
                  className="nav-link"
                  to="/#gallery"
                  onClick={closeMobileNav}
                >
                  Gallery
                </Link>
              )}
            </li>
            {/* <li>
              {isHomePage ? (
                <a
                  className="nav-link scrollto"
                  href="#venue"
                  onClick={closeMobileNav}
                >
                  Venue
                </a>
              ) : (
                <Link
                  className="nav-link"
                  to="/#venue"
                  onClick={closeMobileNav}
                >
                  Venue
                </Link>
              )}
            </li> */}
            <li>
              {isHomePage ? (
                <a
                  className="nav-link scrollto"
                  href="#sponsors"
                  onClick={closeMobileNav}
                >
                  Sponsors
                </a>
              ) : (
                <Link
                  className="nav-link"
                  to="/#sponsors"
                  onClick={closeMobileNav}
                >
                  Sponsors
                </Link>
              )}
            </li>
            <li>
              {isHomePage ? (
                <a
                  className="nav-link scrollto"
                  href="#contact"
                  onClick={closeMobileNav}
                >
                  Contact
                </a>
              ) : (
                <Link
                  className="nav-link"
                  to="/#contact"
                  onClick={closeMobileNav}
                >
                  Contact
                </Link>
              )}
            </li>
            <li>
              <Link
                className="nav-link"
                to="/codeofconduct"
                onClick={closeMobileNav}
              >
                Code of Conduct
              </Link>
            </li>
            {/* <li>
              <a
                className="buy-tickets scrollto text-decoration-none px-3"
                href="https://forms.office.com/r/GW90BFyq7B"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileNav}
              >
                Register
              </a>
            </li> */}
          </ul>
          <i
            className={`bi ${
              mobileNavOpen ? "bi-x" : "bi-list"
            } mobile-nav-toggle`}
            onClick={toggleMobileNav}
          ></i>
        </nav>
      </div>
    </header>
  );
};

export default Header;
