# 🚀 FreshCart - Quick Start Guide

## Step 1: Setup MongoDB (One-time)

### Option A: Local MongoDB
```bash
# Windows - Download from https://www.mongodb.com/try/download/community
# Or use MongoDB Community Edition

# Start MongoDB Service
mongod --dbpath "C:\data\db"
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freshcart?retryWrites=true&w=majority
```

---

## Step 2: Install Dependencies

```bash
# From root directory
npm run install-all
```

---

## Step 3: Start the Application

### Option A: Start Both (Recommended)
```bash
# From root directory - this starts frontend AND backend together
npm run dev
```

### Option B: Start Separately
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend  
npm run frontend
```

---

## Step 4: Access the Application

- **Frontend**: Open browser → http://localhost:5173
- **Backend API**: http://localhost:3000/api

---

## Step 5: Seed Sample Products (Optional)

```bash
# From backend directory
npm run seed
```

This adds sample products to your database so you can browse categories.

---

## Test the Features

### 1. Signup
- Navigate to http://localhost:5173/signup
- Fill in the form with test data
- Click "Create Account"
- You should be redirected to home and logged in

### 2. View Profile
- Click your avatar in the top right
- Select "My Profile"
- Edit your information

### 3. Browse Products
- Click any category (Fruits & Vegetables, etc.)
- Products load from database
- Click "Add to Cart"

### 4. Checkout
- Go to cart (🛒 icon)
- Click "Proceed to Checkout"
- Fill delivery details
- Choose payment method
- Click "Place Order"

### 5. Contact Form
- Go to Contact page
- Submit a message
- Saved to database

---

## Troubleshooting

### ❌ "Failed to fetch" on signup
**Cause**: Backend not running
```bash
# Terminal 1: Start backend
npm run backend

# Check if it says "Connected to MongoDB" ✓
```

### ❌ MongoDB connection error
```bash
# Ensure MongoDB is running
# Windows: Check Services or run mongod
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Or update .env with MongoDB Atlas URI
```

### ❌ Port 3000 already in use
```bash
# Change PORT in backend/.env
PORT=3001

# Then update frontend .env
VITE_API_URL=http://localhost:3001/api
```

### ❌ Frontend not updating after changes
```bash
# Hard refresh browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (macOS)
```

---

## File Structure

```
FreshCartt/
├── backend/
│   ├── src/
│   │   ├── models/        ← Database schemas
│   │   ├── controllers/   ← API logic
│   │   ├── routes/        ← API endpoints
│   │   └── middleware/    ← Auth & validation
│   ├── .env               ← Configure here
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/         ← Page components
│   │   ├── components/    ← Reusable components
│   │   ├── services/      ← API client
│   │   └── App.jsx
│   └── .env               ← Configure here
└── README.md
```

---

## Environment Variables

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/freshcart
JWT_SECRET=super_secret_key_123
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

---

## User Flow

```
1. Sign Up → Creates user in database
        ↓
2. Login → Gets JWT token
        ↓
3. Browse Products → Fetches from database
        ↓
4. Add to Cart → Stored in localStorage
        ↓
5. Checkout → Creates order in database
        ↓
6. View Profile → Shows user information
```

---

## API Test Examples

### Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "pass123",
    "confirmPassword": "pass123"
  }'
```

### Get Products by Category
```bash
curl http://localhost:3000/api/products/category/fruits-vegetables
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id_here",
    "email": "user@example.com",
    "items": [...],
    "deliveryDetails": {...},
    "paymentMethod": "card",
    "subtotal": 500,
    "tax": 25,
    "total": 525
  }'
```

---

## Next Steps

1. ✅ Backend is ready
2. ✅ Frontend is integrated
3. ✅ Database is configured
4. 🎯 Deploy to production
5. 🎯 Add payment gateway
6. 🎯 Add email notifications

---

## Support

For issues:
1. Check browser console (F12)
2. Check backend terminal for errors
3. Ensure MongoDB is running
4. Check .env files are configured

Happy coding! 🎉
