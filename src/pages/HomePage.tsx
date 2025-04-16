import React from "react";

// Import section components
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Speakers from "../components/sections/Speakers";
import Schedule from "../components/sections/Schedule";
import Venue from "../components/sections/Venue";
import Sponsors from "../components/sections/Sponsors";
// import Contact from "../components/sections/Contact";
import Faq from "../components/sections/FAQ";

const HomePage = () => {
  return (
    <div className="home-page-container">
      <main id="main" className="main-content">
        <Hero />
        <About />
        <Speakers />
        <Schedule />
        <Venue />
        <Sponsors />
        <Faq />
      </main>
    </div>
  );
};

export default HomePage;
