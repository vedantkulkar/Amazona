# Amazona — Enterprise Java Full Stack E-Commerce Platform

[![Java](https://img.shields.io/badge/Java-17%2B-orange.svg?style=flat&logo=openjdk)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg?style=flat&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-16.12-blue.svg?style=flat&logo=react)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-4.0-purple.svg?style=flat&logo=redux)](https://redux.js.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0%2B-green.svg?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI%203.0-Swagger%20UI-success.svg?style=flat&logo=swagger)](http://localhost:5000/swagger-ui/index.html)
[![Tests](https://img.shields.io/badge/JUnit%205-18%20Passed-blueviolet.svg?style=flat&logo=junit5)](https://junit.org/junit5/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

A high-performance, portfolio-grade **Java Full Stack E-Commerce Web Application** engineered with **Spring Boot 3**, **Java 17**, **React**, **Redux**, and **MongoDB**. Features stateless JWT authentication, full payment gateway simulation (UPI, Cards, NetBanking, COD), order lifecycle management, an executive business intelligence analytics dashboard, and OpenAPI/Swagger documentation.

---

## 🌟 Key Features

### 🛒 Modern Customer Experience
- **Interactive Product Catalog (35+ Products)**: Responsive grid with real-time keyword search, category filtering (Shirts, Pants, Shoes, Accessories), price sorting, stock badges, and customer ratings.
- **Product Details & Customer Reviews**: Detailed views, image preview, stock indicators, and customer rating/review submission.
- **Advanced Shopping Cart & Promo Engine**:
  - Real-time quantity adjustment and instant subtotal recalculation.
  - Multi-code discount engine: `WELCOME10` (10% off), `AMAZONA500` (₹500 flat off), and `FREESHIP` (Free express shipping).
  - Dynamic Free Shipping progress threshold (Free above ₹1,999).
- **24/7 AI Live Support Chat**: Interactive virtual assistant widget providing instant answers for order tracking, 7-day returns, payment options, and shipping policies.

### 💳 Complete Payment Suite
- **📱 Instant UPI Payments**: Interactive VPA / UPI ID verification, QR Code modal with simulated scan, and quick-launch deep links for Google Pay, PhonePe, Paytm, and BHIM.
- **🏦 Cards & NetBanking**: Interactive visual card preview reflecting live cardholder name, expiry, and CVV, plus top Indian NetBanking selection (HDFC, SBI, ICICI, Axis, Kotak, PNB).
- **💵 Cash on Delivery (COD)**: Seamless doorstep payment confirmation workflow.

### 📦 Order Lifecycle & Fulfillment
- **Multi-Step Checkout Wizard**: Guided navigation (Sign In → Shipping Address → Payment Method → Review & Place Order).
- **Live Order Status Tracking**: Real-time tracking through Processing, Paid, Delivered, Cancelled, and Returned states.
- **Cancellation & Refunds**: Modal cancellation with reason selection and automatic simulated refund processing.
- **Returns & Replacements**: 7-day hassle-free return and replacement request workflow.

### 📊 Executive Business Intelligence Dashboard (Admin)
- **Live Sales & Volume KPIs**: Today's Orders, Today's Revenue, Lifetime Sales, Total Registered Users, and Average Order Value (AOV).
- **Payment Distribution Breakdown**: Visual percentage and value split across UPI, NetBanking/Cards, and Cash on Delivery.
- **Top Demanded Products Intelligence**: Ranked table of best-selling products by units sold and revenue, with dynamic demand badges (`🔥 Hot Demand`, `⚡ High Demand`, `⭐ Trending`).
- **7-Day Revenue Trend Chart**: Daily performance chart tracking sales revenue and order volume.
- **Fulfillment Pipeline**: Status counters for Processing, Delivered, Cancelled, and Returned orders.
- **Catalog & Order Management**: Full CRUD for products with image upload, order delivery confirmation, and admin summaries.

---

## 🛠️ Architecture & Tech Stack

```
                     ┌─────────────────────────────────────────┐
                     │             React Frontend              │
                     │  (React 16, Redux, Redux Thunk, Axios)  │
                     │    Glassmorphism UI & Responsive CSS    │
                     └────────────────────┬────────────────────┘
                                          │ RESTful HTTP / JSON (JWT Auth)
                                          ▼
                     ┌─────────────────────────────────────────┐
                     │        Spring Boot 3 REST Backend       │
                     │       (Controller → Service → Repo)     │
                     │   + Spring Security (Stateless JWT)     │
                     │   + Global Exception Handler            │
                     │   + OpenAPI 3.0 / Swagger UI            │
                     │   + Spring Boot Actuator                │
                     └────────────────────┬────────────────────┘
                                          │ Spring Data MongoDB
                                          ▼
                     ┌─────────────────────────────────────────┐
                     │                 MongoDB                 │
                     │  (Collections: users, products, orders) │
                     │   + Resilient In-Memory Fallback Seed   │
                     └─────────────────────────────────────────┘
```

| Layer | Technologies & Implementation |
|---|---|
| **Backend** | **Java 17**, **Spring Boot 3.2.5**, Spring Web MVC, Spring Security, Spring Data MongoDB |
| **Security** | Stateless JWT Authentication, BCrypt Password Hashing, Role-Based Access Control (Admin / User) |
| **API Docs & Monitoring** | OpenAPI 3.0 / Swagger UI (`springdoc-openapi-starter-webmvc-ui`), Spring Boot Actuator (`/actuator/health`) |
| **Database** | MongoDB (with resilient in-memory fallback seed data so the app runs even without MongoDB installed) |
| **Frontend** | React 16.12, Redux, Redux Thunk, React Router, Axios, Custom CSS Glassmorphism Design System |
| **Testing** | JUnit 5, Mockito, Spring Boot Test (`@SpringBootTest`, `@ExtendWith(MockitoExtension.class)`) |
| **DevOps & Tooling** | Maven Wrapper (`mvnw`), Docker, Docker Compose, One-Click Batch Launcher (`run-fullstack.bat`) |

---

## 📖 Live API Documentation

When the Spring Boot backend is running, explore interactive Swagger API docs:
- **Swagger UI**: [`http://localhost:5000/swagger-ui/index.html`](http://localhost:5000/swagger-ui/index.html)
- **OpenAPI JSON**: [`http://localhost:5000/v3/api-docs`](http://localhost:5000/v3/api-docs)
- **Health Check**: [`http://localhost:5000/actuator/health`](http://localhost:5000/actuator/health)

### Key Endpoints
| HTTP Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/users/signin` | Authenticate user & issue JWT | Public |
| `POST` | `/api/users/register` | Register a new user | Public |
| `PUT` | `/api/users/profile` | Update user profile | User / Admin |
| `GET` | `/api/products` | Query catalog with search, category & sort | Public |
| `GET` | `/api/products/{id}` | Get product details | Public |
| `POST` | `/api/products/{id}/reviews` | Submit product review & rating | User |
| `POST` | `/api/orders` | Place a new order | User |
| `GET` | `/api/orders/{id}` | Get order details | User / Admin |
| `PUT` | `/api/orders/{id}/pay` | Confirm payment (UPI / Card / NetBanking) | User |
| `PUT` | `/api/orders/{id}/cancel` | Cancel order with refund notification | User / Admin |
| `PUT` | `/api/orders/{id}/return` | Request return / replacement | User |
| `GET` | `/api/orders/mine` | View logged-in user's order history | User |
| `GET` | `/api/orders/summary` | Executive BI dashboard metrics | Admin |

---

## 🔑 Demo Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Company Admin** | `admin@example.com` | `1234` | Full access to Executive Dashboard (`/dashboard`), Product Management (`/products`), and Order Fulfillment (`/orders`) |
| **Customer User** | `user@example.com` | `1234` | Catalog browsing, Shopping Cart, Coupon Discounts, Checkout, Order Tracking, and Returns |

---

## 🚀 Quick Start Guide

### Prerequisites
- **JDK 17 or higher**
- **Node.js 16+ & npm** *(Used solely for running/building the React frontend)*
- **MongoDB** *(Optional — the backend includes an automated fallback seeder that populates sample data in memory if MongoDB is unavailable)*

---

### Option A: One-Click Startup (Windows)
Double-click [`spring-react-ecommerce/run-fullstack.bat`](spring-react-ecommerce/run-fullstack.bat) or run from PowerShell:
```powershell
.\spring-react-ecommerce\run-fullstack.bat
```
This automatically launches both the Spring Boot backend on port 5000 and the React frontend on port 3001 and opens the browser.

---

### Option B: Manual Startup

#### 1. Start the Java Spring Boot Backend (Port 5000)
```bash
cd spring-react-ecommerce/spring-backend
./mvnw spring-boot:run
# Windows PowerShell: .\mvnw.cmd spring-boot:run
```
> The backend will start on **`http://localhost:5000`**.

#### 2. Start the React Frontend (Port 3001)
```bash
cd spring-react-ecommerce/frontend
npm install
npm start
```
> The frontend will start on **`http://localhost:3001`** (or prompt to run on port 3001 if port 3000 is occupied).

---

## 🧪 Automated Testing

The backend includes a comprehensive test suite covering controllers, business services, and security:

```bash
cd spring-react-ecommerce/spring-backend
./mvnw test
# Windows PowerShell: .\mvnw.cmd test
```

### Test Suite Summary (18 Tests, 0 Failures)
- ✅ `ProductServiceTest`: Search, category filtering, price sorting, review calculation, and fallback seeding.
- ✅ `UserServiceTest`: Signin, BCrypt password hashing validation, duplicate email detection, and JWT generation.
- ✅ `OrderServiceTest`: Order creation, payment verification, order cancellation, returns, and BI summary calculations.
- ✅ `EcommerceApplicationTest`: Spring Boot context load and component scan verification.

---

## 📁 Repository Structure

```
├── spring-react-ecommerce/
│   ├── spring-backend/              # Java Spring Boot 3 Backend
│   │   ├── src/main/java/com/amazona/
│   │   │   ├── config/              # OpenAPI/Swagger, WebMvc & DataSeeder
│   │   │   ├── controller/          # REST Controllers (Product, User, Order, Config)
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── exception/           # Global Exception Handling
│   │   │   ├── model/               # MongoDB Document Models
│   │   │   ├── repository/          # Spring Data MongoDB Repositories
│   │   │   ├── security/            # Spring Security & Stateless JWT Filter
│   │   │   └── service/             # Business Logic & Service Implementations
│   │   ├── src/test/java/           # JUnit 5 & Mockito Tests (18 Passing Tests)
│   │   ├── pom.xml                  # Maven Dependencies & Configuration
│   │   └── Dockerfile               # Backend Multi-Stage Dockerfile
│   ├── frontend/                    # React Frontend
│   │   ├── src/
│   │   │   ├── actions/             # Redux Action Creators
│   │   │   ├── components/          # Reusable Components (SupportChatWidget, Rating, etc.)
│   │   │   ├── reducers/            # Redux Reducers
│   │   │   ├── screens/             # UI Screens (Dashboard, Cart, Products, Orders, etc.)
│   │   │   └── index.css            # Custom CSS Glassmorphism Design System
│   │   ├── package.json             # Frontend Dependencies & Scripts
│   │   └── Dockerfile               # Frontend Nginx Dockerfile
│   ├── run-fullstack.bat            # Windows One-Click Full Stack Launcher
│   ├── docker-compose.yml           # Multi-Container Full Stack Deployment
│   └── README.md                    # Subproject Reference
├── package.json                     # Root Orchestration Scripts
└── README.md                        # Primary Project Documentation
```

---

## 👤 Author

**Vedant Kulkarni**  
- GitHub: [@vedantkulkar](https://github.com/vedantkulkar)
- Project: [Amazona E-Commerce Platform](https://github.com/vedantkulkar/Amazona)
