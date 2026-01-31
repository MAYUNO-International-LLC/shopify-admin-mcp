import { z } from "zod";
import { executeGraphQL } from "../graphql/client.js";
import { RUN_SHOPIFYQL } from "../graphql/queries.js";

const PeriodEnum = z.enum(["day", "week", "month"]).default("day");

const BaseAnalyticsSchema = z.object({
  since: z
    .string()
    .default("-30d")
    .describe('Start of time range (e.g., "-30d", "-3m", "last_month", "last_quarter")'),
  until: z
    .string()
    .default("today")
    .describe('End of time range (e.g., "today", "-1d", "yesterday")'),
});

export const GetSalesOverTimeSchema = BaseAnalyticsSchema.extend({
  period: PeriodEnum.describe("Time period for grouping (day, week, or month)"),
});

export const GetSalesByProductSchema = BaseAnalyticsSchema.extend({
  limit: z.number().min(1).max(100).default(10).describe("Maximum number of products to return"),
});

export const GetSalesByRegionSchema = BaseAnalyticsSchema.extend({
  limit: z.number().min(1).max(100).default(50).describe("Maximum number of regions to return"),
});

export const GetSalesByTrafficSourceSchema = BaseAnalyticsSchema.extend({
  limit: z
    .number()
    .min(1)
    .max(100)
    .default(20)
    .describe("Maximum number of traffic sources to return"),
});

export const GetSessionsOverTimeSchema = BaseAnalyticsSchema.extend({
  period: PeriodEnum.describe("Time period for grouping (day, week, or month)"),
});

export const GetConversionRateSchema = BaseAnalyticsSchema.extend({
  period: PeriodEnum.describe("Time period for grouping (day, week, or month)"),
});

export const GetAverageOrderValueSchema = BaseAnalyticsSchema.extend({
  period: PeriodEnum.describe("Time period for grouping (day, week, or month)"),
});

export const GetTopCustomersSchema = BaseAnalyticsSchema.extend({
  limit: z.number().min(1).max(100).default(10).describe("Maximum number of customers to return"),
});

export const GetConversionsByChannelSchema = BaseAnalyticsSchema.extend({
  limit: z.number().min(1).max(100).default(20).describe("Maximum number of channels to return"),
});

export const GetCampaignPerformanceSchema = BaseAnalyticsSchema.extend({
  limit: z.number().min(1).max(100).default(20).describe("Maximum number of campaigns to return"),
});

export const GetCampaignPerformanceOverTimeSchema = BaseAnalyticsSchema.extend({
  period: PeriodEnum.describe("Time period for grouping (day, week, or month)"),
  limit: z
    .number()
    .min(1)
    .max(20)
    .default(5)
    .describe("Maximum number of top campaigns to include"),
});

async function runShopifyQLQuery(query: string): Promise<unknown> {
  const result = await executeGraphQL(RUN_SHOPIFYQL, { query });
  return result.data;
}

export async function getSalesOverTime(
  args: z.infer<typeof GetSalesOverTimeSchema>
): Promise<unknown> {
  const query = `FROM sales SHOW total_sales, orders GROUP BY ${args.period} SINCE ${args.since} UNTIL ${args.until} ORDER BY ${args.period}`;
  return runShopifyQLQuery(query);
}

export async function getSalesByProduct(
  args: z.infer<typeof GetSalesByProductSchema>
): Promise<unknown> {
  const query = `FROM sales SHOW total_sales, orders, product_title GROUP BY product_title SINCE ${args.since} UNTIL ${args.until} ORDER BY total_sales DESC LIMIT ${args.limit}`;
  return runShopifyQLQuery(query);
}

export async function getSalesByRegion(
  args: z.infer<typeof GetSalesByRegionSchema>
): Promise<unknown> {
  const query = `FROM sales SHOW total_sales, orders, billing_country GROUP BY billing_country SINCE ${args.since} UNTIL ${args.until} ORDER BY total_sales DESC LIMIT ${args.limit}`;
  return runShopifyQLQuery(query);
}

export async function getSalesByTrafficSource(
  args: z.infer<typeof GetSalesByTrafficSourceSchema>
): Promise<unknown> {
  const query = `FROM sales, sessions SHOW total_sales, orders, referrer_source GROUP BY referrer_source SINCE ${args.since} UNTIL ${args.until} ORDER BY total_sales DESC LIMIT ${args.limit}`;
  return runShopifyQLQuery(query);
}

export async function getSessionsOverTime(
  args: z.infer<typeof GetSessionsOverTimeSchema>
): Promise<unknown> {
  const query = `FROM sessions SHOW sessions, visitors GROUP BY ${args.period} SINCE ${args.since} UNTIL ${args.until} ORDER BY ${args.period}`;
  return runShopifyQLQuery(query);
}

export async function getConversionRate(
  args: z.infer<typeof GetConversionRateSchema>
): Promise<unknown> {
  const query = `FROM sales, sessions SHOW total_sales, orders, sessions, orders/sessions AS conversion_rate GROUP BY ${args.period} SINCE ${args.since} UNTIL ${args.until}`;
  return runShopifyQLQuery(query);
}

export async function getAverageOrderValue(
  args: z.infer<typeof GetAverageOrderValueSchema>
): Promise<unknown> {
  const query = `FROM sales SHOW total_sales, orders, total_sales/orders AS average_order_value GROUP BY ${args.period} SINCE ${args.since} UNTIL ${args.until} ORDER BY ${args.period}`;
  return runShopifyQLQuery(query);
}

export async function getTopCustomers(
  args: z.infer<typeof GetTopCustomersSchema>
): Promise<unknown> {
  const query = `FROM sales SHOW total_sales, orders, customer_email GROUP BY customer_email SINCE ${args.since} UNTIL ${args.until} ORDER BY total_sales DESC LIMIT ${args.limit}`;
  return runShopifyQLQuery(query);
}

export async function getConversionsByChannel(
  args: z.infer<typeof GetConversionsByChannelSchema>
): Promise<unknown> {
  const query = `FROM sales, sessions SHOW total_sales, orders, sessions, orders/sessions AS conversion_rate GROUP BY referrer_source SINCE ${args.since} UNTIL ${args.until} ORDER BY orders DESC LIMIT ${args.limit}`;
  return runShopifyQLQuery(query);
}

export async function getCampaignPerformance(
  args: z.infer<typeof GetCampaignPerformanceSchema>
): Promise<unknown> {
  const query = `FROM sales, sessions SHOW total_sales, orders, sessions, orders/sessions AS conversion_rate, referrer_name GROUP BY referrer_name SINCE ${args.since} UNTIL ${args.until} ORDER BY total_sales DESC LIMIT ${args.limit}`;
  return runShopifyQLQuery(query);
}

export async function getCampaignPerformanceOverTime(
  args: z.infer<typeof GetCampaignPerformanceOverTimeSchema>
): Promise<unknown> {
  const query = `FROM sales, sessions SHOW total_sales, orders, sessions, referrer_name GROUP BY ${args.period}, TOP ${args.limit} referrer_name SINCE ${args.since} UNTIL ${args.until} ORDER BY ${args.period}`;
  return runShopifyQLQuery(query);
}

export const analyticsTools = [
  {
    name: "get_sales_over_time",
    description:
      "Get sales trends over time, grouped by day, week, or month. Returns total sales and order count for each period.",
    inputSchema: GetSalesOverTimeSchema,
    handler: getSalesOverTime,
  },
  {
    name: "get_sales_by_product",
    description:
      "Get top selling products by total sales. Returns product titles with their total sales and order counts.",
    inputSchema: GetSalesByProductSchema,
    handler: getSalesByProduct,
  },
  {
    name: "get_sales_by_region",
    description:
      "Get sales breakdown by country/region. Returns total sales and order counts by billing country.",
    inputSchema: GetSalesByRegionSchema,
    handler: getSalesByRegion,
  },
  {
    name: "get_sales_by_traffic_source",
    description:
      "Get sales breakdown by traffic source/referrer. Returns total sales and orders grouped by referrer source.",
    inputSchema: GetSalesByTrafficSourceSchema,
    handler: getSalesByTrafficSource,
  },
  {
    name: "get_sessions_over_time",
    description:
      "Get traffic/session trends over time. Returns session and visitor counts grouped by day, week, or month.",
    inputSchema: GetSessionsOverTimeSchema,
    handler: getSessionsOverTime,
  },
  {
    name: "get_conversion_rate",
    description:
      "Get session-to-order conversion rate over time. Returns total sales, orders, sessions, and calculated conversion rate.",
    inputSchema: GetConversionRateSchema,
    handler: getConversionRate,
  },
  {
    name: "get_average_order_value",
    description:
      "Get average order value (AOV) trends over time. Returns total sales, orders, and calculated AOV grouped by period.",
    inputSchema: GetAverageOrderValueSchema,
    handler: getAverageOrderValue,
  },
  {
    name: "get_top_customers",
    description:
      "Get highest spending customers. Returns customer emails with their total sales and order counts.",
    inputSchema: GetTopCustomersSchema,
    handler: getTopCustomers,
  },
  {
    name: "get_conversions_by_channel",
    description:
      "Get conversion rates by marketing channel. Returns total sales, orders, sessions, and conversion rate for each referrer source.",
    inputSchema: GetConversionsByChannelSchema,
    handler: getConversionsByChannel,
  },
  {
    name: "get_campaign_performance",
    description:
      "Get marketing campaign performance. Returns total sales, orders, sessions, and conversion rate for each campaign/referrer name (e.g., 'facebook-ad', 'google-cpc', 'email-newsletter').",
    inputSchema: GetCampaignPerformanceSchema,
    handler: getCampaignPerformance,
  },
  {
    name: "get_campaign_performance_over_time",
    description:
      "Get marketing campaign performance trends over time. Returns sales and orders for top campaigns grouped by time period.",
    inputSchema: GetCampaignPerformanceOverTimeSchema,
    handler: getCampaignPerformanceOverTime,
  },
];
