# API Service Integration Guide

This document explains how to use the API services in your React components.

## Importing Services

```javascript
import { 
  authAPI, 
  productsAPI, 
  ordersAPI, 
  contactAPI, 
  usersAPI 
} from '../services/api';
```

## Usage Examples

### Authentication

#### Signup
```javascript
try {
  const response = await authAPI.signup(
    name, 
    email, 
    phone, 
    password, 
    confirmPassword
  );
  
  localStorage.setItem('authToken', response.token);
  localStorage.setItem('user', JSON.stringify(response.user));
} catch (error) {
  console.error(error.message);
}
```

#### Login
```javascript
try {
  const response = await authAPI.login(email, password);
  
  localStorage.setItem('authToken', response.token);
  localStorage.setItem('user', JSON.stringify(response.user));
} catch (error) {
  console.error(error.message);
}
```

#### Get Dashboard
```javascript
try {
  const response = await authAPI.getDashboard();
  console.log(response.user);
} catch (error) {
  console.error(error.message);
}
```

### Products

#### Get All Products
```javascript
try {
  const products = await productsAPI.getAll();
  console.log(products);
} catch (error) {
  console.error(error.message);
}
```

#### Get Products by Category
```javascript
try {
  const products = await productsAPI.getByCategory('fruits-vegetables');
  console.log(products);
} catch (error) {
  console.error(error.message);
}
```

#### Get Single Product
```javascript
try {
  const product = await productsAPI.getById('fruits-vegetables-green-apples-1');
  console.log(product);
} catch (error) {
  console.error(error.message);
}
```

### Orders

#### Create Order
```javascript
try {
  const orderData = {
    userId: '123',
    email: 'user@example.com',
    items: cartItems,
    deliveryDetails: {
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      address: '123 Main St',
      city: 'NYC',
      pincode: '10001',
      instructions: 'Ring bell twice'
    },
    paymentMethod: 'card',
    subtotal: 500,
    tax: 25,
    total: 525
  };
  
  const response = await ordersAPI.create(orderData);
  console.log(response.order);
} catch (error) {
  console.error(error.message);
}
```

#### Get User Orders
```javascript
try {
  const orders = await ordersAPI.getUserOrders(userId);
  console.log(orders);
} catch (error) {
  console.error(error.message);
}
```

#### Get Order Details
```javascript
try {
  const order = await ordersAPI.getById('ORD-123456');
  console.log(order);
} catch (error) {
  console.error(error.message);
}
```

### Contact

#### Submit Contact Form
```javascript
try {
  const response = await contactAPI.submit(
    'John Doe',
    'john@example.com',
    '1234567890',
    'Product Inquiry',
    'I have a question about your products'
  );
  console.log(response.message);
} catch (error) {
  console.error(error.message);
}
```

### Users

#### Get User Profile
```javascript
try {
  const user = await usersAPI.getProfile(userId);
  console.log(user);
} catch (error) {
  console.error(error.message);
}
```

#### Update User Profile
```javascript
try {
  const response = await usersAPI.updateProfile(userId, {
    email: 'newemail@example.com',
    phone: '9876543210',
    address: '456 Oak Ave',
    city: 'LA'
  });
  console.log(response.user);
} catch (error) {
  console.error(error.message);
}
```

## Error Handling

All API calls throw errors on failure. Always use try-catch:

```javascript
async function fetchData() {
  try {
    const data = await productsAPI.getAll();
    // Handle success
  } catch (error) {
    // Handle error
    console.error('API Error:', error.message);
    // Show user-friendly message
  }
}
```

## Authentication Token

The API service automatically includes the JWT token from localStorage:

```javascript
// Automatically handled by the service
const token = localStorage.getItem('authToken');
headers['Authorization'] = `Bearer ${token}`;
```

## Best Practices

1. **Always handle errors** with try-catch blocks
2. **Show loading states** during API calls
3. **Validate input** before sending to API
4. **Store tokens** securely in localStorage
5. **Refresh tokens** when they expire
6. **Use environment variables** for API URLs

## Component Example

```javascript
import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await productsAPI.getAll();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.desc}</p>
          <p>₹{product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

## API Configuration

The API base URL is configurable via environment variables:

### Development (.env)
```
VITE_API_URL=http://localhost:3000/api
```

### Production (.env.production)
```
VITE_API_URL=https://api.freshcart.com/api
```

The service automatically picks the correct URL based on the environment.
