# FreshCart - Complete Setup Guide

## Overview
FreshCart is a full-stack e-commerce application for groceries with React frontend and Node.js/Express backend with MongoDB.

## Prerequisites
- Node.js v14+ and npm
- MongoDB (local or Atlas)
- Git

---

## Backend Setup

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/freshcart
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freshcart?retryWrites=true&w=majority
```

### Step 3: Seed Database (Optional)
To populate the database with sample products:
```bash
npm run seed
```

### Step 4: Start Backend Server
```bash
npm run dev
```
Server will run on `http://localhost:3000`

---

## Frontend Setup

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:3000/api
```

For production:
```env
VITE_API_URL=https://your-api-domain.com/api
```

### Step 3: Start Development Server
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/dashboard` - Get user dashboard (authenticated)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/:id` - Get single product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user/:userId` - Get user's orders
- `GET /api/orders/:orderId` - Get single order

### Contact
- `POST /api/contact` - Submit contact form

### Users
- `GET /api/users/:userId` - Get user profile (authenticated)
- `PUT /api/users/:userId` - Update user profile (authenticated)

---

## Features Implemented

### Authentication ✅
- User signup with validation
- Login with JWT tokens
- Token stored in localStorage
- Password hashing

### Products ✅
- Browse products by category
- View product details
- Categories: Fruits & Vegetables, Beverages, Dairy, Snacks

### Shopping Cart ✅
- Add/remove products
- Update quantities
- Persistent cart in localStorage
- Real-time cart calculations

### Orders ✅
- Place orders with delivery details
- Multiple payment methods (Card, UPI, COD)
- Order status tracking
- Order history

### Contact ✅
- Contact form submission
- Message storage in database

---

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  address: String,
  city: String,
  createdAt: Date
}
```

### Product
```javascript
{
  id: String (unique),
  name: String,
  tag: String,
  desc: String,
  price: Number,
  image: String,
  alt: String,
  category: String,
  inStock: Boolean,
  createdAt: Date
}
```

### Order
```javascript
{
  orderId: String (unique),
  userId: ObjectId,
  email: String,
  items: Array,
  deliveryDetails: Object,
  paymentMethod: String,
  subtotal: Number,
  tax: Number,
  total: Number,
  status: String,
  createdAt: Date
}
```

### Contact
```javascript
{
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  status: String,
  createdAt: Date
}
```

---

## Development Tips

### Update API URL
If your backend runs on a different port, update `.env` in frontend:
```env
VITE_API_URL=http://localhost:YOUR_PORT/api
```

### MongoDB Local Setup
If you don't have MongoDB installed:
```bash
# Windows
# Download from https://www.mongodb.com/try/download/community

# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu)
sudo apt-get install -y mongodb
```

### Start MongoDB
```bash
# If not running as service
mongod --dbpath /path/to/data
```

---

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity for MongoDB Atlas

### "CORS Error"
- Backend has CORS enabled by default
- If issues persist, check `server.js` CORS configuration

### "API calls fail"
- Check if backend is running on correct port
- Verify `VITE_API_URL` in frontend `.env`
- Check browser console for error details

### "Port already in use"
```bash
# Change PORT in backend .env
PORT=3001
```

---

## Production Deployment

### Backend (Heroku/Railway)
1. Add `.env` variables to hosting platform
2. Ensure MongoDB Atlas is configured
3. Deploy server code

### Frontend (Vercel/Netlify)
1. Update `.env.production` with production API URL
2. Deploy build output

---

## Future Enhancements
- Payment gateway integration (Stripe, Razorpay)
- Email notifications
- Admin dashboard
- Product reviews and ratings
- Wishlist feature
- Search and filters
- Inventory management

---

## Support
For issues or questions, contact: support@freshcart.com
