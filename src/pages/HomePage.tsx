
import React from "react";

// Import section components
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Speakers from "../components/sections/Speakers";
import OrganizingCommittee from "../components/sections/OrganizingCommittee";
import Sponsors from "../components/sections/Sponsors";
import Contact from "../components/sections/Contact";
import CounterBanner from "../components/sections/CounterBanner";
import CountdownBanner from "../components/sections/CountdownBanner";

const HomePage = () => {
  return (
    <div className="home-page-container" style={{ overflowX: "hidden" }}>
      <main id="main" className="main-content">
        <Hero />
        <About />
        <Speakers />
        <CountdownBanner />
        {/* <CounterBanner /> */}
        {/* <Schedule /> */}
        {/* <Gallery /> */}
        <Sponsors />
        <OrganizingCommittee />
        {/* <Faq /> */}
        <Contact />
      </main>
    </div>
  );
};

export default HomePage;
