import React from "react";
import VenueGallery from "./VenueGallery";
import Gallery from "./Gallery";

const Venue = () => {
  return (
    <section id="gallery">
      <div className="container-fluid" data-aos="fade-up">
        <div className="section-header">
          <h2>Gallery</h2>
          <p>A Glimpse into What We've Been Up To</p>
        </div>

        <Gallery />
      </div>
    </section>
  );
};

export default Venue;
