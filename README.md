# Product Management System

Full-stack assignment using React.js, Node.js, Express.js and MySQL.

## Features
- Product CRUD
- Search by product name/code
- Category and status filters
- Client-side validation
- Delete confirmation
- Success/error messages
- Pagination (10/page)
- Sort by product name or price
- `created_at` and `updated_at` timestamps

## Requirements
- Node.js 18+
- MySQL 8+

## 1. Database
Run `database/schema.sql` in MySQL. It creates the database `product_management` and `products` table with sample records.

## 2. Backend
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and update MySQL credentials.

```bash
npm run dev
```
Backend runs at `http://localhost:5000`.

## 3. Frontend
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the URL printed by Vite, normally `http://localhost:5173`.

## API
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

`GET /api/products` supports `search`, `category`, `status`, `page`, `limit`, `sortBy`, and `sortOrder` query parameters.
