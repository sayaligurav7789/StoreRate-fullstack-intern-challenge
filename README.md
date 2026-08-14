# ⭐ StoreRate — Store Rating Platform

A full-stack web app where users submit 1–5 star ratings for registered stores.
Single login, three roles (**System Administrator**, **Normal User**, **Store Owner**), each
with its own dashboard and permissions.

<p>
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img alt="JWT" src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

---

## 🧰 Tech Stack

| Layer | Technology | Icon |
|---|---|:---:|
|  Frontend | React (Vite) | <img src="https://skillicons.dev/icons?i=react" height="28" /> |
|  Frontend | Tailwind CSS | <img src="https://skillicons.dev/icons?i=tailwind" height="28" /> |
|  API Client | Axios | 🔗 |
|  Backend | Node.js | <img src="https://skillicons.dev/icons?i=nodejs" height="28" /> |
|  Backend | Express | <img src="https://skillicons.dev/icons?i=express" height="28" /> |
|  Database | PostgreSQL | <img src="https://skillicons.dev/icons?i=postgres" height="28" /> |
|  ORM | Prisma | <img src="https://skillicons.dev/icons?i=prisma" height="28" /> |
|  Auth | JWT + bcrypt | 🔐 |
|  Validation | express-validator | ✅ |
|  Testing | Jest + Supertest | <img src="https://skillicons.dev/icons?i=jest" height="28" /> |
---

## 📁 1. Project Structure

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

## ✅ 2. Prerequisites

| Requirement | Version |
|---|---|
|  Node.js | 18+ |
|  npm | latest |
|  PostgreSQL | 13+ (local or hosted) |
|  Git | any recent version |

---

## 🗄️ 3. Database Schema (via Prisma)

| Table | Key columns |
|---|---|
| `users` | `id`, `name` (20–60 chars), `email` (unique), `password` (bcrypt hash), `address` (≤400 chars), `role` (`SYSTEM_ADMIN` \| `NORMAL_USER` \| `STORE_OWNER`) |
| `stores` | `id`, `name`, `email` (unique), `address`, `ownerId` (nullable FK → users, 1:1 with a Store Owner) |
| `ratings` | `id`, `value` (1–5), `userId` (FK), `storeId` (FK), **unique(userId, storeId)** — one rating per user per store, updatable |

> Indexes are added on `role`, `storeId`, and `userId` for fast filtering/aggregation.

---

## ⚙️ 4. Backend Setup

```bash
cd backend
npm install

# Create your env file and edit DATABASE_URL / JWT_SECRET
cp .env.example .env

# Create the database (adjust user/password as needed)
psql -U postgres -c "CREATE DATABASE store_rating_db;"

# Generate the Prisma client and run the migration (creates all tables)
npx prisma generate
npx prisma migrate dev --name init

# Seed sample data (1 admin, 3 store owners, 5 normal users, 4 stores, ratings)
npm run seed

# Start the API (http://localhost:5000)
npm run dev
```

### 🔑 Seeded Login Credentials

| Role | Email | Password |
|---|---|---|
| 🛡️ System Administrator | `admin@storerating.com` | `Admin@1234` |
| 🏪 Store Owner | `owner1@storerating.com` | `Owner@1234` |
| 👤 Normal User | `alex.fitzgerald@example.com` | `User@1234` |

> See `backend/prisma/seed.js` for the full list — 3 owners and 5 normal users are created.

### 🧪 Backend Tests

```bash
cd backend
npm test
```

Runs Jest + Supertest against the Express app (health check + validation-layer tests
that don't require a live database connection).

---

## 💻 5. Frontend Setup

Open a **second terminal**:

```bash
cd frontend
npm install

cp .env.example .env
# VITE_API_URL should point at your backend, default http://localhost:5000/api

npm run dev
```

Visit **http://localhost:5173** 🚀

---

## ⚡ 6. Running Everything (Quick Reference)

```bash
# Terminal 1
cd backend && npm install && cp .env.example .env
npx prisma generate && npx prisma migrate dev --name init && npm run seed
npm run dev

# Terminal 2
cd frontend && npm install && cp .env.example .env
npm run dev
```

---

## 📋 7. Feature Checklist Against the Spec

### 🛡️ System Administrator
- [x] Add new stores, normal users, and admin users (`POST /api/admin/users`, `POST /api/admin/stores`)
- [x] Dashboard: total users, total stores, total ratings (`GET /api/admin/dashboard`)
- [x] View stores list — Name, Email, Address, Rating, sortable + filterable
- [x] View users list — Name, Email, Address, Role, sortable + filterable
- [x] Filter all listings by Name, Email, Address, Role
- [x] View any user's details, including Rating if they're a Store Owner
- [x] Logout

### 👤 Normal User
- [x] Signup (`POST /api/auth/signup`) and login (single login endpoint for all roles)
- [x] Update password after logging in
- [x] View all registered stores, with search by Name and Address
- [x] Store listing shows Name, Address, Overall Rating, the user's own submitted rating, and a control to submit/modify it
- [x] Submit ratings 1–5; modify a previously submitted rating (same endpoint upserts)
- [x] Logout

### 🏪 Store Owner
- [x] Login, update password, logout
- [x] Dashboard: list of users who rated their store + average rating (`GET /api/stores/owner/dashboard`)

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

## 🚀 8. Pushing to GitHub

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


**Recommended:** open two integrated terminals (one for `backend`, one for `frontend`) and run
`npm run dev` in each, as shown in section 6.

---
