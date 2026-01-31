import { z } from "zod";
import { executeGraphQL } from "../graphql/client.js";
import {
  GET_ORDERS,
  GET_ORDER,
  GET_ORDERS_COUNT,
  GET_ABANDONED_CHECKOUTS,
  GET_ABANDONED_CHECKOUTS_COUNT,
} from "../graphql/queries.js";

// Schemas
export const GetOrdersSchema = z.object({
  first: z.number().min(1).max(250).default(50).optional(),
  after: z.string().optional(),
  query: z
    .string()
    .optional()
    .describe(
      "Search query to filter orders (e.g., 'financial_status:paid', 'fulfillment_status:unfulfilled')"
    ),
});

export const GetOrderSchema = z.object({
  id: z.string().describe("The order ID (gid://shopify/Order/...)"),
});

export const GetOrdersCountSchema = z.object({
  query: z.string().optional().describe("Search query to filter orders"),
});

export const GetAbandonedCheckoutsSchema = z.object({
  first: z.number().min(1).max(250).default(50).optional(),
  after: z.string().optional(),
  query: z.string().optional().describe("Search query to filter abandoned checkouts"),
});

export const GetAbandonedCheckoutsCountSchema = z.object({
  query: z.string().optional().describe("Search query to filter abandoned checkouts"),
});

// Tool implementations
export async function getOrders(
  args: z.infer<typeof GetOrdersSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_ORDERS, {
    first: args.first ?? 50,
    after: args.after,
    query: args.query,
  });

  return result.data;
}

export async function getOrder(
  args: z.infer<typeof GetOrderSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_ORDER, {
    id: args.id,
  });

  return result.data;
}

export async function getOrdersCount(
  args: z.infer<typeof GetOrdersCountSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_ORDERS_COUNT, {
    query: args.query,
  });

  return result.data;
}

export async function getAbandonedCheckouts(
  args: z.infer<typeof GetAbandonedCheckoutsSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_ABANDONED_CHECKOUTS, {
    first: args.first ?? 50,
    after: args.after,
    query: args.query,
  });

  return result.data;
}

export async function getAbandonedCheckoutsCount(
  args: z.infer<typeof GetAbandonedCheckoutsCountSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_ABANDONED_CHECKOUTS_COUNT, {
    query: args.query,
  });

  return result.data;
}

// Tool definitions for MCP
export const orderTools = [
  {
    name: "get_orders",
    description:
      "List orders with optional filtering and pagination. Returns order details including status, totals, line items, customer info, and shipping address.",
    inputSchema: GetOrdersSchema,
    handler: getOrders,
  },
  {
    name: "get_order",
    description:
      "Get detailed information about a single order by its ID, including all line items, addresses, fulfillments, and discounts.",
    inputSchema: GetOrderSchema,
    handler: getOrder,
  },
  {
    name: "get_orders_count",
    description: "Count the total number of orders, optionally filtered by a query.",
    inputSchema: GetOrdersCountSchema,
    handler: getOrdersCount,
  },
  {
    name: "get_abandoned_checkouts",
    description:
      "List abandoned checkouts with optional filtering. Returns checkout details including items, customer, and recovery URL.",
    inputSchema: GetAbandonedCheckoutsSchema,
    handler: getAbandonedCheckouts,
  },
  {
    name: "get_abandoned_checkouts_count",
    description: "Count the total number of abandoned checkouts.",
    inputSchema: GetAbandonedCheckoutsCountSchema,
    handler: getAbandonedCheckoutsCount,
  },
];
