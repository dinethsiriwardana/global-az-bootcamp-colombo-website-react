import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

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

// Local hard-coded data
const globalAzureSessions: AzureSession[] = [
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

const Speakers: React.FC = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Rearrange the sessions array to move last 4 to the beginning
      const sessionsCount = globalAzureSessions.length;
      const reorderedSessions = [
        ...globalAzureSessions.slice(sessionsCount - 4, sessionsCount),
        ...globalAzureSessions.slice(0, sessionsCount - 4),
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
      setLoading(false);
    } catch (error) {
      setError("Error processing speaker data: " + error);
      setLoading(false);
    }
  }, []);

  // Function to map social media types to Bootstrap icons
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

  if (loading) return <div>Loading speakers...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <section id="speakers">
      <div className="container" data-aos="fade-up">
        <div className="section-header">
          <h2>Event Speakers</h2>
        </div>
      </div>
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
    </section>
  );
};

export default Speakers;
