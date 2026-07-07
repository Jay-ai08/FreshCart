# FreshCart - E-commerce Grocery Platform

A modern, full-stack e-commerce platform for fresh groceries with real-time inventory, user authentication, and order management.

## 🚀 Features

### Frontend (React + Vite)
- ✅ Responsive UI with Tailwind CSS
- ✅ User authentication (Signup/Login)
- ✅ Product browsing by category
- ✅ Shopping cart with localStorage persistence
- ✅ Checkout with delivery details
- ✅ Contact form
- ✅ Order tracking
- ✅ Mobile-friendly design

### Backend (Node.js + Express)
- ✅ RESTful API with CORS support
- ✅ MongoDB database integration
- ✅ JWT authentication
- ✅ User management
- ✅ Product catalog
- ✅ Order management
- ✅ Contact submissions
- ✅ Password hashing

## 📋 Project Structure

```
FreshCart/
├── frontend/              # React + Vite application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── data/          # Static data
│   │   ├── assets/        # Images and static files
│   │   └── App.jsx        # Main app component
│   └── package.json
├── backend/               # Node.js + Express server
│   ├── src/
│   │   ├── models/        # Database models
│   │   ├── controllers/   # Route controllers
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── config/        # Configuration files
│   ├── server.js          # Main server file
│   ├── seed.js            # Database seeder
│   └── package.json
├── SETUP_GUIDE.md         # Detailed setup instructions
└── package.json           # Root scripts
```

## ⚡ Quick Start

### Prerequisites
- Node.js v14+
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone and Install All Dependencies**
```bash
cd FreshCart
npm run install-all
```

2. **Configure Backend**
```bash
cd backend
# Create .env file
# Configure MongoDB URI and JWT secret
```

3. **Configure Frontend**
```bash
cd frontend
# Create .env file
# Configure API URL
```

4. **Seed Database (Optional)**
```bash
npm run seed
```

5. **Start Development**
```bash
# From root directory
npm run dev

# Or run separately
npm run backend    # Terminal 1
npm run frontend   # Terminal 2
```

### Access the Application
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- API: `http://localhost:3000/api`

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup      - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/dashboard   - Get user info (auth required)
```

### Products
```
GET    /api/products         - Get all products
GET    /api/products/category/:category - Get products by category
GET    /api/products/:id     - Get single product
```

### Orders
```
POST   /api/orders           - Create order
GET    /api/orders/user/:userId - Get user orders
GET    /api/orders/:orderId  - Get order details
```

### Users
```
GET    /api/users/:userId    - Get user profile (auth required)
PUT    /api/users/:userId    - Update profile (auth required)
```

### Contact
```
POST   /api/contact          - Submit contact form
```

## 🛠️ Technology Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **CORS** - Cross-origin support

## 📝 Category Management

Available product categories:
- `fruits-vegetables` - Fresh fruits and vegetables
- `beverages` - Drinks and juices
- `dairy` - Milk, yogurt, cheese
- `snacks` - Snacks and dry goods

## 🔐 Authentication

- Passwords are hashed using SHA256 (upgrade to bcrypt in production)
- JWT tokens stored in localStorage
- Tokens expire in 7 days
- Protected routes require valid token

## 💾 Database Schema

### User
```javascript
{
  name, email, phone, password,
  address, city, createdAt
}
```

### Product
```javascript
{
  id, name, tag, desc, price,
  image, alt, category, inStock
}
```

### Order
```javascript
{
  orderId, userId, email, items,
  deliveryDetails, paymentMethod,
  subtotal, tax, total, status
}
```

### Contact
```javascript
{
  name, email, phone,
  subject, message, status
}
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist folder
```

### Backend (Heroku/Railway)
```bash
git push heroku main
# Or deploy using platform CLI
```

## 📚 Environment Variables

### Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/freshcart
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI format
- Verify network access for Atlas

### CORS Errors
- Backend has CORS enabled by default
- Check API URL in frontend .env

### Port Already in Use
- Change PORT in backend .env
- Or kill process using the port

## 📖 Documentation

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup and troubleshooting instructions.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Support

For support, email: support@freshcart.com

## 🎯 Future Roadmap

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Product reviews and ratings
- [ ] Wishlist feature
- [ ] Advanced search and filters
- [ ] Inventory management
- [ ] Multi-language support

---

**Happy Coding! 🎉**
