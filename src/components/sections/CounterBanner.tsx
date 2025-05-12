import React, { useEffect, useState, useMemo } from "react";
import AOS from "aos";
import "./CounterBanner.css";

// Define types for our counter items
interface CounterItem {
  title: string;
  count: number;
  suffix?: string;
}

const CounterBanner: React.FC = () => {
  // Define counter data with useMemo to prevent unnecessary re-renders
  const counters = useMemo<CounterItem[]>(
    () => [
      { title: "Speakers", count: 13 },
      { title: "Participants", count: 220, suffix: "+" },
      { title: "Tracks", count: 3 },
    ],
    []
  );

  // Animation for counting up
  const [animatedCounters, setAnimatedCounters] = useState<number[]>(
    counters.map(() => 0)
  );

  // Effect to animate the counters when the component is in view
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

  return (
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
  );
};

export default CounterBanner;
