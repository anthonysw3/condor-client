// imageUrlBuilder.js
import imageUrlBuilder from "@sanity/image-url";
import client from "./sanityClient"; // Make sure this path is correct

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}
