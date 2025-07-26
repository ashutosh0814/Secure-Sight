# SecuMetrics CCTV Monitoring Dashboard

A full-stack, type-safe, modern web application for monitoring and managing security incidents across multiple CCTV camera feeds.

---

## 🚀 Deployment Instructions (Vercel)

### 1. **Provision a PostgreSQL Database**
- Use [Neon](https://neon.tech/) (recommended for serverless) or any Postgres provider.
- Copy your database connection string (e.g., `postgres://...`).

### 2. **Configure Environment Variables**
- In Vercel dashboard, add an environment variable:
  - `DATABASE_URL` = your Postgres connection string

### 3. **Install & Build**
- Vercel will auto-detect and run the following:
  - `npm install`
  - `npm run build` (builds both frontend and backend)

### 4. **Database Migration & Seeding**
- **First-time setup:**  
  Run locally or via Vercel CLI:
  ```sh
  npm run db:push
  node server/seed.ts
  ```
  This applies schema and seeds demo data.

### 5. **Start the App**
- Vercel will run `npm start` (serves both API and frontend from a single server).

---

## 🛠️ Tech Decisions

- **Monorepo**: Shared types and schema between frontend (`client/`), backend (`server/`), and shared code (`shared/`).
- **Frontend**:  
  - React 18 + TypeScript
  - Vite (fast dev/build)
  - Tailwind CSS + shadcn/ui (customizable, accessible UI)
  - TanStack Query (React Query) for server state
  - Wouter (lightweight routing)
- **Backend**:  
  - Node.js + Express (REST API)
  - TypeScript (strict, ESM)
  - Drizzle ORM (type-safe, schema-first, serverless-ready)
- **Database**:  
  - PostgreSQL (Neon serverless recommended)
  - Drizzle migrations for schema management
- **Other**:  
  - Centralized error handling
  - Toast notifications for user feedback
  - Modern, responsive, dark-themed UI

---

## 🖥️ Features

- **Dashboard**: Three-panel layout (navbar, incident player, incident list)
- **Incident Management**:  
  - View, resolve, and track incidents
  - Real-time updates and optimistic UI
- **Camera Management**:  
  - List and view all cameras
- **Timeline**:  
  - Visualize incidents across time and cameras
- **User Experience**:  
  - Toast notifications, skeleton loaders, responsive design

---

## 🏗️ If I Had More Time...

- **Authentication**: Add secure user login, roles, and permissions
- **Live Video**: Integrate real-time video streams (WebRTC or HLS)
- **Websockets**: Push real-time incident updates to the dashboard
- **Advanced Filtering**: Incident search, filter by camera/type/date
- **Audit Logs**: Track user actions and incident history
- **Notifications**: Email/SMS/Push for critical incidents
- **Accessibility**: Full a11y audit and improvements
- **Testing**: Add unit, integration, and E2E tests
- **CI/CD**: Automated tests and linting on PRs
- **Cloud Storage**: Store thumbnails/videos in S3 or similar
- **Multi-tenant**: Support for multiple organizations/sites

---

## 📂 Project Structure

```
SecuMetrics/
  client/      # React frontend (Vite, Tailwind, shadcn/ui)
  server/      # Express backend (TypeScript, Drizzle ORM)
  shared/      # Shared types and schema
  attached_assets/ # Demo images/assets
  .env         # Environment variables (not committed)
```

---

## 📝 Scripts

- `npm run dev` — Start dev server (API + frontend, hot reload)
- `npm run build` — Build frontend and backend for production
- `npm start` — Start production server
- `npm run db:push` — Apply Drizzle migrations to database
- `node server/seed.ts` — Seed database with demo data

---

## 🧩 Environment Variables

- `DATABASE_URL` — PostgreSQL connection string

---

## 📦 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Wouter
- **Backend**: Node.js, Express, Drizzle ORM, TypeScript
- **Database**: PostgreSQL (Neon recommended)
- **Deployment**: Vercel

---

**Enjoy SecuMetrics!**  
For questions or improvements, open an issue or PR.
