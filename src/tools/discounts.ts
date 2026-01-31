import { z } from "zod";
import { executeGraphQL } from "../graphql/client.js";
import {
  GET_DISCOUNTS,
  GET_DISCOUNT,
  GET_CODE_DISCOUNTS,
  GET_AUTOMATIC_DISCOUNTS,
  GET_DISCOUNTS_COUNT,
} from "../graphql/queries.js";

export const GetDiscountsSchema = z.object({
  first: z.number().min(1).max(250).default(50).optional(),
  after: z.string().optional(),
  query: z
    .string()
    .optional()
    .describe("Search query to filter discounts (e.g., 'status:active')"),
});

export const GetDiscountSchema = z.object({
  id: z.string().describe("The discount node ID (gid://shopify/DiscountNode/...)"),
});

export const GetCodeDiscountsSchema = z.object({
  first: z.number().min(1).max(250).default(50).optional(),
  after: z.string().optional(),
  query: z.string().optional().describe("Search query to filter code discounts"),
});

export const GetAutomaticDiscountsSchema = z.object({
  first: z.number().min(1).max(250).default(50).optional(),
  after: z.string().optional(),
  query: z.string().optional().describe("Search query to filter automatic discounts"),
});

export const GetDiscountsCountSchema = z.object({
  query: z.string().optional().describe("Search query to filter discounts"),
});

export async function getDiscounts(
  args: z.infer<typeof GetDiscountsSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_DISCOUNTS, {
    first: args.first ?? 50,
    after: args.after,
    query: args.query,
  });

  return result.data;
}

export async function getDiscount(
  args: z.infer<typeof GetDiscountSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_DISCOUNT, {
    id: args.id,
  });

  return result.data;
}

export async function getCodeDiscounts(
  args: z.infer<typeof GetCodeDiscountsSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_CODE_DISCOUNTS, {
    first: args.first ?? 50,
    after: args.after,
    query: args.query,
  });

  return result.data;
}

export async function getAutomaticDiscounts(
  args: z.infer<typeof GetAutomaticDiscountsSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_AUTOMATIC_DISCOUNTS, {
    first: args.first ?? 50,
    after: args.after,
    query: args.query,
  });

  return result.data;
}

export async function getDiscountsCount(
  args: z.infer<typeof GetDiscountsCountSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_DISCOUNTS_COUNT, {
    query: args.query,
  });

  interface DiscountsCountData {
    discountNodes: {
      totalCount: number;
    };
  }

  const data = result.data as DiscountsCountData;

  return { discountsCount: { count: data?.discountNodes?.totalCount ?? 0 } };
}

export const discountTools = [
  {
    name: "get_discounts",
    description:
      "List all discounts (both code and automatic) with optional filtering. Returns discount details including title, status, type, usage, and value.",
    inputSchema: GetDiscountsSchema,
    handler: getDiscounts,
  },
  {
    name: "get_discount",
    description:
      "Get detailed information about a single discount, including codes, value, minimum requirements, and usage.",
    inputSchema: GetDiscountSchema,
    handler: getDiscount,
  },
  {
    name: "get_code_discounts",
    description:
      "List only code-based discounts (requires customer to enter a code at checkout).",
    inputSchema: GetCodeDiscountsSchema,
    handler: getCodeDiscounts,
  },
  {
    name: "get_automatic_discounts",
    description:
      "List only automatic discounts (applied automatically without a code).",
    inputSchema: GetAutomaticDiscountsSchema,
    handler: getAutomaticDiscounts,
  },
  {
    name: "get_discounts_count",
    description: "Count the total number of discounts, optionally filtered by a query.",
    inputSchema: GetDiscountsCountSchema,
    handler: getDiscountsCount,
  },
];
