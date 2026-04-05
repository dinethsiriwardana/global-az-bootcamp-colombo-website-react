declare module "masonry-layout";
declare module "imagesloaded";

declare module "*.css";

// SCSS modules
declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}
