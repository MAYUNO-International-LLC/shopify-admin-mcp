import { getAccessToken, getShopDomain } from "../auth/shopify-auth.js";

const API_VERSION = "2026-01";

export interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: Record<string, unknown>;
  }>;
  extensions?: {
    cost?: {
      requestedQueryCost: number;
      actualQueryCost: number;
      throttleStatus: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      };
    };
  };
}

export interface GraphQLVariables {
  [key: string]: unknown;
}

export async function executeGraphQL<T = unknown>(
  query: string,
  variables?: GraphQLVariables
): Promise<GraphQLResponse<T>> {
  const accessToken = await getAccessToken();
  const shop = getShopDomain();

  const url = `https://${shop}/admin/api/${API_VERSION}/graphql.json`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `GraphQL request failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors && result.errors.length > 0) {
    const errorMessages = result.errors.map((e) => e.message).join("; ");
    throw new Error(`GraphQL errors: ${errorMessages}`);
  }

  return result;
}


