import React, { useState } from "react";
import { Link } from "react-router-dom";
import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import lgShare from "lightgallery/plugins/share";
import lgHash from "lightgallery/plugins/hash";
import styles from "../components/sections/Gallery.module.scss";
import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";
import { useEffect } from "react";

// Image source data
interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  thumbnail?: string;
}

/**
 * Function to load all gallery images from a folder
 * @param folderPath Path relative to the public folder
 * @param fileExtension File extension of images to include
 * @param totalImages Total number of images in the folder
 * @returns Array of GalleryImage objects
 */
const loadAllGalleryImages = (
  folderPath: string = "/assets/img/fullgallery/fullgallery",
  fileExtension: string = "jpg",
  totalImages: number = 407 // Set a large number as default or update based on actual count
): GalleryImage[] => {
  // Generate array of image objects
  return Array.from({ length: totalImages }, (_, i) => {
    const imageNumber = i + 1;
    const imagePath = `${folderPath}${imageNumber}.${fileExtension}`;

    return {
      id: imageNumber,
      src: imagePath,
      alt: `Azure Bootcamp Colombo Gallery Image ${imageNumber}`,
    };
  });
};

const FullGalleryPage: React.FC = () => {
  const allGalleryImages = loadAllGalleryImages();
  const imagesPerPage = 15;
  const [visibleImages, setVisibleImages] = useState<GalleryImage[]>(
    allGalleryImages.slice(0, imagesPerPage)
  );
  const [hasMoreImages, setHasMoreImages] = useState(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const MAX_RETRIES = 3;

  // Function to load more images
  const loadMoreImages = () => {
    const currentLength = visibleImages.length;
    const newImages = allGalleryImages.slice(
      currentLength,
      currentLength + imagesPerPage
    );

    if (newImages.length > 0) {
      setVisibleImages([...visibleImages, ...newImages]);
      // Check if we've loaded all images
      if (currentLength + newImages.length >= allGalleryImages.length) {
        setHasMoreImages(false);
      }
    } else {
      setHasMoreImages(false);
    }
  };

  useEffect(() => {
    // Initialize masonry layout
    const initMasonry = () => {
      try {
        // Show loading state
        setLoading(true);

        // Ensure the DOM element exists
        const container = document.querySelector(
          `.${styles.masonryGalleryDemo}`
        );
        if (!container) {
          throw new Error("Gallery container not found");
        }

        // Initialize Masonry with proper options
        const msnry = new Masonry(container, {
          itemSelector: ".gallery-item",
          columnWidth: ".grid-sizer",
          percentPosition: true,
          gutter: 16,
          transitionDuration: "0.4s",
        });

        // Trigger an initial layout
        msnry.layout();

        // Use imagesLoaded to handle layout after images are fully loaded
        const imgLoad = imagesLoaded(container);

        // Reposition items when each image loads
        imgLoad.on("progress", () => {
          // Layout Masonry after each image loads
          msnry.layout();
        });

        // Final layout after all images have loaded
        imgLoad.on("done", () => {
          msnry.layout();
          // Reset error state on success
          setHasError(false);
          // Hide loading state
          setLoading(false);
        });

        // Handle any failures with image loading
        imgLoad.on("fail", (instance, img) => {
          if (img && img.img) {
            console.error(`Failed to load image: ${img.img.src}`);
          } else {
            console.error("Failed to load an image");
          }
        });
      } catch (error) {
        console.error("Failed to initialize Masonry:", error);
        setHasError(true);
        setLoading(false);

        if (retryCount < MAX_RETRIES) {
          setRetryCount((prev) => prev + 1);
        }
      }
    };

    // Run after a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initMasonry();
    }, 300);

    return () => clearTimeout(timer);
  }, [visibleImages, retryCount]); // Re-init masonry when visible images change

  // Handle retry mechanism
  useEffect(() => {
    if (hasError && retryCount > 0 && retryCount <= MAX_RETRIES) {
      console.log(
        `Retrying masonry initialization (${retryCount}/${MAX_RETRIES})...`
      );

      const retryTimer = setTimeout(() => {
        // Exponential backoff
        const initMasonryWithDelay = () => {
          try {
            const container = document.querySelector(
              `.${styles.masonryGalleryDemo}`
            );
            if (!container) {
              throw new Error("Gallery container not found");
            }

            const msnry = new Masonry(container, {
              itemSelector: ".gallery-item",
              columnWidth: ".grid-sizer",
              percentPosition: true,
              gutter: 16,
              transitionDuration: "0.4s",
            });

            msnry.layout();
            console.log("Masonry retry successful");
            setHasError(false);
          } catch (error) {
            console.error("Error during retry:", error);
            if (retryCount >= MAX_RETRIES) {
              console.error("Max retries reached, giving up.");
            }
          }
        };

        initMasonryWithDelay();
      }, 500 * Math.pow(2, retryCount - 1));

      return () => clearTimeout(retryTimer);
    }
  }, [hasError, retryCount]);

  // Handle image loading errors
  const handleImageError = (imageId: number) => {
    console.error(`Failed to load image with ID: ${imageId}`);
    setHasError(true);

    // Increment retry count if we haven't exceeded max retries
    if (retryCount < MAX_RETRIES) {
      setRetryCount((prevCount) => prevCount + 1);
    }

    // Remove the failed image from the visible images
    setVisibleImages(visibleImages.filter((img) => img.id !== imageId));
  };

  return (
    <div className="full-gallery-page">
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-12">
            <br></br>
            {/* <h2 className="text-center mb-4">Full Photo Gallery</h2> */}
            <p className="text-center"></p>
          </div>
        </div>

        {/* <div className={styles.masonryGalleryWrapper}>
          {loading && (
            <div className={styles.galleryLoading}>
              <p>Loading gallery...</p>
            </div>
          )}

          {hasError && retryCount >= MAX_RETRIES && (
            <div className={styles.galleryError}>
              <p>
                There was an error loading the gallery. Please try refreshing
                the page.
              </p>
            </div>
          )}

          <LightGallery
            elementClassNames={styles.masonryGalleryDemo}
            plugins={[lgZoom, lgShare, lgHash]}
            speed={500}
            mode="lg-fade"
            selector=".gallery-item"
            licenseKey="0000-0000-000-0000"
            download={true}
            counter={true}
            mobileSettings={{
              controls: true,
              showCloseIcon: true,
              download: false,
            }}
          >
            <div className="grid-sizer"></div>

            {visibleImages.map((image) => (
              <a
                key={image.id}
                href={image.src}
                className="gallery-item"
                data-src={image.src}
                data-sub-html={`<h4>${image.alt}</h4>`}
              >
                <img
                  alt={image.alt}
                  className="img-responsive"
                  src={image.src}
                  loading="lazy"
                  onError={() => handleImageError(image.id)}
                />
              </a>
            ))}
          </LightGallery>

          {hasMoreImages && (
            <div className="text-center mt-4 mb-5">
              <button
                onClick={loadMoreImages}
                className="btn btn-primary btn-lg"
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
                Load More Images
              </button>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default FullGalleryPage;
