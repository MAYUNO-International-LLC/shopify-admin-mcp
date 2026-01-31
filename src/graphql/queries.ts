// Product Queries
export const GET_PRODUCTS = `
  query GetProducts($first: Int, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        id
        title
        handle
        status
        vendor
        productType
        tags
        totalInventory
        createdAt
        updatedAt
        publishedAt
        priceRangeV2 {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
        }
        variantsCount {
          count
        }
      }
    }
  }
`;

export const GET_PRODUCT = `
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      description
      descriptionHtml
      status
      vendor
      productType
      tags
      totalInventory
      createdAt
      updatedAt
      publishedAt
      onlineStoreUrl
      options {
        id
        name
        position
        values
      }
      priceRangeV2 {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        url
        altText
      }
      images(first: 10) {
        nodes {
          url
          altText
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          sku
          price
          compareAtPrice
          inventoryQuantity
          availableForSale
          selectedOptions {
            name
            value
          }
        }
      }
      seo {
        title
        description
      }
    }
  }
`;

export const GET_PRODUCT_VARIANTS = `
  query GetProductVariants($productId: ID!, $first: Int, $after: String) {
    product(id: $productId) {
      id
      title
      variants(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          sku
          price
          compareAtPrice
          inventoryQuantity
          availableForSale
          barcode
          weight
          weightUnit
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_TAGS = `
  query GetProductTags($first: Int, $after: String) {
    productTags(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node
      }
    }
  }
`;

export const GET_PRODUCT_TYPES = `
  query GetProductTypes($first: Int, $after: String) {
    productTypes(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node
      }
    }
  }
`;

export const GET_PRODUCT_VENDORS = `
  query GetProductVendors($first: Int, $after: String) {
    productVendors(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node
      }
    }
  }
`;

export const GET_PRODUCTS_COUNT = `
  query GetProductsCount($query: String) {
    productsCount(query: $query) {
      count
    }
  }
`;

// Order Queries
export const GET_ORDERS = `
  query GetOrders($first: Int, $after: String, $query: String) {
    orders(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        id
        name
        email
        createdAt
        updatedAt
        closedAt
        cancelledAt
        displayFinancialStatus
        displayFulfillmentStatus
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        subtotalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        totalShippingPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        totalTaxSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        totalDiscountsSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        lineItems(first: 10) {
          nodes {
            title
            quantity
            originalUnitPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
        customer {
          id
          email
          firstName
          lastName
        }
        shippingAddress {
          city
          province
          country
        }
        tags
      }
    }
  }
`;

export const GET_ORDER = `
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      name
      email
      phone
      note
      createdAt
      updatedAt
      closedAt
      cancelledAt
      cancelReason
      displayFinancialStatus
      displayFulfillmentStatus
      confirmed
      totalPriceSet {
        shopMoney {
          amount
          currencyCode
        }
      }
      subtotalPriceSet {
        shopMoney {
          amount
          currencyCode
        }
      }
      totalShippingPriceSet {
        shopMoney {
          amount
          currencyCode
        }
      }
      totalTaxSet {
        shopMoney {
          amount
          currencyCode
        }
      }
      totalDiscountsSet {
        shopMoney {
          amount
          currencyCode
        }
      }
      totalRefundedSet {
        shopMoney {
          amount
          currencyCode
        }
      }
      lineItems(first: 50) {
        nodes {
          id
          title
          quantity
          sku
          variantTitle
          vendor
          originalUnitPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          discountedUnitPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          product {
            id
          }
        }
      }
      customer {
        id
        email
        firstName
        lastName
        numberOfOrders
      }
      billingAddress {
        firstName
        lastName
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      shippingAddress {
        firstName
        lastName
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      shippingLine {
        title
        originalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
      discountCodes
      tags
      fulfillments {
        id
        status
        createdAt
        trackingInfo {
          number
          url
          company
        }
      }
    }
  }
`;

export const GET_ORDERS_COUNT = `
  query GetOrdersCount($query: String) {
    ordersCount(query: $query) {
      count
    }
  }
`;

export const GET_ABANDONED_CHECKOUTS = `
  query GetAbandonedCheckouts($first: Int, $after: String, $query: String) {
    abandonedCheckouts(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        createdAt
        updatedAt
        abandonedCheckoutUrl
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        lineItems(first: 10) {
          nodes {
            title
            quantity
            variant {
              id
              price
            }
          }
        }
        customer {
          id
          email
          firstName
          lastName
        }
        shippingAddress {
          city
          province
          country
        }
      }
    }
  }
`;

export const GET_ABANDONED_CHECKOUTS_COUNT = `
  query GetAbandonedCheckoutsCount($query: String) {
    abandonedCheckoutsCount(query: $query) {
      count
    }
  }
`;

// Customer Queries
export const GET_CUSTOMERS = `
  query GetCustomers($first: Int, $after: String, $query: String) {
    customers(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        email
        firstName
        lastName
        phone
        state
        numberOfOrders
        amountSpent {
          amount
          currencyCode
        }
        createdAt
        updatedAt
        tags
        defaultAddress {
          city
          province
          country
        }
      }
    }
  }
`;

export const GET_CUSTOMER = `
  query GetCustomer($id: ID!) {
    customer(id: $id) {
      id
      email
      firstName
      lastName
      phone
      state
      note
      verifiedEmail
      taxExempt
      numberOfOrders
      amountSpent {
        amount
        currencyCode
      }
      createdAt
      updatedAt
      tags
      defaultAddress {
        id
        firstName
        lastName
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      addresses {
        id
        firstName
        lastName
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      orders(first: 10) {
        nodes {
          id
          name
          createdAt
          displayFinancialStatus
          displayFulfillmentStatus
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const GET_CUSTOMERS_COUNT = `
  query GetCustomersCount($query: String) {
    customersCount(query: $query) {
      count
    }
  }
`;

export const GET_SEGMENTS = `
  query GetSegments($first: Int, $after: String) {
    segments(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        name
        query
        creationDate
        lastEditDate
      }
    }
  }
`;

export const GET_SEGMENT = `
  query GetSegment($id: ID!) {
    segment(id: $id) {
      id
      name
      query
      creationDate
      lastEditDate
    }
  }
`;

export const GET_SEGMENT_MEMBERS = `
  query GetSegmentMembers($segmentId: ID!, $first: Int, $after: String) {
    segment(id: $segmentId) {
      id
      name
    }
    customerSegmentMembers(segmentId: $segmentId, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          email
          firstName
          lastName
          numberOfOrders
          amountSpent {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

// Marketing Queries
export const GET_MARKETING_ACTIVITIES = `
  query GetMarketingActivities($first: Int, $after: String) {
    marketingActivities(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        activityType
        status
        statusBadgeType
        createdAt
        scheduledToEndAt
        budget {
          budgetType
          total {
            amount
            currencyCode
          }
        }
        marketingChannelType
      }
    }
  }
`;

export const GET_MARKETING_ACTIVITY = `
  query GetMarketingActivity($id: ID!) {
    marketingActivity(id: $id) {
      id
      title
      activityType
      status
      statusBadgeType
      statusLabel
      createdAt
      scheduledToEndAt
      budget {
        budgetType
        total {
          amount
          currencyCode
        }
      }
      marketingChannelType
      sourceAndMedium
      utmParameters {
        campaign
        medium
        source
      }
    }
  }
`;

export const GET_MARKETING_EVENTS = `
  query GetMarketingEvents($first: Int, $after: String, $query: String) {
    marketingEvents(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        type
        channel
        startedAt
        endedAt
        targetTypeDisplayText
        description
        manageUrl
        previewUrl
      }
    }
  }
`;

export const GET_MARKETING_EVENT = `
  query GetMarketingEvent($id: ID!) {
    marketingEvent(id: $id) {
      id
      type
      channel
      startedAt
      endedAt
      targetTypeDisplayText
      description
      manageUrl
      previewUrl
      utmParameters {
        campaign
        medium
        source
      }
    }
  }
`;

// Discount Queries
export const GET_DISCOUNTS = `
  query GetDiscounts($first: Int, $after: String, $query: String) {
    discountNodes(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        discount {
          ... on DiscountCodeBasic {
            title
            status
            startsAt
            endsAt
            usageLimit
            asyncUsageCount
            codes(first: 5) {
              nodes {
                code
              }
            }
            customerGets {
              value {
                ... on DiscountPercentage {
                  percentage
                }
                ... on DiscountAmount {
                  amount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          ... on DiscountCodeBxgy {
            title
            status
            startsAt
            endsAt
            usageLimit
            asyncUsageCount
            codes(first: 5) {
              nodes {
                code
              }
            }
          }
          ... on DiscountCodeFreeShipping {
            title
            status
            startsAt
            endsAt
            usageLimit
            asyncUsageCount
            codes(first: 5) {
              nodes {
                code
              }
            }
          }
          ... on DiscountAutomaticBasic {
            title
            status
            startsAt
            endsAt
            asyncUsageCount
            customerGets {
              value {
                ... on DiscountPercentage {
                  percentage
                }
                ... on DiscountAmount {
                  amount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          ... on DiscountAutomaticBxgy {
            title
            status
            startsAt
            endsAt
            asyncUsageCount
          }
          ... on DiscountAutomaticFreeShipping {
            title
            status
            startsAt
            endsAt
            asyncUsageCount
          }
        }
      }
    }
  }
`;

export const GET_DISCOUNT = `
  query GetDiscount($id: ID!) {
    discountNode(id: $id) {
      id
      discount {
        ... on DiscountCodeBasic {
          title
          status
          summary
          startsAt
          endsAt
          usageLimit
          asyncUsageCount
          appliesOncePerCustomer
          codes(first: 10) {
            nodes {
              code
              usageCount
            }
          }
          customerGets {
            value {
              ... on DiscountPercentage {
                percentage
              }
              ... on DiscountAmount {
                amount {
                  amount
                  currencyCode
                }
              }
            }
          }
          minimumRequirement {
            ... on DiscountMinimumQuantity {
              greaterThanOrEqualToQuantity
            }
            ... on DiscountMinimumSubtotal {
              greaterThanOrEqualToSubtotal {
                amount
                currencyCode
              }
            }
          }
        }
        ... on DiscountCodeBxgy {
          title
          status
          summary
          startsAt
          endsAt
          usageLimit
          asyncUsageCount
          appliesOncePerCustomer
          codes(first: 10) {
            nodes {
              code
              usageCount
            }
          }
        }
        ... on DiscountCodeFreeShipping {
          title
          status
          summary
          startsAt
          endsAt
          usageLimit
          asyncUsageCount
          appliesOncePerCustomer
          codes(first: 10) {
            nodes {
              code
              usageCount
            }
          }
        }
        ... on DiscountAutomaticBasic {
          title
          status
          summary
          startsAt
          endsAt
          asyncUsageCount
          customerGets {
            value {
              ... on DiscountPercentage {
                percentage
              }
              ... on DiscountAmount {
                amount {
                  amount
                  currencyCode
                }
              }
            }
          }
          minimumRequirement {
            ... on DiscountMinimumQuantity {
              greaterThanOrEqualToQuantity
            }
            ... on DiscountMinimumSubtotal {
              greaterThanOrEqualToSubtotal {
                amount
                currencyCode
              }
            }
          }
        }
        ... on DiscountAutomaticBxgy {
          title
          status
          summary
          startsAt
          endsAt
          asyncUsageCount
        }
        ... on DiscountAutomaticFreeShipping {
          title
          status
          summary
          startsAt
          endsAt
          asyncUsageCount
        }
      }
    }
  }
`;

export const GET_CODE_DISCOUNTS = `
  query GetCodeDiscounts($first: Int, $after: String, $query: String) {
    codeDiscountNodes(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        codeDiscount {
          ... on DiscountCodeBasic {
            title
            status
            startsAt
            endsAt
            usageLimit
            asyncUsageCount
            codes(first: 5) {
              nodes {
                code
              }
            }
          }
          ... on DiscountCodeBxgy {
            title
            status
            startsAt
            endsAt
            usageLimit
            asyncUsageCount
            codes(first: 5) {
              nodes {
                code
              }
            }
          }
          ... on DiscountCodeFreeShipping {
            title
            status
            startsAt
            endsAt
            usageLimit
            asyncUsageCount
            codes(first: 5) {
              nodes {
                code
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_AUTOMATIC_DISCOUNTS = `
  query GetAutomaticDiscounts($first: Int, $after: String, $query: String) {
    automaticDiscountNodes(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        automaticDiscount {
          ... on DiscountAutomaticBasic {
            title
            status
            startsAt
            endsAt
            asyncUsageCount
          }
          ... on DiscountAutomaticBxgy {
            title
            status
            startsAt
            endsAt
            asyncUsageCount
          }
          ... on DiscountAutomaticFreeShipping {
            title
            status
            startsAt
            endsAt
            asyncUsageCount
          }
        }
      }
    }
  }
`;

export const GET_DISCOUNTS_COUNT = `
  query GetDiscountsCount($query: String) {
    discountNodes(first: 1, query: $query) {
      totalCount
    }
  }
`;

// Collection Queries
export const GET_COLLECTIONS = `
  query GetCollections($first: Int, $after: String, $query: String) {
    collections(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        handle
        description
        productsCount {
          count
        }
        sortOrder
        updatedAt
        image {
          url
          altText
        }
      }
    }
  }
`;

export const GET_COLLECTION = `
  query GetCollection($id: ID!) {
    collection(id: $id) {
      id
      title
      handle
      description
      descriptionHtml
      productsCount {
        count
      }
      sortOrder
      updatedAt
      image {
        url
        altText
      }
      seo {
        title
        description
      }
      ruleSet {
        appliedDisjunctively
        rules {
          column
          relation
          condition
        }
      }
      products(first: 20) {
        nodes {
          id
          title
          status
          vendor
          totalInventory
          priceRangeV2 {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const GET_COLLECTIONS_COUNT = `
  query GetCollectionsCount($query: String) {
    collectionsCount(query: $query) {
      count
    }
  }
`;

// Inventory Queries
export const GET_INVENTORY_ITEMS = `
  query GetInventoryItems($first: Int, $after: String, $query: String) {
    inventoryItems(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        sku
        tracked
        createdAt
        updatedAt
        inventoryLevels(first: 10) {
          nodes {
            id
            available
            location {
              id
              name
            }
          }
        }
        variant {
          id
          title
          product {
            id
            title
          }
        }
      }
    }
  }
`;

export const GET_INVENTORY_ITEM = `
  query GetInventoryItem($id: ID!) {
    inventoryItem(id: $id) {
      id
      sku
      tracked
      requiresShipping
      createdAt
      updatedAt
      unitCost {
        amount
        currencyCode
      }
      countryCodeOfOrigin
      harmonizedSystemCode
      inventoryLevels(first: 50) {
        nodes {
          id
          available
          location {
            id
            name
            address {
              city
              province
              country
            }
          }
        }
      }
      variant {
        id
        title
        sku
        price
        product {
          id
          title
          vendor
        }
      }
    }
  }
`;

export const GET_LOCATIONS = `
  query GetLocations($first: Int, $after: String) {
    locations(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        name
        isActive
        fulfillsOnlineOrders
        hasActiveInventory
        address {
          address1
          address2
          city
          province
          country
          zip
          phone
        }
      }
    }
  }
`;

export const GET_LOCATION = `
  query GetLocation($id: ID!) {
    location(id: $id) {
      id
      name
      isActive
      fulfillsOnlineOrders
      hasActiveInventory
      address {
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      fulfillmentService {
        id
        serviceName
      }
      inventoryLevels(first: 50) {
        nodes {
          id
          available
          item {
            id
            sku
            variant {
              id
              title
              product {
                id
                title
              }
            }
          }
        }
      }
    }
  }
`;

// Shop Queries
export const GET_SHOP = `
  query GetShop {
    shop {
      id
      name
      email
      description
      myshopifyDomain
      primaryDomain {
        url
        host
      }
      plan {
        displayName
        partnerDevelopment
        shopifyPlus
      }
      billingAddress {
        city
        province
        country
      }
      currencyCode
      currencyFormats {
        moneyFormat
        moneyWithCurrencyFormat
      }
      timezoneAbbreviation
      ianaTimezone
      unitSystem
      weightUnit
      createdAt
      updatedAt
    }
  }
`;

export const GET_SHOP_LOCALES = `
  query GetShopLocales {
    shopLocales {
      locale
      name
      primary
      published
    }
  }
`;

export const RUN_SHOPIFYQL = `
  query RunShopifyQL($query: String!) {
    shopifyqlQuery(query: $query) {
      __typename
      ... on TableResponse {
        tableData {
          unformattedData
          rowData
          columns {
            name
            dataType
            displayName
          }
        }
        parseErrors {
          code
          message
          range {
            start {
              line
              character
            }
            end {
              line
              character
            }
          }
        }
      }
    }
  }
`;
