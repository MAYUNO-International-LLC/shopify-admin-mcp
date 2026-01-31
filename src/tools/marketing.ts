import { z } from "zod";
import { executeGraphQL } from "../graphql/client.js";
import {
  GET_MARKETING_ACTIVITIES,
  GET_MARKETING_ACTIVITY,
  GET_MARKETING_EVENTS,
  GET_MARKETING_EVENT,
} from "../graphql/queries.js";

// Schemas
export const GetMarketingActivitiesSchema = z.object({
  first: z.number().min(1).max(250).default(50).optional(),
  after: z.string().optional(),
});

export const GetMarketingActivitySchema = z.object({
  id: z.string().describe("The marketing activity ID (gid://shopify/MarketingActivity/...)"),
});

export const GetMarketingEventsSchema = z.object({
  first: z.number().min(1).max(250).default(50).optional(),
  after: z.string().optional(),
  query: z.string().optional().describe("Search query to filter marketing events"),
});

export const GetMarketingEventSchema = z.object({
  id: z.string().describe("The marketing event ID (gid://shopify/MarketingEvent/...)"),
});

// Tool implementations
export async function getMarketingActivities(
  args: z.infer<typeof GetMarketingActivitiesSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_MARKETING_ACTIVITIES, {
    first: args.first ?? 50,
    after: args.after,
  });

  return result.data;
}

export async function getMarketingActivity(
  args: z.infer<typeof GetMarketingActivitySchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_MARKETING_ACTIVITY, {
    id: args.id,
  });

  return result.data;
}

export async function getMarketingEvents(
  args: z.infer<typeof GetMarketingEventsSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_MARKETING_EVENTS, {
    first: args.first ?? 50,
    after: args.after,
    query: args.query,
  });

  return result.data;
}

export async function getMarketingEvent(
  args: z.infer<typeof GetMarketingEventSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_MARKETING_EVENT, {
    id: args.id,
  });

  return result.data;
}

// Tool definitions for MCP
export const marketingTools = [
  {
    name: "get_marketing_activities",
    description:
      "List marketing activities with pagination. Returns activity details including title, type, status, budget, and channel.",
    inputSchema: GetMarketingActivitiesSchema,
    handler: getMarketingActivities,
  },
  {
    name: "get_marketing_activity",
    description:
      "Get detailed information about a single marketing activity, including UTM parameters and budget.",
    inputSchema: GetMarketingActivitySchema,
    handler: getMarketingActivity,
  },
  {
    name: "get_marketing_events",
    description:
      "List marketing events with optional filtering. Returns event details including type, channel, timing, and URLs.",
    inputSchema: GetMarketingEventsSchema,
    handler: getMarketingEvents,
  },
  {
    name: "get_marketing_event",
    description:
      "Get detailed information about a single marketing event, including UTM parameters.",
    inputSchema: GetMarketingEventSchema,
    handler: getMarketingEvent,
  },
];
