/**
 * API Service
 * Handles all backend API calls
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Product APIs
export const productAPI = {
  // Get all products
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/products?${queryString}`);
  },

  // Get single product
  getById: (productId) => fetchAPI(`/products/${productId}`),

  // Add new product
  add: (productData) => fetchAPI('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),

  // Move product to new rack
  move: (productId, newRackId) => fetchAPI(`/products/${productId}/move`, {
    method: 'PUT',
    body: JSON.stringify({ newRackId })
  }),

  // Dispatch product
  dispatch: (productId) => fetchAPI(`/products/${productId}/dispatch`, {
    method: 'PUT'
  })
};

// Rack APIs
export const rackAPI = {
  // Get all racks
  getAll: () => fetchAPI('/racks'),

  // Get rack by ID with products
  getById: (rackId) => fetchAPI(`/racks/${rackId}`),

  // Get products in rack
  getProducts: (rackId) => fetchAPI(`/racks/${rackId}/products`),

  // Create new rack
  create: (rackData) => fetchAPI('/racks', {
    method: 'POST',
    body: JSON.stringify(rackData)
  })
};

// Movement History APIs
export const movementAPI = {
  // Get all movements
  getAll: () => fetchAPI('/racks/movements/all')
};

const api = { productAPI, rackAPI, movementAPI };
export default api;
