import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";

// Import speaker data
import { globalAzureSessions, AzureSession } from "../../data/globalAzureSessions";



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

const MAX_HOME_SPEAKERS = 5;

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
      setSpeakers(processedSpeakers.slice(0, MAX_HOME_SPEAKERS));
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
        centeredSlides={false}
        loop={false}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        slidesPerView={1}
        spaceBetween={20}
        breakpoints={{
          576: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          992: { slidesPerView: 5, spaceBetween: 20 },
        }}
        modules={[Autoplay]}
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
      </Swiper>
    </section>
  );
};

export default Speakers;
