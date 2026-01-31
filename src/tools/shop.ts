import { z } from "zod";
import { executeGraphQL } from "../graphql/client.js";
import { GET_SHOP, GET_SHOP_LOCALES, RUN_SHOPIFYQL } from "../graphql/queries.js";

// Schemas
export const GetShopSchema = z.object({});

export const GetShopLocalesSchema = z.object({});

export const RunShopifyQLSchema = z.object({
  query: z
    .string()
    .describe(
      "ShopifyQL query string (e.g., 'FROM orders SHOW sum(total_sales) SINCE -30d UNTIL today')"
    ),
});

// Tool implementations
export async function getShop(
  args: z.infer<typeof GetShopSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_SHOP);

  return result.data;
}

export async function getShopLocales(
  args: z.infer<typeof GetShopLocalesSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_SHOP_LOCALES);

  return result.data;
}

export async function runShopifyQL(
  args: z.infer<typeof RunShopifyQLSchema>
): Promise<unknown> {
  const result = await executeGraphQL(RUN_SHOPIFYQL, {
    query: args.query,
  });

  return result.data;
}

// Tool definitions for MCP
export const shopTools = [
  {
    name: "get_shop",
    description:
      "Get information about the shop including name, domain, plan, currency, timezone, and billing address.",
    inputSchema: GetShopSchema,
    handler: getShop,
  },
  {
    name: "get_shop_locales",
    description: "Get all locales configured for the shop, including primary and published languages.",
    inputSchema: GetShopLocalesSchema,
    handler: getShopLocales,
  },
  {
    name: "run_shopifyql",
    description:
      "Run a ShopifyQL analytics query. ShopifyQL allows querying sales, orders, and other analytics data. Example: 'FROM orders SHOW sum(total_sales) SINCE -30d UNTIL today'",
    inputSchema: RunShopifyQLSchema,
    handler: runShopifyQL,
  },
];
