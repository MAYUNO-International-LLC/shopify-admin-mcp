import { z } from "zod";
import { executeGraphQL, extractNodes } from "../graphql/client.js";
import {
  GET_PRODUCTS,
  GET_PRODUCT,
  GET_PRODUCT_VARIANTS,
  GET_PRODUCT_TAGS,
  GET_PRODUCT_TYPES,
  GET_PRODUCT_VENDORS,
  GET_PRODUCTS_COUNT,
} from "../graphql/queries.js";

export const GetProductsSchema = z.object({
  first: z.number().min(1).max(250).default(50).optional(),
  after: z.string().optional(),
  query: z.string().optional().describe("Search query to filter products"),
});

export const GetProductSchema = z.object({
  id: z.string().describe("The product ID (gid://shopify/Product/...)"),
});

export const GetProductVariantsSchema = z.object({
  productId: z.string().describe("The product ID"),
  first: z.number().min(1).max(250).default(50).optional(),
  after: z.string().optional(),
});

export const GetProductTagsSchema = z.object({
  first: z.number().min(1).max(250).default(250).optional(),
  after: z.string().optional().describe("Cursor for pagination"),
});

export const GetProductTypesSchema = z.object({
  first: z.number().min(1).max(250).default(250).optional(),
  after: z.string().optional().describe("Cursor for pagination"),
});

export const GetProductVendorsSchema = z.object({
  first: z.number().min(1).max(250).default(250).optional(),
  after: z.string().optional().describe("Cursor for pagination"),
});

export const GetProductsCountSchema = z.object({
  query: z.string().optional().describe("Search query to filter products"),
});

export async function getProducts(
  args: z.infer<typeof GetProductsSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_PRODUCTS, {
    first: args.first ?? 50,
    after: args.after,
    query: args.query,
  });

  return result.data;
}

export async function getProduct(
  args: z.infer<typeof GetProductSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_PRODUCT, {
    id: args.id,
  });

  return result.data;
}

export async function getProductVariants(
  args: z.infer<typeof GetProductVariantsSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_PRODUCT_VARIANTS, {
    productId: args.productId,
    first: args.first ?? 50,
    after: args.after,
  });

  return result.data;
}

export async function getProductTags(
  args: z.infer<typeof GetProductTagsSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_PRODUCT_TAGS, {
    first: args.first ?? 250,
    after: args.after,
  });

  interface TagsData {
    productTags: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      edges: Array<{ node: string }>;
    };
  }

  const data = result.data as TagsData;
  const tags = data?.productTags?.edges?.map((e) => e.node) ?? [];

  return {
    productTags: tags,
    pageInfo: data?.productTags?.pageInfo,
  };
}

export async function getProductTypes(
  args: z.infer<typeof GetProductTypesSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_PRODUCT_TYPES, {
    first: args.first ?? 250,
    after: args.after,
  });

  interface TypesData {
    productTypes: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      edges: Array<{ node: string }>;
    };
  }

  const data = result.data as TypesData;
  const types = data?.productTypes?.edges?.map((e) => e.node) ?? [];

  return {
    productTypes: types,
    pageInfo: data?.productTypes?.pageInfo,
  };
}

export async function getProductVendors(
  args: z.infer<typeof GetProductVendorsSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_PRODUCT_VENDORS, {
    first: args.first ?? 250,
    after: args.after,
  });

  interface VendorsData {
    productVendors: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      edges: Array<{ node: string }>;
    };
  }

  const data = result.data as VendorsData;
  const vendors = data?.productVendors?.edges?.map((e) => e.node) ?? [];

  return {
    productVendors: vendors,
    pageInfo: data?.productVendors?.pageInfo,
  };
}

export async function getProductsCount(
  args: z.infer<typeof GetProductsCountSchema>
): Promise<unknown> {
  const result = await executeGraphQL(GET_PRODUCTS_COUNT, {
    query: args.query,
  });

  return result.data;
}

export const productTools = [
  {
    name: "get_products",
    description:
      "List products with optional filtering and pagination. Returns product details including title, status, vendor, type, tags, inventory, pricing, and images.",
    inputSchema: GetProductsSchema,
    handler: getProducts,
  },
  {
    name: "get_product",
    description:
      "Get detailed information about a single product by its ID, including all variants, options, images, and SEO settings.",
    inputSchema: GetProductSchema,
    handler: getProduct,
  },
  {
    name: "get_product_variants",
    description:
      "List all variants for a specific product, including pricing, inventory, SKU, and option values.",
    inputSchema: GetProductVariantsSchema,
    handler: getProductVariants,
  },
  {
    name: "get_product_tags",
    description: "Get all product tags used in the store.",
    inputSchema: GetProductTagsSchema,
    handler: getProductTags,
  },
  {
    name: "get_product_types",
    description: "Get all product types used in the store.",
    inputSchema: GetProductTypesSchema,
    handler: getProductTypes,
  },
  {
    name: "get_product_vendors",
    description: "Get all product vendors in the store.",
    inputSchema: GetProductVendorsSchema,
    handler: getProductVendors,
  },
  {
    name: "get_products_count",
    description: "Count the total number of products, optionally filtered by a query.",
    inputSchema: GetProductsCountSchema,
    handler: getProductsCount,
  },
];
