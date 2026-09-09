# 🛒 TechStore - Full-Stack E-Commerce Application

TechStore is a full-stack e-commerce web application built as a portfolio project using the MERN stack.

The application provides a complete online shopping experience, including product browsing, search and filtering, user authentication, wishlist management, shopping cart, checkout, order management, product reviews, returns, and user profile management.

It also includes a dedicated Admin Dashboard for managing products, orders, returns, users, and store statistics.

## 🌐 Live Demo

**Live Website:**  
https://tech-shop-ecommerce-ten.vercel.app/

**Source Code:**  
https://github.com/HISHAM-HUSSAIN-DEV/TechShop-Ecommerce

> Note: This project is a portfolio/demo application. Payment methods such as Google Pay and PayPal are displayed for demonstration purposes and are not connected to real payment gateways.

---

## ✨ Key Features

### 👤 Customer Features

- User registration and authentication
- Product browsing
- Product search
- Category filtering
- Product sorting
- Product details
- Shopping cart
- Cart quantity and stock validation
- Wishlist
- Checkout
- Order history
- Order details
- Order cancellation
- Product return requests
- Product ratings and reviews
- Profile management
- Password management
- Responsive design for desktop and mobile

### 🛡️ Admin Features

- Protected Admin Dashboard
- Store statistics
- Product management (Create, Read, Update, Delete)
- Order management
- Order status management
- Return request management
- Return and refund workflow
- User management
- Product stock management
- Automatic stock updates for orders, cancellations, and returns

---



## 🛠️ Tech Stack

### Frontend

- React
- React Router
- Tailwind CSS
- React Icons
- Context API
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- REST API

### Database

- MongoDB Atlas

### Deployment

- Vercel — Frontend
- Render — Backend API
- MongoDB Atlas — Cloud Database

### Development Tools

- Visual Studio Code
- Git
- GitHub
- npm
- MongoDB Compass

---

## 🔐 Authentication & Authorization

TechStore uses JWT-based authentication to manage user sessions and protect private routes.

The application supports two user roles:

- **User** — Access to shopping, wishlist, checkout, orders, reviews, returns, and profile features.
- **Admin** — Access to the protected Admin Dashboard and store management features.

Protected backend routes verify the user's JWT before allowing access, while admin routes also verify that the authenticated user has the `admin` role.

Passwords are securely hashed using bcrypt before being stored in the database.

---

## 📁 Project Structure

The project is organized into separate frontend and backend applications.

```text
TechShop-Ecommerce/
│
├── client/                     # React frontend
│   ├── src/
│   │   ├── assets/             # Images and static assets
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Auth and Cart contexts
│   │   ├── layouts/            # Application layouts
│   │   ├── pages/              # Application pages
│   │   │   ├── Admin/          # Admin dashboard pages
│   │   │   ├── Auth/           # Sign In and Sign Up
│   │   │   ├── Checkout/       # Checkout page
│   │   │   ├── Home/           # Product listing
│   │   │   ├── Products/       # Product details
│   │   │   └── Profile/        # User profile and account pages
│   │   ├── router/             # Application routing
│   │   └── index.jsx           # Frontend entry point
│   │
│   ├── .env                    # Frontend environment variables
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js / Express backend
│   ├── config/                 # Database configuration
│   ├── controllers/            # API business logic
│   ├── middleware/             # Authentication and authorization
│   ├── models/                 # Mongoose models
│   ├── routes/                 # REST API routes
│   ├── seed/                   # Admin seed script
│   ├── .env                    # Backend environment variables
│   ├── package.json
│   └── server.js               # Backend entry point
│
├── .gitignore
└── README.md
```

## 🔄 Main Application Flow

### Customer Flow

```text
Browse Products
      ↓
Product Details
      ↓
Add to Cart / Wishlist
      ↓
Cart
      ↓
Checkout
      ↓
Place Order
      ↓
Order History
      ↓
Cancel / Return / Review
```

### Admin Flow

```text
Admin Sign In
      ↓
Admin Dashboard
      ↓
Products / Orders / Returns / Users
      ↓
Manage Store Data and Order Workflows
```

---



## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/HISHAM-HUSSAIN-DEV/TechShop-Ecommerce.git
cd TechShop-Ecommerce
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The frontend will run locally using Vite, while the backend API will run on port `5000`.

> Never commit `.env` files or expose database credentials and JWT secrets in the repository.

---


## 🚀 Deployment

The application is deployed using separate services for the frontend, backend, and database.

### Frontend

The React frontend is deployed on **Vercel**.

**Live Demo:**  
https://tech-shop-ecommerce-ten.vercel.app/

### Backend

The Node.js and Express API is deployed on **Render**.

The frontend communicates with the deployed API using the `VITE_API_URL` environment variable.

### Database

The production database is hosted on **MongoDB Atlas**.

### Deployment Architecture

```text
User
  ↓
Vercel
React Frontend
  ↓
Render
Node.js / Express API
  ↓
MongoDB Atlas
Database
```

Environment variables and sensitive credentials are configured directly in the deployment platforms and are not stored in the repository.

The backend is hosted on Render's free tier, so the first request after a period of inactivity may take longer while the server starts.



## 📡 API Overview

The backend provides a RESTful API for products, users, orders, reviews, wishlists, and administrative operations.

### Products

```text
GET     /products
GET     /products/:id
POST    /products
PUT     /products/:id
DELETE  /products/:id
```

### Users & Authentication

```text
POST    /users/signup
POST    /users/signin
PUT     /users/profile
GET     /users/wishlist
PUT     /users/wishlist/:productId
```

### Orders

```text
POST    /orders
GET     /orders/my-orders
GET     /orders/:orderNumber
```

Order management also supports cancellation, return requests, and administrative order status updates.

### Reviews

```text
GET     /reviews/product/:productId
POST    /reviews/product/:productId
```

Users can submit product ratings and reviews, while review data is used to calculate product ratings.

### Admin

Protected admin endpoints provide functionality for:

- Dashboard statistics
- Product management
- Order management
- Return and refund management
- User management
- Stock management

> Protected endpoints require a valid JWT. Administrative endpoints additionally require the authenticated user to have the `admin` role.

---



## 📸 Screenshots

### 🏠 Home & Products

#### Home Page
![Home Page](screenshots/HomePage.png)

#### Category Navigation
![Category Navigation](screenshots/Home-selected-navBar.png)

#### Search
![Search](screenshots/SearchBar.png)

#### Product Details
![Product Details](screenshots/Product-Details.png)

---

### 👤 Customer Experience

#### Shopping Cart
![Shopping Cart](screenshots/User-Cart.png)

#### Checkout
![Checkout](screenshots/User-Checkout.png)

#### Account
![Account](screenshots/User-Account.png)

#### Orders
![Orders](screenshots/User-Orders.png)

#### Returns & Cancellations
![Returns and Cancellations](screenshots/User-Return-Cancel.png)

#### Ratings & Reviews
![Ratings and Reviews](screenshots/User-Rating-Reviews.png)

#### Wishlist
![Wishlist](screenshots/User-Wishlist.png)

#### Payment
![Payment](screenshots/User-Payment.png)

#### Change Password
![Change Password](screenshots/User-Change-Password.png)

#### Settings
![User Settings](screenshots/User-Settings.png)

---

### 🛡️ Admin Dashboard

#### Dashboard
![Admin Dashboard](screenshots/Admin-Dashboard.png)

#### Product Management
![Admin Products](screenshots/Admin-Product.png)

#### Edit Product
![Admin Product Edit](screenshots/Admin-Products-Edit.png)

#### Order Management
![Admin Orders](screenshots/Admin-Orders.png)

#### Return Management
![Admin Returns](screenshots/Admin-Returns.png)

#### User Management
![Admin Users](screenshots/Admin-Users.png)

---

### 🔐 Authentication

#### Sign Up
![Sign Up](screenshots/Sign-up.png)

#### Sign In
![Sign In](screenshots/Sign-In.png)

---

## 🗄️ Database Models

The application uses MongoDB with Mongoose for data storage and management.

### User

Stores user account information, authentication data, profile details, roles, and wishlist information.

### Product

Stores product information including:

- Name
- Description
- Price
- Category
- Stock
- Product image

### Order

Stores customer orders including:

- Ordered products
- Quantities
- Shipping information
- Payment method
- Order status
- Return status
- Order total

### Review

Stores product reviews and ratings submitted by users.

### Database Relationships

```text
User
 ├── Orders
 ├── Reviews
 └── Wishlist
        ↓
     Products

Order
 └── Products

Product
 └── Reviews
```

MongoDB Atlas is used as the production cloud database.

---


## 🔒 Security

The application includes several security measures to protect user data and restrict access to protected resources.

- Passwords are securely hashed using **bcrypt** before being stored in the database.
- Authentication is handled using **JSON Web Tokens (JWT)**.
- Protected API routes require a valid authentication token.
- Admin routes require both authentication and the `admin` role.
- New user registrations are assigned the `user` role by default.
- Sensitive credentials are stored in environment variables and are excluded from Git.
- Backend CORS configuration restricts access to the configured frontend origin.
- Product prices and order totals are validated and calculated on the backend instead of trusting client-side values.

> This project is a portfolio/demo application and does not process real payments.

---

## 👨‍💻 Author

**Hisham AlSaedi**

Computer Science graduate and Full-Stack Developer interested in building modern, responsive, and practical web applications.

### Connect with me

- GitHub: https://github.com/HISHAM-HUSSAIN-DEV
- LinkedIn: https://www.linkedin.com/in/hesham-alsaedi-6ab1a1406

---

## 📄 License

This project was developed as a portfolio project for educational and demonstration purposes.

---