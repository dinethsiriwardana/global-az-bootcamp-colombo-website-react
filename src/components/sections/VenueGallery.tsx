// filepath: /Users/dineth/Dineth/Programming/Web/global-az-bootcamp-colombo-website-react/src/components/sections/VenueGallery.tsx
import React from "react";

const VenueGallery = () => {
  return (
    <section id="venue-gallery">
      <div className="container-fluid" data-aos="fade-up">
        <div className="section-header">
          <h2>Venue Gallery</h2>
          <p>Take a look at our event venue</p>
        </div>

        <div
          className="container-fluid venue-gallery-container"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="row g-0">
            <div className="col-lg-3 col-md-4">
              <div className="venue-gallery">
                <a
                  href="assets/img/venue-gallery/1.jpg"
                  className="glightbox"
                  data-gall="venue-gallery"
                >
                  <img
                    src="assets/img/venue-gallery/1.jpg"
                    alt=""
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>

            <div className="col-lg-3 col-md-4">
              <div className="venue-gallery">
                <a
                  href="assets/img/venue-gallery/2.jpg"
                  className="glightbox"
                  data-gall="venue-gallery"
                >
                  <img
                    src="assets/img/venue-gallery/2.jpg"
                    alt=""
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>

            <div className="col-lg-3 col-md-4">
              <div className="venue-gallery">
                <a
                  href="assets/img/venue-gallery/3.jpg"
                  className="glightbox"
                  data-gall="venue-gallery"
                >
                  <img
                    src="assets/img/venue-gallery/3.jpg"
                    alt=""
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>

            <div className="col-lg-3 col-md-4">
              <div className="venue-gallery">
                <a
                  href="assets/img/venue-gallery/4.jpg"
                  className="glightbox"
                  data-gall="venue-gallery"
                >
                  <img
                    src="assets/img/venue-gallery/4.jpg"
                    alt=""
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueGallery;
