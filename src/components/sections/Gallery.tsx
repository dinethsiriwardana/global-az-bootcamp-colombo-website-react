import { useEffect, useState } from "react";
import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import styles from "./Gallery.module.scss";
import lgShare from "lightgallery/plugins/share";
import lgHash from "lightgallery/plugins/hash";
import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";

// Image source data
interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80",
    alt: "Beautiful landscape",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1526281216101-e55f00f0db7a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80",

    alt: "Foggy road through forest",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80",
    alt: "Beautiful landscape",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1605973029521-8154da591bd7?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80",

    alt: "Mountain landscape",
  },å
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1526281216101-e55f00f0db7a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80",

    alt: "Foggy road through forest",
  },
];

const Gallery = () => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    // Make sure we only run this after the DOM has been fully loaded
    const initMasonry = () => {
      try {
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
          gutter: 16, // Slightly wider gutter for 4 columns
          transitionDuration: "0.4s", // Smooth transitions when layout changes
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
        }); // Handle any failures with image loading
        imgLoad.on("fail", (instance, img) => {
          if (img && img.img) {
            console.error(`Image failed to load: ${img.img.src}`);
          } else {
            console.error("Image failed to load (image object unavailable)");
          }
          setHasError(true);
        });
      } catch (error) {
        console.error("Error initializing masonry:", error);
        setHasError(true);

        // Retry initialization if we haven't reached max retries
        if (retryCount < MAX_RETRIES) {
          setRetryCount((prevCount) => prevCount + 1);
        }
      }
    };

    // Wait a short time to ensure all DOM elements are ready
    const timer = setTimeout(() => {
      initMasonry();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [retryCount]); // Re-run when retryCount changes

  // Complete the retry mechanism implementation
  useEffect(() => {
    if (hasError && retryCount > 0 && retryCount <= MAX_RETRIES) {
      console.log(
        `Retrying masonry initialization (${retryCount}/${MAX_RETRIES})...`
      );

      const retryTimer = setTimeout(() => {
        // Exponential backoff: longer wait times between retries
        // 500ms, 1000ms, 2000ms
        const initMasonryWithDelay = () => {
          try {
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
              gutter: 16, // Slightly wider gutter for 4 columns
              transitionDuration: "0.4s", // Smooth transitions when layout changes
            });

            // Trigger initial layout
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
  };

  return (
    <div className={styles.masonryGalleryWrapper}>
      {hasError && retryCount >= MAX_RETRIES && (
        <div className={styles.galleryError}>
          <p>
            There was an error loading the gallery. Please try refreshing the
            page.
          </p>
        </div>
      )}

      <LightGallery
        elementClassNames={styles.masonryGalleryDemo}
        plugins={[lgZoom, lgShare, lgHash]}
        speed={500}
      >
        <div className="grid-sizer"></div>

        {galleryImages.map((image) => (
          <a
            key={image.id}
            // data-lg-size={`${image.width}-${image.height}`}
            className="gallery-item"
            data-src={image.src}
          >
            <img
              alt={image.alt}
              className="img-responsive"
              src={image.src}
              onError={() => handleImageError(image.id)}
            />
          </a>
        ))}
      </LightGallery>
    </div>
  );
};

export default Gallery;
