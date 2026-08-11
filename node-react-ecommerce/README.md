# Amazona — Full-Stack E-Commerce Application

A feature-rich, high-performance E-Commerce platform built with **React**, **Redux**, **Node.js / Express**, **MongoDB**, and **Java Spring Boot**.

---

## 🚀 Key Features

### 🛒 Shopping Experience
- **Interactive Product Catalog**: Grid view with real-time search filtering, category sorting, price filters, and star ratings.
- **Product Details Page**: Full product details, image galleries, stock availability badges, and user reviews.
- **Shopping Cart**: Dynamic quantity updates, item subtotal calculation, instant item removal, and persistent cart state.

### 💳 Interactive Payment Suite
- **UPI Payments**: Interactive VPA entry, live QR Code scanning simulation, and quick launch buttons for Google Pay, PhonePe, Paytm, and BHIM.
- **Card & NetBanking**: Credit/Debit card form with live visual card preview, auto network recognition (Visa/Mastercard), and bank selection for NetBanking.
- **Cash on Delivery (COD)**: Order verification and instant COD confirmation.
- **PayPal Integration**: Integrated PayPal JS SDK button with fallback options.

### 🚚 Order & Customer Management
- **Checkout Wizard**: Seamless step-by-step navigation (Sign In → Shipping Address → Payment Method → Place Order).
- **Order Status Tracking**: Live status indicators for Paid, Pending Payment, Delivered, and Canceled orders.
- **Cancellation & Refunds**: In-app order cancellation modal with reason selection and refund processing notification.
- **Returns & Replacements**: In-app return or item replacement request submission.
- **User Profile**: Order history log, user details, and profile management.
- **Admin Dashboard**: Manage products, create/edit catalog items, upload images, and manage customer orders.

---

## 🛠️ Architecture & Tech Stack

| Component | Technology |
|---|---|
| **Frontend** | React, Redux, React Router, Vanilla CSS (Glassmorphism & CSS Variables) |
| **Node.js Backend** | Express.js, Mongoose, JWT Authentication, Multer |
| **Java Backend** | Spring Boot, Spring Data JPA, Spring Security |
| **Database** | MongoDB |

---

## 🏃 Local Setup & Execution

### Prerequisites
- **Node.js** (v14+)
- **MongoDB** (running locally on port `27017` or MongoDB Atlas URI)
- **Java Development Kit (JDK 17+)** *(Optional, if using Spring backend)*

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/vedantkulkar/Ecommerce-Site.git
cd Ecommerce-Site
npm install
```

### 2. Running with Node.js Backend + React Frontend (Recommended)
Open two terminal tabs:
```bash
# Terminal 1: Backend Server (Port 5000)
npm run start:node

# Terminal 2: React Frontend App (Port 3000)
npm run start:frontend
```

### 3. Running with Spring Boot Backend + React Frontend
```bash
# Terminal 1: Spring Boot Backend
npm run start:spring

# Terminal 2: React Frontend App (Port 3000)
npm run start:frontend
```

---

## 📌 Project Structure

```
├── backend/                  # Node.js / Express Server
│   ├── models/               # Mongoose Data Models (User, Product, Order)
│   ├── routes/               # API Endpoints (userRoute, productRoute, orderRoute, uploadRoute)
│   ├── config.js             # Configuration & Environment Variables
│   └── server.js             # Express Application Entry Point
├── spring-backend/           # Java Spring Boot Backend Service
│   └── src/main/java/com/amazona/
│       ├── controller/       # REST Controllers
│       ├── model/            # JPA Entity Models
│       └── repository/       # Data Repositories
├── frontend/                 # React Single Page Application
│   ├── src/
│   │   ├── actions/          # Redux Action Creators
│   │   ├── components/       # Shared UI Components (PaypalButton, CheckoutSteps, etc.)
│   │   ├── reducers/         # Redux Reducers
│   │   ├── screens/          # Application Screens (HomeScreen, ProductScreen, OrderScreen, etc.)
│   │   └── index.css         # Custom Styling System
│   └── package.json
└── README.md
```

---

## 👤 Author
Developed and maintained by **[vedantkulkar](https://github.com/vedantkulkar)**.
