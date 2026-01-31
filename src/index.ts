#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { productTools } from "./tools/products.js";
import { orderTools } from "./tools/orders.js";
import { customerTools } from "./tools/customers.js";
import { marketingTools } from "./tools/marketing.js";
import { discountTools } from "./tools/discounts.js";
import { collectionTools } from "./tools/collections.js";
import { inventoryTools } from "./tools/inventory.js";
import { shopTools } from "./tools/shop.js";
import { analyticsTools } from "./tools/analytics.js";

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: z.ZodTypeAny;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (args: any) => Promise<unknown>;
}

const allTools: ToolDefinition[] = [
  ...(productTools as ToolDefinition[]),
  ...(orderTools as ToolDefinition[]),
  ...(customerTools as ToolDefinition[]),
  ...(marketingTools as ToolDefinition[]),
  ...(discountTools as ToolDefinition[]),
  ...(collectionTools as ToolDefinition[]),
  ...(inventoryTools as ToolDefinition[]),
  ...(shopTools as ToolDefinition[]),
  ...(analyticsTools as ToolDefinition[]),
];

const server = new McpServer({
  name: "shopify-admin-mcp",
  version: "1.0.0",
});

for (const tool of allTools) {
  const shape =
    tool.inputSchema instanceof z.ZodObject
      ? (tool.inputSchema as z.ZodObject<z.ZodRawShape>).shape
      : {};

  server.tool(tool.name, tool.description, shape, async (args) => {
    try {
      const validatedArgs = tool.inputSchema.parse(args);
      const result = await tool.handler(validatedArgs);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  });
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Shopify Admin MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
