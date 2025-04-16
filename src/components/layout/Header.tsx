import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
              <a className="nav-link scrollto active" href="#hero">
                Home
              </a>
            </li>
            <li>
              <a className="nav-link scrollto" href="#about">
                About
              </a>
            </li>
            <li>
              <a className="nav-link scrollto" href="#speakers">
                Speakers
              </a>
            </li>
            <li>
              <a className="nav-link scrollto" href="#schedule">
                Schedule
              </a>
            </li>
            <li>
              <a className="nav-link scrollto" href="#venue">
                Venue
              </a>
            </li>
            <li>
              <a className="nav-link scrollto" href="#sponsors">
                Sponsors
              </a>
            </li>
            <li>
              <a className="nav-link scrollto" href="#contact">
                Contact
              </a>
            </li>
            <li>
              <Link className="nav-link" to="/codeofconduct">
                Code of Conduct
              </Link>
            </li>
            <li>
              <a
                className="buy-tickets scrollto text-decoration-none px-3"
                href="https://lu.ma/0m4wdoer"
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
