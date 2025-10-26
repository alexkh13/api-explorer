// Pre-built virtual endpoint templates and patterns
// Users can select these as starting points

export const virtualEndpointTemplates = {
  blank: {
    name: 'Blank Template',
    description: 'Start from scratch with a blank function',
    code: `async function virtualEndpoint(context) {
  const { input, get, post, parallel, utils } = context;

  // Your code here

  return { message: 'Hello from virtual endpoint!' };
}`
  },

  transformSingle: {
    name: 'Transform Single Endpoint',
    description: 'Modify response from a single endpoint',
    code: `async function virtualEndpoint(context) {
  const { input, get, utils } = context;

  // Call source endpoint
  const data = await get('endpoint-id', {
    params: input.params,
    query: input.query
  });

  // Transform response - pick only specific fields
  return utils.pick(data, ['id', 'name', 'email']);
}`
  },

  combineTwo: {
    name: 'Combine Two Endpoints',
    description: 'Merge data from two related endpoints',
    code: `async function virtualEndpoint(context) {
  const { input, parallel, utils } = context;

  // Call multiple endpoints in parallel
  const [primary, secondary] = await parallel(
    { endpointId: 'endpoint-1', options: { params: input.params } },
    { endpointId: 'endpoint-2', options: { query: { id: input.params.id } } }
  );

  // Combine results
  return {
    ...primary,
    relatedData: secondary
  };
}`
  },

  sequentialCalls: {
    name: 'Sequential Calls',
    description: 'Use result from first call in second call',
    code: `async function virtualEndpoint(context) {
  const { input, get } = context;

  // First call
  const user = await get('get-user', {
    params: { id: input.params.id }
  });

  // Use result from first call in second call
  const posts = await get('get-posts', {
    query: { userId: user.id, limit: 10 }
  });

  return { user, posts };
}`
  },

  filterTransform: {
    name: 'Filter & Transform',
    description: 'Filter and reshape array response',
    code: `async function virtualEndpoint(context) {
  const { input, get, utils } = context;

  const data = await get('endpoint-id', {});

  // Filter active items only
  const active = data.filter(item => item.status === 'active');

  // Transform and sort
  return utils.sortBy(active, 'createdAt', 'desc')
    .map(item => utils.pick(item, ['id', 'title', 'createdAt']));
}`
  },

  pagination: {
    name: 'Pagination Wrapper',
    description: 'Add pagination metadata to responses',
    code: `async function virtualEndpoint(context) {
  const { input, get } = context;

  const page = parseInt(input.query.page) || 1;
  const limit = parseInt(input.query.limit) || 20;

  const data = await get('endpoint-id', {
    query: {
      _start: (page - 1) * limit,
      _limit: limit
    }
  });

  return {
    data,
    pagination: {
      page,
      limit,
      total: data.length,
      hasMore: data.length === limit
    }
  };
}`
  },

  renameFields: {
    name: 'Rename Fields',
    description: 'Convert field names between naming conventions',
    code: `async function virtualEndpoint(context) {
  const { input, get, utils } = context;

  const data = await get('endpoint-id', {});

  // Convert snake_case to camelCase
  const mapping = {
    user_name: 'userName',
    created_at: 'createdAt',
    is_active: 'isActive'
  };

  if (Array.isArray(data)) {
    return data.map(item => utils.renameKeys(item, mapping));
  }

  return utils.renameKeys(data, mapping);
}`
  },

  aggregateStats: {
    name: 'Aggregate Statistics',
    description: 'Compute statistics from array data',
    code: `async function virtualEndpoint(context) {
  const { input, get, utils } = context;

  const orders = await get('get-orders', {
    query: { userId: input.params.userId }
  });

  return {
    totalOrders: orders.length,
    totalRevenue: utils.sum(orders, 'total'),
    avgOrderValue: utils.avg(orders, 'total'),
    ordersByStatus: utils.groupBy(orders, 'status'),
    recentOrders: utils.sortBy(orders, 'createdAt', 'desc').slice(0, 10)
  };
}`
  },

  externalApi: {
    name: 'Call External API',
    description: 'Combine local endpoint with external API',
    code: `async function virtualEndpoint(context) {
  const { input, get, fetch } = context;

  // Get data from loaded endpoint
  const user = await get('get-user', {
    params: { id: input.params.id }
  });

  // Enrich with external API data
  const externalData = await fetch(
    \`https://api.example.com/data/\${user.externalId}\`
  );

  return {
    ...user,
    enrichedData: externalData
  };
}`
  },

  conditionalLogic: {
    name: 'Conditional Logic',
    description: 'Different logic based on input parameters',
    code: `async function virtualEndpoint(context) {
  const { input, get } = context;

  const userType = input.query.type;

  if (userType === 'admin') {
    // Admins see all users
    return await get('get-all-users', {});
  } else if (userType === 'premium') {
    // Premium users see filtered list
    const users = await get('get-all-users', {});
    return users.filter(u => u.plan === 'premium');
  } else {
    // Regular users see public list only
    return await get('get-public-users', {});
  }
}`
  },

  errorHandling: {
    name: 'Error Handling',
    description: 'Handle errors gracefully with fallback data',
    code: `async function virtualEndpoint(context) {
  const { input, get } = context;

  try {
    const data = await get('flaky-endpoint', {
      params: input.params
    });

    return { success: true, data };

  } catch (error) {
    // Return fallback data or error info
    return {
      success: false,
      error: error.message,
      fallback: { message: 'Service temporarily unavailable' }
    };
  }
}`
  },

  combineMultiple: {
    name: 'Combine Multiple Endpoints',
    description: 'Fetch and combine data from 3+ endpoints',
    code: `async function virtualEndpoint(context) {
  const { input, parallel, utils } = context;
  const userId = input.params.id;

  // Fetch all user data in parallel
  const [user, posts, comments, favorites] = await parallel(
    { endpointId: 'get-user', options: { params: { id: userId } } },
    { endpointId: 'get-posts', options: { query: { userId } } },
    { endpointId: 'get-comments', options: { query: { userId } } },
    { endpointId: 'get-favorites', options: { query: { userId } } }
  );

  return {
    profile: utils.pick(user, ['id', 'name', 'email', 'avatar']),
    stats: {
      posts: posts.length,
      comments: comments.length,
      favorites: favorites.length
    },
    recentActivity: [
      ...posts.slice(0, 3),
      ...comments.slice(0, 3)
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  };
}`
  },

  dataEnrichment: {
    name: 'Data Enrichment',
    description: 'Add computed fields and metadata to response',
    code: `async function virtualEndpoint(context) {
  const { input, get, utils } = context;

  const products = await get('get-products', {});

  // Enrich each product with computed fields
  return products.map(product => ({
    ...product,
    // Add formatted price
    formattedPrice: \`$\${product.price.toFixed(2)}\`,
    // Add discount percentage if on sale
    discountPercent: product.salePrice
      ? utils.round(((product.price - product.salePrice) / product.price) * 100, 1)
      : 0,
    // Add availability status
    availability: product.stock > 0 ? 'In Stock' : 'Out of Stock',
    // Add formatted dates
    addedDate: utils.formatDate(product.createdAt, 'MMM DD, YYYY')
  }));
}`
  }
};

// Get template by key
export function getTemplate(key) {
  return virtualEndpointTemplates[key] || virtualEndpointTemplates.blank;
}

// Get all template keys and names for UI
export function getTemplateList() {
  return Object.entries(virtualEndpointTemplates).map(([key, template]) => ({
    key,
    name: template.name,
    description: template.description
  }));
}
