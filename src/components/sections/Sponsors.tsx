import React, { useMemo } from "react";

interface Sponsor {
  id: number;
  name: string;
  logo: string;
  url: string;
  tier: "platinum" | "gold" | "silver" | "bronze";
}

interface SponsorsByTier {
  platinum: Sponsor[];
  gold: Sponsor[];
  silver: Sponsor[];
  bronze: Sponsor[];
}

const TIER_CONFIG = {
  platinum: { colClass: "col-lg-4 col-md-6", delay: 100 },
  gold: { colClass: "col-lg-3 col-md-4 col-6", delay: 200 },
  silver: { colClass: "col-lg-2 col-md-3 col-4", delay: 300 },
  bronze: { colClass: "col-lg-2 col-md-3 col-4", delay: 400 },
};

const Sponsors = () => {
  const sponsors: Sponsor[] = useMemo(
    () => [
      {
        id: 1,
        name: "Wiley",
        logo: "/assets/img/sponsors/wiley.png",
        url: "https://www.wiley.com/",
        tier: "silver",
      },
      {
        id: 2,
        name: "ToothFairy AI",
        logo: "/assets/img/sponsors/ToothFairyAI - Logo.png",
        url: "https://toothfairy.ai",
        tier: "silver",
      },
      {
        id: 3,
        name: "Arinco",
        logo: "/assets/img/sponsors/arinco.png",
        url: "https://arinco.com.au",
        tier: "silver",
      },
      {
        id: 4,
        name: "Dijital",
        logo: "/assets/img/sponsors/dijital.png",
        url: "https://dijital.ca",
        tier: "silver",
      },
      {
        id: 5,
        name: "Advania",
        logo: "/assets/img/sponsors/Advania.png",
        url: "https://advania.com",
        tier: "gold",
      },
      {
        id: 6,
        name: "Lodge",
        logo: "/assets/img/sponsors/lodge.png",
        url: "https://lodgeservice.com",
        tier: "silver",
      },
    ],
    []
  );

  // Group sponsors by tier using useMemo to prevent recalculation on each render
  const sponsorsByTier = useMemo<SponsorsByTier>(() => {
    return sponsors.reduce(
      (acc, sponsor) => {
        acc[sponsor.tier].push(sponsor);
        return acc;
      },
      { platinum: [], gold: [], silver: [], bronze: [] } as SponsorsByTier
    );
  }, [sponsors]);

  // Render a tier of sponsors
  const renderSponsorTier = (tierName: keyof SponsorsByTier) => {
    const tierSponsors = sponsorsByTier[tierName];
    if (tierSponsors.length === 0) return null;

    const { colClass, delay } = TIER_CONFIG[tierName];
    const capitalizedTier =
      tierName.charAt(0).toUpperCase() + tierName.slice(1);

    return (
      <div
        className={`row ${tierName}-sponsors justify-content-center  align-items-center`}
        data-aos="zoom-in"
        data-aos-delay={delay}
      >
        <h3 className="sponsor-category">{capitalizedTier} Sponsors</h3>
        {tierSponsors.map((sponsor) => (
          <div className={colClass} key={sponsor.id}>
            <a href={sponsor.url} target="_blank" rel="noopener noreferrer">
              <img
                src={sponsor.logo}
                className="img-fluid"
                alt={sponsor.name}
              />
            </a>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section id="sponsors" className="section-with-bg pt-5">
      <div className="container" data-aos="fade-up">
        <div className="section-header">
          <h2>Sponsors</h2>
          <p>Here are the organizations that make this event possible</p>
        </div>

        {renderSponsorTier("platinum")}
        {renderSponsorTier("gold")}
        {renderSponsorTier("silver")}
        {renderSponsorTier("bronze")}

        <div
          className="row no-gutters sponsors-call-to-action"
          data-aos="fade-up"
        >
          <div className="col-12">
            <h4>Become a Sponsor</h4>
            <p>
              Interested in sponsoring Global Azure 2025 Sri Lanka? Contact us
              to discuss sponsorship opportunities.
            </p>
            <a className="sponsor-btn text-decoration-none" href="#contact">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
