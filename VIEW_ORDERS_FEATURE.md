# View Orders - Feature Documentation

## Overview
The View Orders page allows users to see all their past and current orders with detailed information about each order including delivery details, payment method, items, and order status.

## Access Points

### 1. From User Dropdown Menu
Click on your avatar in the top-right corner of the header and select "📦 My Orders"

### 2. From Profile Page
Click the "View Orders" link in the Quick Links section of your profile

### 3. Direct URL
Navigate to `/orders` in your browser

### 4. From Empty Cart/Checkout
When your cart is empty, you'll see a "View Your Orders" button

## Features

### 📋 Order List
- View all your orders in a single list
- Each order card shows:
  - Order ID (unique identifier)
  - Order date
  - Current status with emoji indicator
  - Total amount
  - Expandable details button

### 📊 Order Status
Orders can have the following statuses:
- **⏳ Pending** - Order placed, awaiting confirmation
- **✅ Confirmed** - Order confirmed by store
- **📦 Shipped** - Order is out for delivery
- **🎉 Delivered** - Order successfully delivered
- **❌ Cancelled** - Order has been cancelled

### 📖 Order Details (Expandable)
Click on any order card to expand and see:

#### Delivery Details
- Recipient name (first and last)
- Phone number
- Full address
- City
- Pincode
- Special delivery instructions (if any)

#### Payment Details
- Payment method used (Card, UPI, or COD)
- Number of items in order
- Subtotal amount
- Tax amount (5% GST)
- Total amount

#### Items List
- Each item shows:
  - Product name
  - Quantity ordered
  - Unit price
  - Total for that item (price × quantity)

#### Order Timeline
Visual representation of order progress:
- ✓ Order Placed (completed on placement)
- Order Confirmed (expected within 24 hours)
- Out for Delivery (2-3 days)
- Delivered (soon)

### 📊 Order Statistics (Sidebar)

#### Order Stats Card
- **Total Orders** - Count of all orders
- **Pending** - Orders awaiting confirmation
- **Shipped** - Orders confirmed or shipped
- **Delivered** - Successfully delivered orders

#### Total Spent Card
- Shows total amount spent across all orders
- Displays order count summary

#### Quick Links
- Continue Shopping - Browse products
- My Profile - View/edit profile
- Shortcuts to frequently used pages

## User Experience

### No Orders Yet
If you haven't placed any orders:
- Empty state message displayed
- "Start Shopping" button to browse products
- Easy navigation to categories

### Order Information
- All order information is clearly organized
- Color-coded status badges for quick recognition
- Timeline shows order progress visually
- Easy-to-read item summaries

### Responsive Design
- Works perfectly on desktop, tablet, and mobile
- On mobile, order cards collapse to save space
- Stats display in grid on smaller screens
- Expandable sections for detailed information

## Data Displayed

### Per Order
```javascript
{
  orderId: "ORD-123456-ABC",
  createdAt: "2024-07-06T10:30:00Z",
  status: "shipped",
  total: 525,
  items: [
    {
      name: "Green Apples",
      quantity: 2,
      price: 149
    },
    ...
  ],
  deliveryDetails: {
    firstName: "John",
    lastName: "Doe",
    phone: "9876543210",
    address: "123 Main Street",
    city: "New York",
    pincode: "10001",
    instructions: "Ring bell twice"
  },
  paymentMethod: "card",
  subtotal: 500,
  tax: 25
}
```

## Navigation

From View Orders, you can:
- ✅ Go back to shopping
- ✅ View your profile
- ✅ Check your cart
- ✅ Continue shopping in categories
- ✅ Contact support

## Login Required

The View Orders page requires user authentication:
- You must be logged in to view your orders
- If not logged in, redirected to login page
- Each user only sees their own orders
- Orders are tied to user account

## Error Handling

If something goes wrong:
- **Error loading orders** - Backend or network issue
  - Try refreshing the page
  - Check your internet connection
  - Ensure you're logged in
  
- **Empty orders list** - You haven't placed any orders yet
  - Browse products to place your first order
  - Check under different accounts if using multiple

## Tips & Tricks

### Track Your Order
1. Go to View Orders
2. Find your order status
3. Check the timeline for progress
4. See estimated delivery times

### Find Order Details
1. Click on any order card to expand
2. View complete delivery address
3. Check what items were ordered
4. Verify payment method used

### Manage Account
1. From View Orders sidebar
2. Click "My Profile" to update information
3. Click "Continue Shopping" to browse
4. Use "Order Stats" to see spending summary

### Mobile Friendly
- Orders display clearly on mobile
- Click to expand order details
- Easy to read on small screens
- All information accessible

## Integration Points

### View Orders connects to:
- **User Authentication** - Login required
- **Order Database** - Fetches user's orders
- **User Profile** - Link to profile management
- **Shopping** - Easy access to products
- **Navigation** - Links to all major pages

### Data Sources
- Orders fetched from `/api/orders/user/:userId`
- User info from localStorage
- Date formatting for locale (Indian format)
- Price formatting with currency symbol

## Performance

- Orders load quickly
- Expandable sections minimize initial render
- Lazy loading of order details
- Responsive to user interactions
- Mobile optimized

## Security

- Only authenticated users can view orders
- Users only see their own orders
- User ID from localStorage
- Backend validates access
- Token-based authentication

## Accessibility

- Clear status indicators
- Emoji for visual recognition
- Color-coded status badges
- Readable typography
- Touch-friendly buttons on mobile

## Future Enhancements

Possible additions:
- Print order receipt
- Download order PDF
- Cancel order option
- Reorder from previous order
- Order tracking map
- Real-time order notifications
- Contact seller from order
- Review and rate products
- Return request from order

---

## Troubleshooting

### I see "Please login first"
- Click the login link to sign in
- Create account if you don't have one
- Your orders will appear after login

### My orders don't show up
- Ensure you're logged in with correct account
- Try refreshing the page
- Orders only appear after checkout completion
- Check if order was placed successfully

### Order status not updating
- Statuses update periodically
- Refresh page to see latest status
- Contact support if status seems wrong
- Check order confirmation email

### Missing order details
- Try refreshing the page
- Click the order card to expand
- All details should load
- Contact support if issue persists

---

**Happy shopping and tracking! 🛍️📦**
