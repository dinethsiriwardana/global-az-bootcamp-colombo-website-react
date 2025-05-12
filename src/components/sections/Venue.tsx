import React from "react";
import VenueGallery from "./VenueGallery";

const Venue = () => {
  return (
    <section id="venue">
      <div className="container-fluid" data-aos="fade-up">
        <div className="section-header">
          <h2>Event Venue</h2>
          <p>Event venue location info and gallery</p>
        </div>

        <div className="row g-0">
          <div className="col-lg-6 venue-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.753325615764!2d79.857478!3d6.9200653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259401138ca81%3A0xffe8a9f8baaaf085!2sMicrosoft%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1737340672742!5m2!1sen!2slk"
              style={{ border: 0, width: "100%", height: "100%" }}
              allowFullScreen
              loading="lazy"
              title="Google Map of Event Location"
            ></iframe>
          </div>
          <div className="col-lg-6 venue-info">
            <div className="row justify-content-center align-items-center">
              <div className="col-11 col-lg-8 position-relative">
                <h3>Microsoft Sri Lanka</h3>
                <p>
                  We are hosting this event at Microsoft Sri Lanka. Join us for
                  an amazing experience!
                </p>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <br></br>
        <VenueGallery />
      </div>
    </section>
  );
};

export default Venue;
