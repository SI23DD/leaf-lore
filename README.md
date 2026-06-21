# Leaf & Lore — Backend API (Express.js)

Express.js + TypeScript REST API for the Leaf & Lore bookshop.

## Setup
1. Install: `npm install`
2. Copy .env.example to .env and fill in your Supabase credentials
3. Dev: `npm run dev` (runs on port 4000)
4. Production build: `npm run build && npm start`

## Endpoints
- GET/POST /api/books
- GET/PUT/DELETE /api/books/:id
- GET/POST /api/orders
- GET/PUT /api/orders/:id
- POST /api/auth/login
- POST /api/auth/register
- GET /api/admin/stats
- POST /api/admin/auth

## Deploy
Deploy to Railway or Render (free tier). Set environment variables there.
