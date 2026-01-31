import { z } from "zod";
import { executeGraphQL } from "../graphql/client.js";
import {
  GET_COLLECTIONS,
  GET_COLLECTION,
  GET_COLLECTIONS_COUNT,
} from "../graphql/queries.js";

export const GetCollectionsSchema = z.object({
  first: z.number().min(1).max(250).default(50).optional(),
  after: z.string().optional(),
  query: z.string().optional().describe("Search query to filter collections"),
});

export const GetCollectionSchema = z.object({
  id: z.string().describe("The collection ID (gid://shopify/Collection/...)"),
});

export const GetCollectionsCountSchema = z.object({
  query: z.string().optional().describe("Search query to filter collections"),
});

export async function getCollections(
  args: z.infer<typeof GetCollectionsSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_COLLECTIONS, {
    first: args.first ?? 50,
    after: args.after,
    query: args.query,
  });

  return result.data;
}

export async function getCollection(
  args: z.infer<typeof GetCollectionSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_COLLECTION, {
    id: args.id,
  });

  return result.data;
}

export async function getCollectionsCount(
  args: z.infer<typeof GetCollectionsCountSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_COLLECTIONS_COUNT, {
    query: args.query,
  });

  return result.data;
}

export const collectionTools = [
  {
    name: "get_collections",
    description:
      "List collections with optional filtering and pagination. Returns collection details including title, handle, product count, and image.",
    inputSchema: GetCollectionsSchema,
    handler: getCollections,
  },
  {
    name: "get_collection",
    description:
      "Get detailed information about a single collection, including rules, SEO settings, and products.",
    inputSchema: GetCollectionSchema,
    handler: getCollection,
  },
  {
    name: "get_collections_count",
    description: "Count the total number of collections, optionally filtered by a query.",
    inputSchema: GetCollectionsCountSchema,
    handler: getCollectionsCount,
  },
];
