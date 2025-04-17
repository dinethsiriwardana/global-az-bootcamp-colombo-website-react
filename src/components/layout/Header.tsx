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

  return (
    <header
      id="header"
      className={`d-flex align-items-center ${
        scrolled ? "header-scrolled" : ""
      }`}
    >
      <div className="container-fluid container-xxl d-flex align-items-center">
        <div id="logo" className="me-auto">
          <Link to="/">
            <img
              src="/assets/img/GlobalAzure2025-500.png"
              alt="Global Azure 2025 Logo"
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
                <a className="nav-link scrollto active" href="#hero">
                  Home
                </a>
              ) : (
                <Link className="nav-link" to="/">
                  Home
                </Link>
              )}
            </li>
            <li>
              {isHomePage ? (
                <a className="nav-link scrollto" href="#about">
                  About
                </a>
              ) : (
                <Link className="nav-link" to="/#about">
                  About
                </Link>
              )}
            </li>
            <li>
              {isHomePage ? (
                <a className="nav-link scrollto" href="#speakers">
                  Speakers
                </a>
              ) : (
                <Link className="nav-link" to="/#speakers">
                  Speakers
                </Link>
              )}
            </li>
            <li>
              {isHomePage ? (
                <a className="nav-link scrollto" href="#schedule">
                  Schedule
                </a>
              ) : (
                <Link className="nav-link" to="/#schedule">
                  Schedule
                </Link>
              )}
            </li>
            <li>
              {isHomePage ? (
                <a className="nav-link scrollto" href="#venue">
                  Venue
                </a>
              ) : (
                <Link className="nav-link" to="/#venue">
                  Venue
                </Link>
              )}
            </li>
            <li>
              {isHomePage ? (
                <a className="nav-link scrollto" href="#sponsors">
                  Sponsors
                </a>
              ) : (
                <Link className="nav-link" to="/#sponsors">
                  Sponsors
                </Link>
              )}
            </li>
            <li>
              {isHomePage ? (
                <a className="nav-link scrollto" href="#contact">
                  Contact
                </a>
              ) : (
                <Link className="nav-link" to="/#contact">
                  Contact
                </Link>
              )}
            </li>
            <li>
              <Link className="nav-link" to="/codeofconduct">
                Code of Conduct
              </Link>
            </li>
            <li>
              <a
                className="buy-tickets scrollto text-decoration-none px-3"
                href="https://forms.office.com/r/GW90BFyq7B"
                target="_blank"
                rel="noopener noreferrer"
              >
                Register
              </a>
            </li>
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
