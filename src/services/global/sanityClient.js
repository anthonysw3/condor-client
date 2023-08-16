import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "6d2pzg6a",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-08-16",
});

export default client;
