import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import lgShare from "lightgallery/plugins/share";
import lgHash from "lightgallery/plugins/hash";
import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";
import AOS from "aos";

// Import data
import { globalAzureSessions } from "../data/globalAzureSessions";

// Define session data type
interface AzureSession {
  Title: string;
  Owner: string;
  Track: string;
  FirstName: string;
  LastName: string;
  TagLine: string | null;
  LinkedIn: string;
}

interface Link {
  linkType: string;
  url: string;
}

interface Speaker {
  id: string;
  fullName: string;
  profilePicture: string;
  links: Link[];
  tagLine?: string;
  track?: string;
  session?: string;
}

// Local hard-coded data
const localGlobalAzureSessions: AzureSession[] = [
  {
    Title: "Navigating Your Cloud Career in an AI-Driven World",
    Owner: "Pathum Udana",
    Track: "General",
    FirstName: "Prabhath",
    LastName: "Mannapperuma",
    TagLine: "Partner Technology Strategist - Microsoft",
    LinkedIn: "https://www.linkedin.com/in/dprabhath",
  },
  {
    Title:
      "Azure Certification Roadmap: Learning Paths, Discounts & Smart Strategies to Succeed",
    Owner: "Rizmi Razik",
    Track: "Infra and security",
    FirstName: "Rizmi",
    LastName: "Razik",
    TagLine:
      "Head of Hybrid Cloud Engineering (Azure Practice Lead) @ Dijital Team",
    LinkedIn: "https://www.linkedin.com/in/rizmi-razik-9a6b4551/",
  },
  {
    Title: "Azure Platform Monitoring - A Distributed and Extensible Solution",
    Owner: "Ijaz Rameez",
    Track: "App and DevOps",
    FirstName: "Ijaz",
    LastName: "Rameez",
    TagLine: "Senior DevOps Engineer at Advania Pvt Ltd",
    LinkedIn: "https://www.linkedin.com/in/ijazrameez",
  },
  {
    Title: "Deploying API-First Apps with Azure API Management",
    Owner: "Dineth Siriwardhana",
    Track: "App and DevOps",
    FirstName: "Dineth",
    LastName: "Siriwardhana",
    TagLine: "Gold Microsoft Learn Student Ambassador",
    LinkedIn: "https://www.linkedin.com/in/dinethsiriwardana/",
  },
  {
    Title: "Leverage your Business Analytics with Microsoft Fabric",
    Owner: "Global Azure",
    Track: "Data & AI",
    FirstName: "Supun",
    LastName: "Sudheera ",
    TagLine: null,
    LinkedIn: "https://www.linkedin.com/in/supun-jayalath/",
  },
  {
    Title:
      "Automate the employee identity lifecycle with Microsoft Entra ID Governance",
    Owner: "Pathum Udana",
    Track: "Infra and security",
    FirstName: "Pathum",
    LastName: "Udana",
    TagLine:
      "Microsoft MVP & Principal Engineer - Identity and Access Management at Wiley",
    LinkedIn: "https://www.linkedin.com/in/pathumudana/",
  },
  {
    Title:
      "Supercharging AI Agents with MCP: Seamless Integration of Azure Services",
    Owner: "Nisal Mihiranga",
    Track: "Data & AI",
    FirstName: "Nisal",
    LastName: "Mihiranga",
    TagLine:
      "Head of AI & Data Science at Zone24x7, Microsoft MVP - AI, MCT, AI Architect ",
    LinkedIn: "https://www.linkedin.com/in/nisalm/",
  },
  {
    Title: "Understanding Data API Builder",
    Owner: "Fiqri Ismail",
    Track: "App and DevOps",
    FirstName: "Fiqri",
    LastName: "Ismail",
    TagLine: "Archtect | Author | Microsoft MVP | Traveller | Speaker ",
    LinkedIn: "https://www.linkedin.com/in/fiqriismail/",
  },
  {
    Title: "Mastering Azure Bicep",
    Owner: "Danidu Weerasinghe",
    Track: "Infra and security",
    FirstName: "Danidu",
    LastName: "Weerasinghe",
    TagLine: "Azure MVP, Consultant @ Arinco",
    LinkedIn: "https://www.linkedin.com/in/danidu-weerasinghe-b5615b42/",
  },

  {
    Title:
      "Reinforcement Learning in Action: Smart Decisions with Azure Machine Learning",
    Owner: "Uditha Bandara",
    Track: "Data & AI",
    FirstName: "Uditha",
    LastName: "Bandara",
    TagLine: " AI Technology Disruptor",
    LinkedIn: "https://www.linkedin.com/in/udithabandara/",
  },
  {
    Title: "Catch It Before It Breaks: SAST & DAST for DevSecOps in Azure",
    Owner: "Pasindu Wijesinghe",
    Track: "App and DevOps",
    FirstName: "Pasindu",
    LastName: "Wijesinghe",
    TagLine: "Associate Engineer Network & Security",
    LinkedIn:
      "https://www.linkedin.com/in/pasindu-malshika-wijesinghe?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  },
  {
    Title:
      "Architecting Enterprise-Scale Azure Networks: Secure, Resilient & Mission-Critical Connectivity",
    Owner: "Thisara Perera",
    Track: "Infra and security",
    FirstName: "Thisara",
    LastName: "Perera",
    TagLine:
      "Position: Cloud Solutions Architect Company: Crayon Microsoft Certified Trainer",
    LinkedIn: "https://www.linkedin.com/in/thisara-perera",
  },
  {
    Title:
      "Talk to Your Data: Building a Smart Sales Agent with Azure SQL and AI",
    Owner: "Dinesh Priyankara",
    Track: "Data & AI",
    FirstName: "Dinesh",
    LastName: "Priyankara",
    TagLine: "dinesQL Pte Ltd.",
    LinkedIn: "https://www.linkedin.com/in/dineshpriyankara/",
  },
];

// Define types for counter items
interface CounterItem {
  title: string;
  count: number;
  suffix?: string;
}

// Define types for gallery images
interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  thumbnail?: string;
}

// Define sponsor types
interface Sponsor {
  id: number;
  name: string;
  logo: string;
  url: string;
  tier: "platinum" | "gold" | "silver" | "bronze" | "venue";
}

interface SponsorsByTier {
  platinum: Sponsor[];
  gold: Sponsor[];
  silver: Sponsor[];
  bronze: Sponsor[];
  venue: Sponsor[];
}

// Define contact form data
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// TIER_CONFIG for sponsors
const TIER_CONFIG = {
  platinum: {
    colClass: "col-lg-4 col-md-6",
    delay: 100,
    logoWidth: 300,
    logoHeight: 180,
  },
  gold: {
    colClass: "col-lg-3 col-md-4 col-6",
    delay: 200,
    logoWidth: 240,
    logoHeight: 150,
  },
  silver: {
    colClass: "col-lg-2 col-md-3 col-4",
    delay: 300,
    logoWidth: 180,
    logoHeight: 120,
  },
  bronze: {
    colClass: "col-lg-2 col-md-3 col-4",
    delay: 400,
    logoWidth: 150,
    logoHeight: 100,
  },
  venue: {
    colClass: "col-lg-2 col-md-2 col-3",
    delay: 500,
    logoWidth: 120,
    logoHeight: 80,
  },
};

const HomePage = () => {
  // Speakers state
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [speakersLoading, setSpeakersLoading] = useState<boolean>(true);
  const [speakersError, setSpeakersError] = useState<string | null>(null);

  // CounterBanner state
  const counters = useMemo<CounterItem[]>(
    () => [
      { title: "Speakers", count: 13 },
      { title: "Participants", count: 220, suffix: "+" },
      { title: "Tracks", count: 3 },
    ],
    []
  );
  const [animatedCounters, setAnimatedCounters] = useState<number[]>(
    counters.map(() => 0)
  );

  // Gallery state
  const [galleryHasError, setGalleryHasError] = useState<boolean>(false);
  const [galleryRetryCount, setGalleryRetryCount] = useState<number>(0);
  const [galleryLoading, setGalleryLoading] = useState<boolean>(true);
  const [imagesLoadedCount, setImagesLoadedCount] = useState<number>(0);
  const masonryRef = useRef<any>(null);
  const MAX_RETRIES = 3;

  // Sponsors data
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
        url: "https://lodgepro.com.au/",
        tier: "silver",
      },
      {
        id: 7,
        name: "Microsoft",
        logo: "/assets/img/sponsors/microsoft.png",
        url: "https://www.microsoft.com/en-lk/",
        tier: "venue",
      },
    ],
    []
  );

  // Hero useEffect
  useEffect(() => {
    const images = ["bg.jpg", "bg2.png"];
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // Set the background image for the hero section
    const heroElement = document.getElementById("hero");
    if (heroElement) {
      heroElement.style.background = `url('assets/img/${randomImage}') top center`;
      heroElement.style.backgroundSize = "cover";
    }
  }, []);

  // Speakers useEffect
  useEffect(() => {
    try {
      // Rearrange the sessions array to move last 4 to the beginning
      const sessionsCount = localGlobalAzureSessions.length;
      const reorderedSessions = [
        ...localGlobalAzureSessions.slice(sessionsCount - 4, sessionsCount),
        ...localGlobalAzureSessions.slice(0, sessionsCount - 4),
      ];

      // Process the reordered data
      const processedSpeakers: Speaker[] = reorderedSessions.map(
        (session: AzureSession, index: number) => {
          // Handle specific cases for file extensions and capitalization
          let imagePath = `/assets/img/speakers/${session.FirstName.toLowerCase()}.jpg`;

          return {
            id: `speaker-${index}`,
            fullName: `${session.FirstName} ${session.LastName}`,
            profilePicture: imagePath,
            tagLine: session.TagLine || "",
            track: session.Track,
            session: session.Title,
            links: [
              {
                linkType: "LinkedIn",
                url: session.LinkedIn || "#",
              },
            ],
          };
        }
      );

      console.log("Reordered and processed speakers:", processedSpeakers);
      setSpeakers(processedSpeakers);
      setSpeakersLoading(false);
    } catch (error) {
      setSpeakersError("Error processing speaker data: " + error);
      setSpeakersLoading(false);
    }
  }, []);

  // CounterBanner useEffect
  useEffect(() => {
    const animateCounters = () => {
      const duration = 2000; // 2 seconds for the animation
      const steps = 60; // Number of steps for the animation
      const stepDuration = duration / steps;

      let currentStep = 0;

      const interval = setInterval(() => {
        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedCounters(counters.map((counter) => counter.count));
          return;
        }

        setAnimatedCounters(
          counters.map((counter, index) => {
            return Math.ceil((counter.count * currentStep) / steps);
          })
        );

        currentStep++;
      }, stepDuration);

      return () => clearInterval(interval);
    };

    // Start animation when component is mounted
    const timeout = setTimeout(animateCounters, 500); // Small delay to ensure component is visible

    return () => clearTimeout(timeout);
  }, [counters]);

  // Gallery useEffect for initialization
  useEffect(() => {
    // Make sure we only run this after the DOM has been fully loaded
    const initMasonry = () => {
      try {
        // Show loading state
        setGalleryLoading(true);

        // Ensure the DOM element exists
        const container = document.querySelector(
          `.masonryGalleryDemo`
        );
        if (!container) {
          throw new Error("Gallery container not found");
        }

        // Initialize Masonry with proper options
        const msnry = new Masonry(container, {
          itemSelector: ".gallery-item",
          columnWidth: ".grid-sizer",
          percentPosition: true,
          gutter: 16, // Slightly wider gutter for 4 columns
          transitionDuration: "0.4s", // Smooth transitions when layout changes
        });

        // Save the masonry instance in the ref
        masonryRef.current = msnry;

        // Trigger an initial layout
        msnry.layout();
        // Use imagesLoaded to handle layout after images are fully loaded
        const imgLoad = imagesLoaded(container);
        
        // Reset image load count
        setImagesLoadedCount(0);
        // Reposition items when each image loads
        imgLoad.on("progress", (instance, image) => {
          // Update the count of loaded images
          setImagesLoadedCount((prev) => prev + 1);

          // Show the image that just loaded
          if (image && image.img) {
            const imgElement = image.img;
            imgElement.classList.add('loaded');
            imgElement.style.opacity = "1";
          }

          // Layout Masonry after each image loads
          msnry.layout();
        });

        // Final layout after all images have loaded
        imgLoad.on("done", () => {
          msnry.layout();
          // Reset error state on success
          setGalleryHasError(false);
          // Hide loading state
          setGalleryLoading(false);
        });

        // Handle any failures with image loading
        imgLoad.on("fail", (instance, img) => {
          if (img && img.img) {
            console.error(`Failed to load image: ${img.img.src}`);
          } else {
            console.error("Failed to load an image");
          }
          // Do not set error state here, let individual image error handlers handle it
        });
      } catch (error) {
        console.error("Failed to initialize Masonry:", error);
        setGalleryHasError(true);
        setGalleryLoading(false);

        if (galleryRetryCount < MAX_RETRIES) {
          setGalleryRetryCount((prev) => prev + 1);
        }
      }
    };

    // Run after a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initMasonry();
    }, 300);

    return () => clearTimeout(timer);
  }, [galleryRetryCount]);

  // Gallery retry useEffect
  useEffect(() => {
    if (galleryHasError && galleryRetryCount > 0 && galleryRetryCount <= MAX_RETRIES) {
      console.log(
        `Retrying masonry initialization (${galleryRetryCount}/${MAX_RETRIES})...`
      );

      const retryTimer = setTimeout(() => {
        // Exponential backoff: longer wait times between retries
        // 500ms, 1000ms, 2000ms
        const initMasonryWithDelay = () => {
          try {
            // Ensure the DOM element exists
            const container = document.querySelector(
              `.masonryGalleryDemo`
            );
            if (!container) {
              throw new Error("Gallery container not found");
            }

            // Initialize Masonry with proper options
            const msnry = new Masonry(container, {
              itemSelector: ".gallery-item",
              columnWidth: ".grid-sizer",
              percentPosition: true,
              gutter: 16, // Slightly wider gutter for 4 columns
              transitionDuration: "0.4s", // Smooth transitions when layout changes
            });

            // Trigger initial layout
            msnry.layout();

            console.log("Masonry retry successful");
            setGalleryHasError(false);
          } catch (error) {
            console.error("Error during retry:", error);
            if (galleryRetryCount >= MAX_RETRIES) {
              console.error("Max retries reached, giving up.");
            }
          }
        };

        initMasonryWithDelay();
      }, 500 * Math.pow(2, galleryRetryCount - 1));

      return () => clearTimeout(retryTimer);
    }
  }, [galleryHasError, galleryRetryCount]);

  // Speakers function
  const getSocialIcon = (type: string): string => {
    const icons: Record<string, string> = {
      Twitter: "twitter",
      LinkedIn: "linkedin",
      YouTube: "youtube",
      Instagram: "instagram",
      Website: "globe",
    };
    return icons[type] || "link";
  };

  // Gallery functions
  const loadGalleryImages = (
    folderPath: string = "/assets/img/gallery2025/",
    fileExtension: string = "jpg"
  ): GalleryImage[] => {
    // For a production app, you might want to fetch this list from an API
    // but for this demo, we'll use the actual file names from the gallery folder

    // Array of actual image filenames in the gallery folder (without extension)
    const imageFileNames = [
      "DSC_2026",
      "DSC_2032",
      "DSC_2038",
      "DSC_2063",
      "DSC_2094",
      "DSC_2118",
      "DSC_2140",
      "DSC_2143",
      "DSC_2161",
      "DSC_2176",
      "DSC_2199",
      "DSC_2223",
      "DSC_2241",
      "DSC_2271",
      "DSC_2309",
      "DSC_2366",
      "DSC_2381",
      "DSC_2407",
      "DSC_2478",
      "DSC_2511",
      "DSC_2542",
      "DSC_2554",
      "DSC_2564",
    ];

    const initialImagesToShow = imageFileNames.length; // Show all images

    // Generate array of image objects using actual filenames
    return imageFileNames
      .map((fileName, index) => {
        const imagePath = `${folderPath}${fileName}.${fileExtension}`;

        return {
          id: index + 1,
          src: imagePath,
          alt: `Azure Bootcamp Colombo Gallery Image ${index + 1}`,
        };
      })
      .slice(0, initialImagesToShow); // Only return the initial set of images
  };

  const galleryImages: GalleryImage[] = loadGalleryImages();

  const handleImageError = (
    imageId: number,
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.error(`Failed to load image with ID: ${imageId}`);

    // Set a fallback image if original fails to load
    const imgElement = e.target as HTMLImageElement;
    imgElement.src = "/assets/img/about-bg.jpg"; // Use a default fallback image that exists in your project

    // We still want to log the error but don't need to trigger a full retry of the gallery
    // as we're handling the fallback at the individual image level
    if (galleryRetryCount < MAX_RETRIES) {
      setGalleryRetryCount((prevCount) => prevCount + 1);
    }
  };

  const handleImageLoad = (
    imageId: number,
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    // If masonry needs to be refreshed after an image loads
    if (masonryRef.current) {
      masonryRef.current.layout();
    }
  };

  // Sponsors data processing
  const sponsorsByTier = useMemo<SponsorsByTier>(() => {
    return sponsors.reduce(
      (acc, sponsor) => {
        acc[sponsor.tier].push(sponsor);
        return acc;
      },
      {
        platinum: [],
        gold: [],
        silver: [],
        bronze: [],
        venue: [],
      } as SponsorsByTier
    );
  }, [sponsors]);

  const renderSponsorTier = (tierName: keyof SponsorsByTier) => {
    const tierSponsors = sponsorsByTier[tierName];
    if (tierSponsors.length === 0) return null;

    const { colClass, delay, logoWidth, logoHeight } = TIER_CONFIG[tierName];
    const capitalizedTier =
      tierName.charAt(0).toUpperCase() + tierName.slice(1);

    return (
      <div
        className={`row ${tierName}-sponsors justify-content-center  align-items-center`}
        data-aos="zoom-in"
        data-aos-delay={delay}
      >
        <h3 className="sponsor-category">
          {capitalizedTier} {tierSponsors.length === 1 ? "Sponsor" : "Sponsors"}
        </h3>
        {tierSponsors.map((sponsor) => (
          <div className={colClass} key={sponsor.id}>
            <a href={sponsor.url} target="_blank" rel="noopener noreferrer">
              <img
                src={sponsor.logo}
                className="img-fluid"
                alt={sponsor.name}
                width={logoWidth}
                height={logoHeight}
                style={{ objectFit: "contain" }}
              />
            </a>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="home-page-container">
      <main id="main" className="main-content">
        <section id="hero">
          <div className="hero-container" data-aos="zoom-in" data-aos-delay="100">
            <img
              src="assets/img/GlobalAzure2025-500.png"
              alt="Global Azure Bootcamp Logo"
              title="Global Azure Bootcamp Logo"
              className="img-fluid"
              loading="lazy"
            />
            <h1 className="mb-4 pb-0">
              <span>Colombo</span>
            </h1>
            <p className="mb-4 pb-0">10th May, 2025</p>
            {/* Replacing the anchor tag with a button to fix the accessibility warning */}
            {/* <Button
              className="about-btn buy-tickets scrollto"
              onClick={() => setShowModal(true)}
              style={{
                background: "#f82249",
                color: "#fff",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                letterSpacing: "1px",
                padding: "12px 32px",
                borderRadius: "50px",
                transition: "0.5s",
                lineHeight: 1,
                border: "2px solid #f82249",
              }}
            >
              Go Virtual
            </Button>

            <a href="#about" className="about-btn scrollto">
              Event Details
            </a> */}
          </div>
        </section>
        <section id="about">
          <div className="container position-relative" data-aos="fade-up">
            <div className="row">
              <div className="col-lg-8 text-center text-lg-start">
                <h2>About The Event</h2>
                <p className="pe-lg-7">
                  Global Azure 2025 took place on May 10th, with communities
                  worldwide organizing localized hybrid events and live streams.
                  This global event brought together Azure enthusiasts, offering
                  everyone the opportunity to join and learn from top community
                  leaders.
                </p>
                <p>
                  In Sri Lanka, the Microsoft IT Pro Community proudly participated
                  in this movement. Participants connected with fellow Azure
                  professionals, engaged in insightful sessions, and enhanced their
                  Azure skills. Whether seasoned experts or beginners on their Azure
                  journey, attendees found something valuable at Global Azure 2025.
                </p>
              </div>
              <div className="col-lg-2 text-center text-lg-start">
                <h3 style={{marginTop: '2rem', marginBottom: '0.5rem', paddingLeft: '1.5rem'}}>Where</h3>
                <p style={{marginTop: '0.5rem', marginBottom: '0.5rem', paddingLeft: '1.5rem'}}>Microsoft Sri Lanka</p>
                <h3 style={{marginTop: '2rem', marginBottom: '0.5rem', paddingLeft: '1.5rem'}}>When</h3>
                <p style={{marginTop: '0.5rem', marginBottom: '0.5rem', paddingLeft: '1.5rem'}}>Saturday 10th May</p>
              </div>
              <div className="col-lg-2 text-lg-start">
                <h3 style={{marginTop: '2rem', marginBottom: '0.5rem', paddingLeft: '1rem'}}>Hosted By</h3>
                <br></br>
                <img
                  src="/assets/img/itpro.png"
                  alt="Global Azure 2025"
                  height="80"
                  style={{marginTop: '-1rem', marginBottom: '0.5rem', paddingLeft: '0rem'}}
                />
              </div>
            </div>
          </div>
        </section>
        <section id="speakers">
          <div className="container" data-aos="fade-up">
            <div className="section-header">
              <h2>Event Speakers</h2>
            </div>
          </div>
          {speakersLoading ? (
            <div>Loading speakers...</div>
          ) : speakersError ? (
            <div className="error">{speakersError}</div>
          ) : (
            <Swiper
              className="gallery-slider"
              speed={400}
              centeredSlides={true}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              slidesPerView="auto"
              pagination={{
                el: ".swiper-pagination",
                type: "bullets",
                clickable: true,
              }}
              modules={[Autoplay, Pagination]}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 20 },
                575: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                992: { slidesPerView: 5, spaceBetween: 20 },
              }}
            >
              {speakers.map((speaker) => {
                const linkedinProfile =
                  speaker.links.find((link) => link.linkType === "LinkedIn")?.url ||
                  "#";

                return (
                  <SwiperSlide key={speaker.id}>
                    <div className="speaker" data-aos="fade-up">
                      <img
                        src={speaker.profilePicture}
                        alt={speaker.fullName}
                        className="img-fluid"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "/assets/img/speakers/tbd.png";
                        }}
                      />
                      <div className="details">
                        <h3>
                          <a
                            href={linkedinProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {speaker.fullName}
                          </a>
                        </h3>

                        <p className="speaker-sessions">
                          {speaker.session || "Session Info Not Available"}
                        </p>
                        <div className="social">
                          {speaker.links.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i
                                className={`bi bi-${getSocialIcon(link.linkType)}`}
                              ></i>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
              <br></br>
              <div className="swiper-pagination"></div>
            </Swiper>
          )}
        </section>
        <section id="counter-stats" className="counter-banner section-with-bg">
          <div className="container" data-aos="fade-up">
            <div className="section-header">
              <h2>Event Statistics</h2>
              <p>Global Azure Bootcamp 2025 Colombo</p>
            </div>
            <div className="row counter-row justify-content-center">
              {counters.map((counter, index) => (
                <div
                  className="col-lg-3 col-md-4 col-6 counter-item text-center"
                  key={index}
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                >
                  <div className="counter-box">
                    <div className="counter-num">
                      <span className="count-number">
                        {animatedCounters[index]}
                      </span>
                      {counter.suffix && (
                        <span className="counter-suffix">{counter.suffix}</span>
                      )}
                    </div>
                    <p className="counter-text">{counter.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* <Schedule /> */}
        <section id="gallery">
          <div className="container-fluid" data-aos="fade-up">
            <div className="section-header">
              <h2>Gallery</h2>
              <p>A Glimpse into What We've Been Up To</p>
            </div>

            <div className="masonryGalleryWrapper">
              {galleryLoading && (
                <div className="galleryLoading">
                  <p>
                    Getting images ready... 
                    {imagesLoadedCount > 0 && (
                      <span>({Math.round((imagesLoadedCount / galleryImages.length) * 100)}% complete)</span>
                    )}
                  </p>
                  <div className="loaderSpinner"></div>
                </div>
              )}

              {galleryHasError && galleryRetryCount >= MAX_RETRIES && (
                <div className="galleryError">
                  <p>
                    There was an error loading the gallery. Please try refreshing the
                    page.
                  </p>
                </div>
              )}

              <LightGallery
                elementClassNames="masonryGalleryDemo"
                plugins={[lgZoom, lgShare, lgHash]}
                speed={500}
                mode="lg-fade"
                selector=".gallery-item"
                licenseKey="0000-0000-000-0000" // Add license key if you have one
                download={false} // Disable download button if not needed
                counter={true}
                mobileSettings={{
                  controls: true,
                  showCloseIcon: true,
                  download: false,
                }}
              >
                <div className="grid-sizer"></div>

                {galleryImages.map((image) => (
                  <a
                    key={image.id}
                    href={image.src}
                    className="gallery-item"
                    data-src={image.src}
                    data-sub-html={`<h4>${image.alt}</h4>`}
                    style={{ display: "block" }} // Always display the container
                  >
                    <img
                      alt={image.alt}
                      className={`img-responsive ${!galleryLoading ? 'loaded' : ''}`}
                      src={image.src}
                      loading="lazy"
                      onError={(e) => handleImageError(image.id, e)}
                      onLoad={(e) => handleImageLoad(image.id, e)}
                      style={{
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                      }}
                    />
                  </a>
                ))}
              </LightGallery>

              {/* Floating loading progress indicator */}
              {galleryLoading && imagesLoadedCount > 0 && (
                <div className="loadingProgress">
                  {imagesLoadedCount} of {galleryImages.length} loaded ({Math.round((imagesLoadedCount / galleryImages.length) * 100)}%)
                </div>
              )}

             
            </div>
          </div>
        </section>
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
            {renderSponsorTier("venue")}

            <div
              className="row no-gutters sponsors-call-to-action"
              data-aos="fade-up"
            >
              <div className="col-12">
                <p>
                  We extend our heartfelt thanks to all our sponsors for supporting
                  Global Azure 2025 in Sri Lanka. Your generosity and partnership
                  played a vital role in making this event a success, helping us
                  bring together a vibrant community of Azure enthusiasts and
                  professionals. Your support empowered us to deliver quality
                  sessions, offer meaningful engagement, and create a memorable
                  experience for all attendees. We deeply appreciate your commitment
                  to community growth and learning. Thank you once again for being
                  part of this journey!
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* <Faq /> */}
        <section id="contact" className="section-bg">
          <div className="container" data-aos="fade-up">
            <div className="section-header">
              <h2>Contact Us</h2>
              <p>Contact us for any inquiries about the Global Azure 2025 event</p>
            </div>

            <div className="row contact-info">
              <div className="col-md-4">
                <div className="contact-address">
                  <i className="bi bi-geo-alt"></i>
                  <h3>Address</h3>
                  <address>
                    Microsoft IT Pro Community,<br></br>
                    Colombo, Sri Lanka
                  </address>
                </div>
              </div>

              <div className="col-md-4">
                <div className="contact-phone">
                  <i className="bi bi-phone"></i>
                  <h3>Phone Number</h3>
                  <p>
                    <a
                      href="tel:++94 77 772 4539"
                      style={{ textDecoration: "none" }}
                    >
                      +94 77 772 4539<br></br>Pathum Udana
                    </a>
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="contact-email">
                  <i className="bi bi-envelope"></i>
                  <h3>Email</h3>
                  <p>
                    <a
                      href="mailto:info@globalazure.lk"
                      style={{ textDecoration: "none" }}
                    >
                      info@globalazure.lk
                    </a>
                  </p>
                </div>
              </div>
            </div>


          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
