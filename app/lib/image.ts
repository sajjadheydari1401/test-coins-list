export function getImageSrc(image?: string): string {
  if (
    image &&
    (image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("/"))
  ) {
    return image;
  }
  return "/placeholder.png";
}
