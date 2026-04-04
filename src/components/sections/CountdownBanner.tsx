import React, { useEffect, useState, useMemo } from "react";
import "./CounterBanner.css";

// Define types for our counter items
interface CounterItem {
  title: string;
  count: number;
  suffix?: string;
}

const CountdownBanner: React.FC = () => {
  // Target date: April 26, 2026
  const targetDate = useMemo(() => new Date(2026, 3, 26), []); // Month is 0-indexed, so 3 = April

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Effect to update the countdown every second
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Define counter data based on time left
  const counters = useMemo<CounterItem[]>(
    () => [
      { title: "Days", count: timeLeft.days },
      { title: "Hours", count: timeLeft.hours },
      { title: "Minutes", count: timeLeft.minutes },
      { title: "Seconds", count: timeLeft.seconds },
    ],
    [timeLeft]
  );

  return (
    <section id="counter-stats" className="counter-banner section-with-bg">
      <div className="container" data-aos="fade-up">
        <div className="section-header">
          <h2>Are you ready ?</h2>
          {/* <p>April 26, 2026</p> */}
        </div>
        <div className="row counter-row justify-content-center">
          {counters.map((counter, index) => (
            <div
              className="col-lg-3 col-md-3 col-6 counter-item text-center"
              key={index}
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className="counter-box">
                <div className="counter-num">
                  <span className="count-number">
                    {counter.count.toString().padStart(2, '0')}
                  </span>
                </div>
                <p className="counter-text">{counter.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountdownBanner;
