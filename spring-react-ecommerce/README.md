# Amazona — Enterprise Java Full Stack E-Commerce Platform

A feature-rich, high-performance, portfolio-grade Java Full Stack E-Commerce platform built with **Spring Boot 3**, **Java 17/21**, **React**, **Redux**, **MongoDB**, **OpenAPI / Swagger UI**, and **Docker**.

---

## 🚀 Key Features

### 🛒 Modern Customer Experience
- **Interactive Product Catalog (35+ Products)**: Responsive grid with real-time keyword search, category filtering (Shirts, Pants, Shoes, Accessories), price sorting, stock badges, and star ratings.
- **Product Details & Customer Reviews**: Full product details, specifications, real-time stock indicator, star-rating review submission with toast feedback.
- **Advanced Shopping Cart & Promo Engine**:
  - Real-time quantity adjustment & subtotal calculations.
  - Multi-code discount engine: `WELCOME10` (10% off), `AMAZONA500` (₹500 flat off), and `FREESHIP` (Free express shipping).
  - Dynamic Free Shipping progress threshold (Free above ₹1,999).
- **24/7 AI Live Support Chat**: Interactive floating virtual assistant (`SupportChatWidget`) providing instant answers for order tracking, 7-day returns, payments, and shipping.

### 💳 Complete Payment Suite
- **📱 Instant UPI Payments**: Interactive VPA / UPI ID verification, simulated QR code scanning, and one-tap launch for Google Pay, PhonePe, Paytm, and BHIM.
- **🏦 Card & NetBanking**: Interactive visual card preview with live cardholder and expiry reflection, and top Indian bank selection (HDFC, SBI, ICICI, Axis, Kotak, PNB).
- **💵 Cash on Delivery (COD)**: Transparent doorstep payment verification.

### 📦 Order Lifecycle & Fulfillment
- **Checkout Wizard**: Seamless step-by-step checkout navigation (Sign In → Shipping Address → Payment Method → Place Order).
- **Live Order Status Tracking**: Real-time status indicators for Processing, Paid, Delivered, Cancelled, and Returned orders.
- **Cancellation & Refunds**: In-app modal cancellation with reason selection and automatic refund processing notification.
- **Returns & Replacements**: 7-day return / item exchange request submission workflow.

### 📊 Executive Business Intelligence Dashboard (Admin)
- **Live Sales & Volume KPIs**: Today's Orders, Today's Revenue, Lifetime Sales, Total Registered Users, and Average Order Value (AOV).
- **Payment Method Split**: Visual percentage and value breakdown across UPI, NetBanking/Cards, and Cash on Delivery.
- **Top Demanded Products Intelligence**: Ranked table of best-selling products by units sold and revenue, with demand badges (`🔥 Hot Demand`, `⚡ High Demand`, `⭐ Trending`).
- **7-Day Revenue Trend Chart**: Daily visual bar chart tracking volume and revenue performance.
- **Fulfillment Pipeline**: Real-time status breakdown for Processing, Delivered, Cancelled, and Returned orders.
- **Catalog & Order Management**: Full CRUD for products with image upload, order delivery confirmation, and admin summaries.

---

## 🛠️ Architecture & Tech Stack

```
                     ┌──────────────────────────────────┐
                     │          React Frontend          │
                     │  (React, Redux, Axios, CSS Grid) │
                     └────────────────┬─────────────────┘
                                      │ HTTP / REST APIs (JSON / JWT)
                                      ▼
                     ┌──────────────────────────────────┐
                     │     Spring Boot REST Backend     │
                     │ (Controller -> Service -> Repo)  │
                     │  + Global Exception Handler      │
                     │  + OpenAPI / Swagger UI          │
                     │  + Spring Actuator Monitoring    │
                     └────────────────┬─────────────────┘
                                      │ Spring Data MongoDB
                                      ▼
                     ┌──────────────────────────────────┐
                     │             MongoDB              │
                     └──────────────────────────────────┘
```

| Layer | Technology & Implementation Details |
|---|---|
| **Frontend** | React, Redux, Redux Thunk, React Router, Custom CSS Design System with Glassmorphism & Animations |
| **Java Backend** | Java 17/21, Spring Boot 3.2.5, Spring Security (Stateless JWT), Spring Data MongoDB, Bean Validation (`@Valid`) |
| **API Documentation** | OpenAPI 3.0 / Swagger UI (`springdoc-openapi-starter-webmvc-ui`) |
| **Observability** | Spring Boot Actuator (`/actuator/health`, `/actuator/metrics`) |
| **Database** | MongoDB (`amazona` database) with resilient fallback in-memory data seeder |
| **Containerization** | Docker, Docker Compose (Multi-stage build) |

---

## 📖 Live API Documentation & Endpoints

When the Spring Boot backend is running, explore interactive Swagger docs at:
👉 **`http://localhost:5000/swagger-ui/index.html`** or **`http://localhost:5000/v3/api-docs`**

- **Health Check**: `http://localhost:5000/actuator/health`
- **Product APIs**: `GET /api/products`, `GET /api/products/{id}`, `POST /api/products/{id}/reviews`
- **User APIs**: `POST /api/users/signin`, `POST /api/users/register`, `PUT /api/users/profile`
- **Order APIs**: `POST /api/orders`, `GET /api/orders/mine`, `PUT /api/orders/{id}/pay`, `GET /api/orders/summary`

---

## 🔑 Default Accounts

| Role | Email | Password | Access & Features |
|---|---|---|---|
| **Company Admin** | `admin@example.com` | `1234` | Full access to Executive Dashboard (`/dashboard`), Product Management (`/products`), Order Fulfillment (`/orders`) |
| **Customer User** | `user@example.com` | `1234` | Catalog browsing, Cart, Promo discounts, UPI / Card / COD Checkout, Order tracking & Returns |

---

## 🏃 Quick Start Guide

### Prerequisites
- **JDK 17+**
- **Node.js 16+**
- **MongoDB** *(Optional — in-memory fallback ensures seamless execution even without MongoDB)*

### 1. Launch Spring Boot Backend (Port 5000)
```bash
cd spring-backend
./mvnw spring-boot:run
# Windows PowerShell: .\mvnw.cmd spring-boot:run
```

### 2. Launch React Frontend (Port 3001)
```bash
cd frontend
npm install
npm start
```
Open **`http://localhost:3001`** in your browser.

---

## 🧪 Automated Testing

Execute the test suite across the service and security layers:

```bash
cd spring-backend
./mvnw test
# Windows PowerShell: .\mvnw.cmd test
```

**All 18 automated unit and integration test cases pass with 0 failures**:
- `ProductServiceTest`: Catalog filtering, category queries, price sorting, seeding, and review calculation.
- `UserServiceTest`: Authentication, BCrypt password validation, duplicate checks, and JWT token issuance.
- `OrderServiceTest`: Order placement, payment confirmation, cancellation, return processing, and analytics summary.
- `EcommerceApplicationTest`: Spring Boot context startup and bean lifecycle validation.

---

## 📌 Project Structure

```
├── spring-backend/           # Production Java Spring Boot 3 Backend
│   ├── src/main/java/com/amazona/
│   │   ├── config/           # OpenAPI Swagger Config, WebMvcConfig & DataSeeder Runner
│   │   ├── controller/       # REST Controllers (Product, User, Order, Upload, Config)
│   │   ├── dto/              # Data Transfer Objects (AuthResponse, LoginRequest, etc.)
│   │   ├── exception/        # Global Exception Handler & Custom Exception Classes
│   │   ├── model/            # Mongo Document Entities (User, Product, Order, Payment, etc.)
│   │   ├── repository/       # Spring Data Mongo Repositories
│   │   ├── security/         # Spring Security & Stateless JWT Filter
│   │   └── service/          # Business Service Interfaces & Implementation Classes
│   ├── src/test/java/        # JUnit 5 & Mockito Unit Tests (18 Passing Tests)
│   ├── pom.xml               # Maven Project Dependencies
│   └── Dockerfile            # Backend Dockerfile
├── frontend/                 # React Single Page Application
│   ├── src/
│   │   ├── actions/          # Redux Action Creators
│   │   ├── components/       # UI Components (SupportChatWidget, Rating, CheckoutSteps)
│   │   ├── reducers/         # Redux State Reducers
│   │   ├── screens/          # Screens (HomeScreen, DashboardScreen, CartScreen, OrderScreen, etc.)
│   │   └── index.css         # Custom Design System (Glassmorphism & Responsive Layout)
│   ├── package.json
│   └── Dockerfile            # Frontend Dockerfile
├── docker-compose.yml        # Full Stack Docker Orchestration
└── README.md
```

---

## 👤 Author
Developed and maintained by **[vedantkulkar](https://github.com/vedantkulkar)**.
