import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

interface Link {
  linkType: string;
  url: string;
}

interface Speaker {
  id: string;
  fullName: string;
  profilePicture: string;
  links: Link[];
}

interface Session {
  id: string;
  title: string;
  speakers: string[];
}

const Speakers: React.FC = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = "https://sessionize.com/api/v2/mgdyv9ad/view/All";

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.speakers || !data.sessions) {
          setError("Invalid API response structure.");
          setLoading(false);
          return;
        }

        setSpeakers(data.speakers);
        setSessions(data.sessions);
        setLoading(false);
      } catch (error) {
        setError("Error fetching speaker data: " + error);
        setLoading(false);
      }
    };

    fetchData();
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

          // Find the sessions for this speaker
          const speakerSessions = sessions
            .filter((session) => session.speakers.includes(speaker.id))
            .map((session) => session.title)
            .join(", ");

          return (
            <SwiperSlide key={speaker.id}>
              <div className="speaker" data-aos="fade-up">
                <img
                  src={speaker.profilePicture || "assets/img/speakers/tbd.png"}
                  alt={speaker.fullName}
                  className="img-fluid"
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
                    {speakerSessions || "Session Info Not Available"}
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
        <div className="swiper-pagination"></div>
      </Swiper>
    </section>
  );
};

export default Speakers;
