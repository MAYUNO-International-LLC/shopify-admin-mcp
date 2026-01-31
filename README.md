# Shopify Admin MCP Server

An MCP (Model Context Protocol) server that provides read-only access to the Shopify Admin GraphQL API.

## Features

- **Read-only access** to Shopify Admin data
- **35 core tools** for products, orders, customers, marketing, discounts, collections, inventory, and shop info
- **12 ShopifyQL analytics tools** (optional, requires Level 2 access) for sales, conversions, campaigns, and more

## Quick Start

### 1. Create a Shopify Custom App

1. In your Shopify admin, go to **Settings → Apps and sales channels → Develop apps**
2. Click **Allow custom app development** (if not already enabled)
3. Click **Create an app** and name it (e.g., "Claude MCP")
4. Click **Configure Admin API scopes** and enable:
   - `read_products`
   - `read_orders`
   - `read_customers`
   - `read_marketing_events`
   - `read_discounts`
   - `read_inventory`
   - `read_locations`
   - `read_analytics`
   - `read_reports`
5. Click **Save**, then click **Install app**
6. In the **API credentials** tab, copy the **API key** and **API secret key**

### ShopifyQL & Analytics Requirements

The ShopifyQL-powered analytics tools (`run_shopifyql`, `get_sales_over_time`, `get_top_customers`, etc.) require additional access beyond API scopes:

1. **`read_reports` scope** - Already included in the scopes above
2. **Level 2 Protected Customer Data Access** - Required for ALL ShopifyQL queries, even those not accessing customer data

To enable Level 2 access:

1. Go to the [Shopify Partner Dashboard](https://partners.shopify.com/)
2. Navigate to **Apps → Your App → API access**
3. Under **Protected customer data**, request Level 2 access
4. Complete the required security attestations
5. Wait for Shopify approval (may take a few days)

**By default, ShopifyQL tools are disabled** to prevent errors for users without Level 2 access. Once approved, enable them by adding the environment variable:

```json
{
  "mcpServers": {
    "shopify-admin": {
      "command": "npx",
      "args": ["-y", "shopify-admin-mcp"],
      "env": {
        "SHOPIFY_CREDENTIALS_PATH": "/path/to/credentials.json",
        "SHOPIFY_SHOPIFYQL_ENABLED": "true"
      }
    }
  }
}
```

> **Note:** Non-ShopifyQL tools (products, orders, customers, etc.) work without Level 2 access.

### 2. Create Credentials File

Create a JSON file with your Shopify credentials (e.g., `~/.shopify-credentials.json`):

```json
{
  "shop": "your-store.myshopify.com",
  "clientId": "your-api-key",
  "clientSecret": "your-api-secret-key"
}
```

### 3. Configure Your MCP Client

#### Claude Code

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "shopify-admin": {
      "command": "npx",
      "args": ["-y", "shopify-admin-mcp"],
      "env": {
        "SHOPIFY_CREDENTIALS_PATH": "/path/to/your/shopify-credentials.json"
      }
    }
  }
}
```

#### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "shopify-admin": {
      "command": "npx",
      "args": ["-y", "shopify-admin-mcp"],
      "env": {
        "SHOPIFY_CREDENTIALS_PATH": "/path/to/your/shopify-credentials.json"
      }
    }
  }
}
```

### 4. Restart and Test

Restart Claude Code/Desktop, then try asking:
- "Get my shop info"
- "Show me sales for the last 7 days"
- "List my top 10 products"

## Available Tools

### Product Tools
| Tool | Description |
|------|-------------|
| `get_products` | List products with filtering/pagination |
| `get_product` | Get single product by ID |
| `get_product_variants` | List product variants |
| `get_product_tags` | Get all product tags |
| `get_product_types` | Get all product types |
| `get_product_vendors` | Get all product vendors |
| `get_products_count` | Count products |

### Order Tools
| Tool | Description |
|------|-------------|
| `get_orders` | List orders with filtering/pagination |
| `get_order` | Get single order by ID |
| `get_orders_count` | Count orders |
| `get_abandoned_checkouts` | List abandoned checkouts |
| `get_abandoned_checkouts_count` | Count abandoned checkouts |

### Customer & Segment Tools
| Tool | Description |
|------|-------------|
| `get_customers` | List customers with filtering |
| `get_customer` | Get single customer by ID |
| `get_customers_count` | Count customers |
| `get_segments` | List customer segments |
| `get_segment` | Get single segment by ID |
| `get_segment_members` | Get customers in a segment |

### Marketing Tools
| Tool | Description |
|------|-------------|
| `get_marketing_activities` | List marketing activities |
| `get_marketing_activity` | Get single marketing activity |
| `get_marketing_events` | List marketing events |
| `get_marketing_event` | Get single marketing event |

### Discount Tools
| Tool | Description |
|------|-------------|
| `get_discounts` | List all discounts |
| `get_discount` | Get single discount by ID |
| `get_code_discounts` | List code-based discounts |
| `get_automatic_discounts` | List automatic discounts |

### Collection Tools
| Tool | Description |
|------|-------------|
| `get_collections` | List collections |
| `get_collection` | Get single collection by ID |
| `get_collections_count` | Count collections |

### Inventory & Location Tools
| Tool | Description |
|------|-------------|
| `get_inventory_items` | List inventory items |
| `get_inventory_item` | Get single inventory item |
| `get_locations` | List locations |
| `get_location` | Get single location |

### Shop Tools
| Tool | Description |
|------|-------------|
| `get_shop` | Get shop information |
| `get_shop_locales` | Get shop locales |
| `run_shopifyql` | Run custom ShopifyQL query |

### Analytics Tools
| Tool | Description |
|------|-------------|
| `get_sales_over_time` | Sales trends by day/week/month |
| `get_sales_by_product` | Top selling products |
| `get_sales_by_region` | Sales breakdown by country |
| `get_sales_by_traffic_source` | Sales by referrer/source |
| `get_sessions_over_time` | Traffic/session trends |
| `get_conversion_rate` | Session to order conversion rate |
| `get_average_order_value` | AOV trends over time |
| `get_top_customers` | Highest spending customers |
| `get_conversions_by_channel` | Conversion rates by channel |
| `get_campaign_performance` | Campaign performance metrics |
| `get_campaign_performance_over_time` | Campaign trends over time |

## Example Usage

### Get sales trends
```
"Show me daily sales for the last 30 days"
```

### Analyze top products
```
"What are my top 10 best-selling products this month?"
```

### Check campaign performance
```
"How are my marketing campaigns performing?"
```

### Run custom analytics
```
"Run this ShopifyQL query: FROM sales SHOW total_sales, orders GROUP BY product_title SINCE -7d ORDER BY total_sales DESC LIMIT 5"
```

## Development

### Local Setup

```bash
git clone https://github.com/MAYUNO-International-LLC/shopify-admin-mcp.git
cd shopify-admin-mcp
npm install
npm run build
```

### Local MCP Configuration

For local development, point to the built files:

```json
{
  "mcpServers": {
    "shopify-admin": {
      "command": "node",
      "args": ["/path/to/shopify-admin-mcp/dist/index.js"],
      "env": {
        "SHOPIFY_CREDENTIALS_PATH": "/path/to/credentials.json"
      }
    }
  }
}
```

## License

MIT