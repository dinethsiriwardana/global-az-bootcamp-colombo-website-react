import React, { useState, useEffect } from "react";

interface Speaker {
  id: string;
  name: string;
}

interface ScheduleItem {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  speakers: Speaker[];
  room: string;
}

interface Track {
  id: number;
  name: string;
  sessions: ScheduleItem[];
}

// Interface for the Sessionize API response
interface SessionizeData {
  date: string;
  rooms: {
    id: number;
    name: string;
    sessions: ScheduleItem[];
  }[];
}

const Schedule = () => {
  const [activeTrack, setActiveTrack] = useState<number>(0);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [frozen, setFrozen] = useState<boolean>(false);
  const [frozenUntil, setFrozenUntil] = useState<number | null>(null);

  // Format time from "2025-05-10T10:00:00" to "10:00 AM"
  const formatTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format time range from start and end times
  const formatTimeRange = (startTime: string, endTime: string): string => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  // Fetch data from Sessionize API
  useEffect(() => {
    const fetchScheduleData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://sessionize.com/api/v2/xpphdlfo/view/GridSmart"
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`
          );
        }

        const data: SessionizeData[] = await response.json();

        if (data && data.length > 0) {
          // Transform the Sessionize data into our Track format
          const trackData = data[0].rooms.map((room) => ({
            id: room.id,
            name: room.name,
            sessions: room.sessions,
          }));

          setTracks(trackData);
        } else {
          setError("No schedule data available");
        }
      } catch (err) {
        console.error("Error fetching schedule data:", err);
        setError("Failed to load schedule data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, []);

  // Handler for track click
  const handleTrackClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTrack(index);

    // Freeze for 1 minute (60000 milliseconds)
    setFrozen(true);
    setFrozenUntil(Date.now() + 60000);
  };

  // Check if freeze time has expired
  useEffect(() => {
    if (!frozen || !frozenUntil) return;

    const checkFrozenTimeout = setTimeout(() => {
      if (Date.now() >= frozenUntil) {
        setFrozen(false);
        setFrozenUntil(null);
      }
    }, 1000); // Check every second

    return () => clearTimeout(checkFrozenTimeout);
  }, [frozen, frozenUntil]);

  // Auto-rotate through tracks when not frozen
  useEffect(() => {
    if (frozen || tracks.length <= 1) return;

    const interval = setInterval(() => {
      setActiveTrack((current) => (current + 1) % tracks.length);
    }, 5000); // Rotate every 10 seconds

    return () => clearInterval(interval);
  }, [frozen, tracks.length]);

  // Group sessions by time slot for the active track
  const getSessionsByTime = () => {
    if (!tracks || tracks.length === 0 || !tracks[activeTrack]) {
      return [];
    }

    const sortedSessions = [...tracks[activeTrack].sessions].sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    );
    return sortedSessions;
  };

  if (loading) {
    return (
      <section id="schedule" className="section-with-bg">
        <div className="container" data-aos="fade-up">
          <div className="section-header">
            <h2>Event Schedule</h2>
            <p>Loading schedule data...</p>
          </div>
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="schedule" className="section-with-bg">
        <div className="container" data-aos="fade-up">
          <div className="section-header">
            <h2>Event Schedule</h2>
            <p>There was an error loading the schedule: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!tracks || tracks.length === 0) {
    return (
      <section id="schedule" className="section-with-bg">
        <div className="container" data-aos="fade-up">
          <div className="section-header">
            <h2>Event Schedule</h2>
            <p>
              No schedule data is currently available. Please check back later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="schedule" className="section-with-bg">
      <div className="container" data-aos="fade-up">
        <div className="section-header">
          <h2>Event Schedule</h2>
          <p>Here is our event schedule for May 10, 2025</p>
        </div>

        <ul className="nav nav-tabs" role="tablist">
          {tracks.map((track, index) => (
            <li className="nav-item" key={index}>
              <a
                className={`nav-link ${index === activeTrack ? "active" : ""} ${
                  frozen && index === activeTrack ? "frozen" : ""
                }`}
                href={`#track-${track.id}`}
                role="tab"
                onClick={(e) => handleTrackClick(index, e)}
              >
                <div className="track-name">{track.name}</div>
              </a>
            </li>
          ))}
        </ul>

        <div className="tab-content row justify-content-center align-items-center">
          <div className="col-lg-8 tab-pane active show" role="tabpanel">
            {getSessionsByTime().map((session, index) => (
              <div
                className="row schedule-item align-items-center justify-content-start"
                key={index}
              >
                <div className="col-md-3">
                  <time>
                    {formatTimeRange(session.startsAt, session.endsAt)}
                  </time>
                </div>
                <div className="col-md-9">
                  {session.speakers.map((speaker, idx) => (
                    <h4 key={idx}>{speaker.name}</h4>
                  ))}
                  <p>{session.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;
