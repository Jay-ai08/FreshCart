const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');
const DEFAULT_TIMEOUT_MS = 8000;
const productCache = new Map();

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function cacheKey(endpoint) {
    return `${API_BASE_URL}${endpoint}`;
}

function getCachedProduct(endpoint) {
    const cached = productCache.get(cacheKey(endpoint));
    if (!cached || cached.expires < Date.now()) {
        productCache.delete(cacheKey(endpoint));
        return null;
    }
    return cached.data;
}

function setCachedProduct(endpoint, data) {
    productCache.set(cacheKey(endpoint), {
        data,
        expires: Date.now() + 2 * 60 * 1000,
    });
}

// Helper function to make API requests
async function apiCall(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT_MS);
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const token = getAuthToken();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || data.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please check that the backend server is running.', { cause: error });
        }
        throw new Error(error.message || 'Failed to fetch. Please check your connection.', { cause: error });
    } finally {
        window.clearTimeout(timeoutId);
    }
}

async function cachedProductCall(endpoint) {
    const cached = getCachedProduct(endpoint);
    if (cached) return cached;

    const data = await apiCall(endpoint, { timeout: 5000 });
    setCachedProduct(endpoint, data);
    return data;
}

// Auth API
export const authAPI = {
    login: (email, password) =>
        apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        }),

    signup: (name, email, phone, password, confirmPassword) =>
        apiCall('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, phone, password, confirmPassword })
        }),

    getDashboard: () => apiCall('/auth/dashboard')
};

// Products API
export const productsAPI = {
    getAll: () => cachedProductCall('/products'),

    getByCategory: (category) => cachedProductCall(`/products/category/${category}`),

    getById: (id) => cachedProductCall(`/products/${id}`)
};

// Orders API
export const ordersAPI = {
    create: (orderData) =>
        apiCall('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        }),

    getAll: () => apiCall('/orders'),

    getUserOrders: (userId) => apiCall(`/orders/user/${userId}`),

    getById: (orderId) => apiCall(`/orders/${orderId}`),

    updateStatus: (orderId, status) =>
        apiCall(`/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        })
};

// Contact API
export const contactAPI = {
    submit: (name, email, phone, subject, message) =>
        apiCall('/contact', {
            method: 'POST',
            body: JSON.stringify({ name, email, phone, subject, message })
        })
};

// Users API
export const usersAPI = {
    getProfile: (userId) => apiCall(`/users/${userId}`),

    updateProfile: (userId, data) =>
        apiCall(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        })
};

export default {
    authAPI,
    productsAPI,
    ordersAPI,
    contactAPI,
    usersAPI
};
