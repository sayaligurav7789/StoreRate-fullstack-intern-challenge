# ⭐ StoreRate — Store Rating Platform

A full-stack web application where users can discover registered stores and submit **1–5 star ratings with optional written feedback**.

StoreRate supports a single login system with three role-based experiences:

- 🛡️ **System Administrator**
- 👤 **Normal User**
- 🏪 **Store Owner**

Each role has its own dashboard, permissions, and workflows.

---

### 🌐 Live Demo

| Service | Link |
|---|---|
| 🌎 Frontend | `https://store-rate-fullstack-intern-challen.vercel.app` |
| ⚙️ Backend API | `https://storerate-fullstack-intern-challenge.onrender.com` |
| 📦 Repository | `https://github.com/sayaligurav7789/StoreRate-fullstack-intern-challenge` |

> The backend may take a few seconds to respond after a period of inactivity on free hosting.
---

### 🔑 Demo Accounts

| Role | Email | Password |
|---|---|---|
| 🛡️ System Administrator | `admin@storerating.com` | `Admin@1234` |
| 🏪 Store Owner | `owner1@storerating.com` | `Owner@1234` |
| 👤 Normal User | `sayali123@gmail.com` | `Sayali@123` |

> These credentials are provided for demonstration/testing purposes.

---

### 🧰 Tech Stack

<p>
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
</p>
<p>
  <img alt="Express" src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img alt="JWT" src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

| Layer | Technology | Icon |
|---|---|:---:|
| Frontend | React + Vite | <img src="https://skillicons.dev/icons?i=react" height="28" /> |
| Styling | Tailwind CSS | <img src="https://skillicons.dev/icons?i=tailwind" height="28" /> |
| API Client | Axios | 🔗 |
| Backend | Node.js | <img src="https://skillicons.dev/icons?i=nodejs" height="28" /> |
| API Framework | Express.js | <img src="https://skillicons.dev/icons?i=express" height="28" /> |
| Database | PostgreSQL | <img src="https://skillicons.dev/icons?i=postgres" height="28" /> |
| ORM | Prisma | <img src="https://skillicons.dev/icons?i=prisma" height="28" /> |
| Authentication | JWT + bcrypt | 🔐 |
| Validation | express-validator | ✅ |
| Testing | Jest + Supertest | <img src="https://skillicons.dev/icons?i=jest" height="28" /> |
| Version Control | Git + GitHub | <img src="https://skillicons.dev/icons?i=github" height="28" /> |
| Deployment | Vercel + Render | ☁️ |

---

### ✨ Key Features

-  JWT-based authentication
-  bcrypt password hashing
-  Three role-based user types
-  System Administrator dashboard
-  Normal User store browsing
-  Store Owner analytics dashboard
-  1–5 star ratings
-  Optional written feedback/comments
-  Update previously submitted ratings
-  Store and user search
-  Filtering by relevant fields
-  Ascending/descending sorting
-  Dashboard statistics
-  Store Owner customer/rating information
-  Client-side validation
-  Server-side validation
-  Jest + Supertest backend tests
-  PostgreSQL + Prisma ORM
-  Responsive React interface
-  Production deployment with Vercel and Render

---

### 📁 Folder Structure
```
store-rating-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # User / Store / Rating models, Role enum
│   │   └── seed.js            # Sample admin, owners, users, stores, ratings
│   ├── src/
│   │   ├── controllers/       # authController, adminController, storeController, ratingController
│   │   ├── middleware/        # auth (JWT + role guard), validate, errorHandler
│   │   ├── routes/            # authRoutes, adminRoutes, storeRoutes, ratingRoutes
│   │   ├── utils/             # prismaClient singleton, express-validator rule builders
│   │   ├── app.js             # Express app (middleware + routes)
│   │   └── server.js          # Entry point
│   ├── tests/app.test.js      # Jest + Supertest tests
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js       # Axios instance with JWT interceptor
│   │   ├── context/AuthContext.jsx
│   │   ├── components/        # Navbar, ProtectedRoute, StarRating, DataTable, Modal, etc.
│   │   ├── pages/              # Login, Signup, ChangePassword, AdminDashboard, AdminUsers,
│   │   │                       # AdminStores, UserStores, StoreOwnerDashboard, NotFound
│   │   ├── utils/validation.js
│   │   ├── App.jsx             # Routes
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
└── README.md   ← you are here
```
---

### 🏗️ Application Architecture
```mermaid
flowchart TD
    A["User"]

    B["React + Vite<br/>Tailwind CSS"]

    C["Axios + JWT"]

    D["Express REST API"]

    E["Prisma ORM"]

    F["PostgreSQL"]

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F

    D --> D1["Authentication"]
    D --> D2["Authorization"]
    D --> D3["Validation"]
    D --> D4["Controllers"]

    F --> F1["Users"]
    F --> F2["Stores"]
    F --> F3["Ratings"]
    F --> F4["Reviews"]

    classDef frontend fill:#f0f7ff,stroke:#93c5fd,color:#1e3a5f,stroke-width:1px;
    classDef api fill:#f5f3ff,stroke:#c4b5fd,color:#3b2f6b,stroke-width:1px;
    classDef database fill:#f0fdf4,stroke:#86efac,color:#14532d,stroke-width:1px;
    classDef detail fill:#fafafa,stroke:#d1d5db,color:#374151,stroke-width:1px;

    class A,B,C frontend;
    class D,E api;
    class F database;
    class D1,D2,D3,D4,F1,F2,F3,F4 detail;

    linkStyle default stroke:#94a3b8,stroke-width:1.5px;
```
---

### ✅ Prerequisites

| Requirement | Version |
|---|---|
|  Node.js | 18+ |
|  npm | latest |
|  PostgreSQL | 13+ (local or hosted) |
|  Git | any recent version |

---

### 🗄️ Database Schema

StoreRate uses **PostgreSQL** with **Prisma ORM** to manage users, stores, ratings, and relationships.

| Table | Key Columns | Description |
|---|---|---|
| `users` | `id`, `name`, `email`, `password`, `address`, `role` | Stores authentication details and user roles |
| `stores` | `id`, `name`, `email`, `address`, `ownerId` | Stores registered stores and their optional owners |
| `ratings` | `id`, `value`, `comment`, `userId`, `storeId` | Stores ratings and optional written feedback |

### 🔗 Database Relationships

- A **Store Owner** can own one store.
- A **Store** can have multiple ratings.
- A **User** can submit multiple ratings.
- A user can submit **only one rating per store**.
- Existing ratings can be updated.
- Deleting a user cascades to their ratings.
- Deleting a store cascades to its ratings.

### ⭐ Rating Constraints

| Field | Rule |
|---|---|
| `value` | Integer from 1–5 |
| `comment` | Optional, maximum 500 characters |
| `userId + storeId` | Unique combination |
| `storeId` | Indexed |
| `userId` | Indexed |
| `role` | Indexed |

> The `userId + storeId` unique constraint ensures that each user can rate a particular store only once while still allowing them to update their existing rating.
---
### 🔐 Authentication Flow

1. User logs in with email and password.
2. Backend validates the credentials.
3. Password is verified using bcrypt.
4. Server generates a JWT.
5. Frontend stores the authenticated session.
6. Axios attaches the JWT to protected API requests.
7. Backend verifies the token and checks the user's role.
---

### ⚙️ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```
---

### 💻 Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
---
### 🧪 Backend Tests

```bash
cd backend
npm test
```
- Runs Jest + Supertest against the Express app (health check + validation-layer tests
that don't require a live database connection).
---
### 📋 Feature Checklist

### 🛡️ System Administrator

- [x] Add new stores
- [x] Add normal users
- [x] Add administrator users
- [x] Dashboard statistics
- [x] Total registered users
- [x] Total registered stores
- [x] Total ratings
- [x] View stores
- [x] Search and filter stores
- [x] Sort stores
- [x] View users
- [x] Search and filter users
- [x] Sort users
- [x] View user details
- [x] View Store Owner rating information
- [x] Logout

---

### 👤 Normal User

- [x] Signup
- [x] Single login endpoint for all roles
- [x] Update password
- [x] View registered stores
- [x] Search stores by name
- [x] Search stores by address
- [x] View overall store rating
- [x] View personal rating
- [x] Submit 1–5 star rating
- [x] Modify existing rating
- [x] Add optional written feedback
- [x] Logout

---

### 🏪 Store Owner

- [x] Login
- [x] Update password
- [x] Store Owner dashboard
- [x] View users who rated the store
- [x] View average rating
- [x] View customer feedback
- [x] Logout
---

### ✅ Validation
*(enforced both client-side for UX and server-side via express-validator — server is authoritative)*

| Field | Rule |
|---|---|
| Name | 20–60 characters |
| Address | Max 400 characters |
| Password | 8–16 characters, ≥1 uppercase, ≥1 special character |
| Email | Standard format validation |

### 🔩 Other
- [x] All listing tables support ascending/descending sort on key fields
- [x] Passwords hashed with bcrypt; auth via JWT bearer tokens
- [x] Role-based route guards on both API (`authorize()` middleware) and frontend (`ProtectedRoute`)
---

## 🚀 Pushing to GitHub

From the **project root** (the folder containing `backend/` and `frontend/`):

```bash
git init
git add .
git commit -m "Initial commit: full-stack store rating platform"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

> `.env` files are excluded via `.gitignore` in both `backend/` and `frontend/` — only
> `.env.example` is committed, so no secrets end up in the repo.

---

## 👩‍💻 Author
### **Sayali Gurav 🌱**

![CS](https://img.shields.io/badge/Computer%20Science%20Engineer-0A66C2?style=for-the-badge)
![FullStack](https://img.shields.io/badge/Full--Stack%20Developer-6E40C9?style=for-the-badge)
![DSA](https://img.shields.io/badge/DSA%20%26%20Algorithm%20Visualization-F97316?style=for-the-badge)

---

🔗 **Connect with me**

[![GitHub](https://img.shields.io/badge/GitHub-000000?style=for-the-badge&logo=github)](https://github.com/sayaligurav7789)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/sayali-gurav-9a3a302a5)
[![Portfolio](https://img.shields.io/badge/Portfolio-14B8A6?style=for-the-badge&logo=vercel&logoColor=white)](https://sayali-gurav7789-portfolio.vercel.app)
[![LeetCode](https://img.shields.io/badge/LeetCode-F89F1B?style=for-the-badge&logo=leetcode)](https://leetcode.com/sayaliGurav)
[![Email](https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:sayligurab7789@gmail.com)

---

