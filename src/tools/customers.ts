import { z } from "zod";
import { executeGraphQL } from "../graphql/client.js";
import {
  GET_CUSTOMERS,
  GET_CUSTOMER,
  GET_CUSTOMERS_COUNT,
  GET_SEGMENTS,
  GET_SEGMENT,
  GET_SEGMENT_MEMBERS,
} from "../graphql/queries.js";

export const GetCustomersSchema = z.object({
  first: z.number().min(1).max(250).default(50).optional(),
  after: z.string().optional(),
  query: z
    .string()
    .optional()
    .describe("Search query to filter customers (e.g., 'email:*@example.com', 'orders_count:>5')"),
});

export const GetCustomerSchema = z.object({
  id: z.string().describe("The customer ID (gid://shopify/Customer/...)"),
});

export const GetCustomersCountSchema = z.object({
  query: z.string().optional().describe("Search query to filter customers"),
});

export const GetSegmentsSchema = z.object({
  first: z.number().min(1).max(250).default(50).optional(),
  after: z.string().optional(),
});

export const GetSegmentSchema = z.object({
  id: z.string().describe("The segment ID (gid://shopify/Segment/...)"),
});

export const GetSegmentMembersSchema = z.object({
  segmentId: z.string().describe("The segment ID"),
  first: z.number().min(1).max(250).default(50).optional(),
  after: z.string().optional(),
});

export async function getCustomers(args: z.infer<typeof GetCustomersSchema>): Promise<unknown> {
  const result = await executeGraphQL(GET_CUSTOMERS, {
    first: args.first ?? 50,
    after: args.after,
    query: args.query,
  });

  return result.data;
}

export async function getCustomer(args: z.infer<typeof GetCustomerSchema>): Promise<unknown> {
  const result = await executeGraphQL(GET_CUSTOMER, {
    id: args.id,
  });

  return result.data;
}

export async function getCustomersCount(
  args: z.infer<typeof GetCustomersCountSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_CUSTOMERS_COUNT, {
    query: args.query,
  });

  return result.data;
}

export async function getSegments(args: z.infer<typeof GetSegmentsSchema>): Promise<unknown> {
  const result = await executeGraphQL(GET_SEGMENTS, {
    first: args.first ?? 50,
    after: args.after,
  });

  return result.data;
}

export async function getSegment(args: z.infer<typeof GetSegmentSchema>): Promise<unknown> {
  const result = await executeGraphQL(GET_SEGMENT, {
    id: args.id,
  });

  return result.data;
}

export async function getSegmentMembers(
  args: z.infer<typeof GetSegmentMembersSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_SEGMENT_MEMBERS, {
    segmentId: args.segmentId,
    first: args.first ?? 50,
    after: args.after,
  });

  return result.data;
}

export const customerTools = [
  {
    name: "get_customers",
    description:
      "List customers with optional filtering and pagination. Returns customer details including email, orders count, amount spent, and address.",
    inputSchema: GetCustomersSchema,
    handler: getCustomers,
  },
  {
    name: "get_customer",
    description:
      "Get detailed information about a single customer by their ID, including addresses and recent orders.",
    inputSchema: GetCustomerSchema,
    handler: getCustomer,
  },
  {
    name: "get_customers_count",
    description: "Count the total number of customers, optionally filtered by a query.",
    inputSchema: GetCustomersCountSchema,
    handler: getCustomersCount,
  },
  {
    name: "get_segments",
    description: "List all customer segments defined in the store.",
    inputSchema: GetSegmentsSchema,
    handler: getSegments,
  },
  {
    name: "get_segment",
    description: "Get details about a specific customer segment, including its query definition.",
    inputSchema: GetSegmentSchema,
    handler: getSegment,
  },
  {
    name: "get_segment_members",
    description: "Get the customers who belong to a specific segment.",
    inputSchema: GetSegmentMembersSchema,
    handler: getSegmentMembers,
  },
];
