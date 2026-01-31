import { z } from "zod";
import { executeGraphQL } from "../graphql/client.js";
import {
  GET_INVENTORY_ITEMS,
  GET_INVENTORY_ITEM,
  GET_LOCATIONS,
  GET_LOCATION,
} from "../graphql/queries.js";

export const GetInventoryItemsSchema = z.object({
  first: z.number().min(1).max(250).default(50).optional(),
  after: z.string().optional(),
  query: z.string().optional().describe("Search query to filter inventory items"),
});

export const GetInventoryItemSchema = z.object({
  id: z.string().describe("The inventory item ID (gid://shopify/InventoryItem/...)"),
});

export const GetLocationsSchema = z.object({
  first: z.number().min(1).max(250).default(50).optional(),
  after: z.string().optional(),
});

export const GetLocationSchema = z.object({
  id: z.string().describe("The location ID (gid://shopify/Location/...)"),
});

export async function getInventoryItems(
  args: z.infer<typeof GetInventoryItemsSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_INVENTORY_ITEMS, {
    first: args.first ?? 50,
    after: args.after,
    query: args.query,
  });

  return result.data;
}

export async function getInventoryItem(
  args: z.infer<typeof GetInventoryItemSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_INVENTORY_ITEM, {
    id: args.id,
  });

  return result.data;
}

export async function getLocations(
  args: z.infer<typeof GetLocationsSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_LOCATIONS, {
    first: args.first ?? 50,
    after: args.after,
  });

  return result.data;
}

export async function getLocation(
  args: z.infer<typeof GetLocationSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_LOCATION, {
    id: args.id,
  });

  return result.data;
}

export const inventoryTools = [
  {
    name: "get_inventory_items",
    description:
      "List inventory items with optional filtering. Returns inventory details including SKU, levels at each location, and associated variant.",
    inputSchema: GetInventoryItemsSchema,
    handler: getInventoryItems,
  },
  {
    name: "get_inventory_item",
    description:
      "Get detailed information about a single inventory item, including levels at all locations and cost.",
    inputSchema: GetInventoryItemSchema,
    handler: getInventoryItem,
  },
  {
    name: "get_locations",
    description:
      "List all inventory locations. Returns location details including name, address, and fulfillment settings.",
    inputSchema: GetLocationsSchema,
    handler: getLocations,
  },
  {
    name: "get_location",
    description:
      "Get detailed information about a single location, including inventory levels for all items.",
    inputSchema: GetLocationSchema,
    handler: getLocation,
  },
];
