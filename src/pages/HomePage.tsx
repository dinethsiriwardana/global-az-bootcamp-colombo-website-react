import React from "react";

// Import section components
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Speakers from "../components/sections/Speakers";
import Sponsors from "../components/sections/Sponsors";
// import Contact from "../components/sections/Contact";
import Faq from "../components/sections/FAQ";
import Contact from "../components/sections/Contact";
import Gallery from "../components/sections/Gallery";
import Venue from "../components/sections/Venue";

const HomePage = () => {
  return (
    <div className="home-page-container">
      <main id="main" className="main-content">
        <Hero />
        <About />
        <Speakers />
        {/* <Schedule /> */}
        <Venue />
        <Gallery />
        <Sponsors />
        {/* <Faq /> */}
        <Contact />
      </main>
    </div>
  );
};

export default HomePage;
