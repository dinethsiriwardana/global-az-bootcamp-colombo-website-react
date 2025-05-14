import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import styles from "./Gallery.module.scss";
import lgShare from "lightgallery/plugins/share";
import lgHash from "lightgallery/plugins/hash";
import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";
import { Button } from "react-bootstrap";

// Image source data
interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  thumbnail?: string; // Optional thumbnail path
}

/**
 * Function to load gallery images from a folder
 * @param folderPath Path relative to the public folder
 * @param fileExtension File extension of images to include
 * @returns Array of GalleryImage objects
 */
const loadGalleryImages = (
  folderPath: string = "/assets/img/gallery/",
  fileExtension: string = "jpg"
): GalleryImage[] => {
  // For a production app, you might want to fetch this list from an API
  // but for this demo, we'll use the actual file names from the gallery folder

  // Array of actual image filenames in the gallery folder (without extension)
  const imageFileNames = [
    "DSC_2026",
    "DSC_2032",
    "DSC_2038",
    "DSC_2063",
    "DSC_2094",
    "DSC_2118",
    "DSC_2140",
    "DSC_2143",
    "DSC_2161",
    "DSC_2176",
    "DSC_2199",
    "DSC_2223",
    "DSC_2241",
    "DSC_2271",
    "DSC_2309",
    "DSC_2366",
    "DSC_2381",
    "DSC_2407",
    "DSC_2478",
    "DSC_2511",
    "DSC_2542",
    "DSC_2554",
    "DSC_2564",
  ];

  const initialImagesToShow = imageFileNames.length; // Show all images

  // Generate array of image objects using actual filenames
  return imageFileNames
    .map((fileName, index) => {
      const imagePath = `${folderPath}${fileName}.${fileExtension}`;

      return {
        id: index + 1,
        src: imagePath,
        alt: `Azure Bootcamp Colombo Gallery Image ${index + 1}`,
      };
    })
    .slice(0, initialImagesToShow); // Only return the initial set of images
};

// Load gallery images from the specified folder
const galleryImages: GalleryImage[] = loadGalleryImages();

const Gallery = () => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const MAX_RETRIES = 3;

  useEffect(() => {
    // Make sure we only run this after the DOM has been fully loaded
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
          // Do not set error state here, let individual image error handlers handle it
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
  }, [retryCount]);

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
  const handleImageError = (
    imageId: number,
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.error(`Failed to load image with ID: ${imageId}`);

    // Set a fallback image if original fails to load
    const imgElement = e.target as HTMLImageElement;
    imgElement.src = "/assets/img/about-bg.jpg"; // Use a default fallback image that exists in your project

    // We still want to log the error but don't need to trigger a full retry of the gallery
    // as we're handling the fallback at the individual image level
    if (retryCount < MAX_RETRIES) {
      setRetryCount((prevCount) => prevCount + 1);
    }
  };

  return (
    <div className={styles.masonryGalleryWrapper}>
      {loading && (
        <div className={styles.galleryLoading}>
          <p>Loading gallery...</p>
          <div className={styles.loaderSpinner}></div>
        </div>
      )}

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
        mode="lg-fade"
        selector=".gallery-item"
        licenseKey="0000-0000-000-0000" // Add license key if you have one
        download={false} // Disable download button if not needed
        counter={true}
        mobileSettings={{
          controls: true,
          showCloseIcon: true,
          download: false,
        }}
      >
        <div className="grid-sizer"></div>

        {galleryImages.map((image) => (
          <a
            key={image.id}
            href={image.src}
            // data-lg-size={`${image.width}-${image.height}`}
            className="gallery-item"
            data-src={image.src}
            data-sub-html={`<h4>${image.alt}</h4>`}
          >
            <img
              alt={image.alt}
              className="img-responsive"
              src={image.src}
              loading="lazy"
              onError={(e) => handleImageError(image.id, e)}
            />
          </a>
        ))}
      </LightGallery>

      <div className="text-center mt-4 mb-5">
        <Link to="/gallery">
          <Button
            className="about-btn buy-tickets scrollto"
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
            See All Images
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Gallery;
