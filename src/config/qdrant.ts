import { QdrantClient } from "@qdrant/js-client-rest";
import { env } from "./env.js";
import { logger } from "./logger.js";

export const qdrant = new QdrantClient({
  url: env.QDRANT_URL,
  apiKey: env.QDRANT_API_KEY,
});

export async function ensureCollection(name: string, vectorSize: number): Promise<void> {
  const collections = await qdrant.getCollections();
  const exists = collections.collections.some((c) => c.name === name);

  if (!exists) {
    await qdrant.createCollection(name, {
      vectors: { size: vectorSize, distance: "Cosine" },
    });
    logger.info({ event: "qdrant_collection_created", collection: name, vectorSize });
  }
}
