# Inventory Management System

A modern, full‑stack inventory management system built with **Next.js App Router**, **TypeScript**, **Prisma**, and **PostgreSQL**.  
Designed as a growing **SaaS-style application**, focusing on clean UX, scalability, and real-world inventory workflows.

---

## ✨ Features

### Core Inventory

- Product CRUD (Create, Read, Update, Delete)
- Product images with UploadThing
- Stock quantity tracking
- Low-stock threshold alerts
- Pagination & search

### Organization

- Categories
- Subcategories
- SKU support
- Price management

### UI / UX

- Card-based inventory view
- Image previews
- Responsive layout
- Dark mode support
- Modern landing page

### Authentication

- User-based inventory isolation
- Secure server actions

---

## 🧱 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes & Server Actions
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Stack Auth
- **File Uploads**: UploadThing
- **Language**: TypeScript

---

## 📁 Project Structure

```
app/
 ├─ api/              # API routes
 ├─ inventory/        # Inventory pages
 ├─ components/       # Reusable UI components
 ├─ theme-provider.tsx
 └─ page.tsx          # Landing page

lib/
 ├─ actions/          # Server actions
 ├─ prisma.ts
 └─ auth.ts

prisma/
 └─ schema.prisma

src/
 └─ utils/            # Helpers & serializers
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dev-gervinmon/inventory-management.git
cd inventory-management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://...
UPLOADTHING_SECRET=...
UPLOADTHING_APP_ID=...
```

### 4. Prisma setup

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Run the app

```bash
npm run dev
```

---

## 🗺️ Roadmap

Planned features (see `todo.txt` for full list):

- ✅ Categories & Subcategories
- ⏳ Bulk product import (CSV)
- ⏳ Inventory history & audit logs
- ⏳ Role-based access (Admin / Staff)
- ⏳ Analytics dashboard
- ⏳ Multi-warehouse support
- ⏳ Public API & webhooks
- ⏳ Subscription & billing (SaaS)

---

## 🧠 Design Philosophy

- **Server-first** with minimal client JS
- **Clear data ownership per user**
- **Scalable schema**
- **Readable code over clever code**
- **UX before features**

---

## 📜 License

MIT License.

---

## 👤 Author

**Gervin Mon**  
GitHub: https://github.com/dev-gervinmon

---

If you find this project useful, feel free to ⭐ the repo!
