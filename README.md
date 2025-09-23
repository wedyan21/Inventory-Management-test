# Inventory Management System

A full-stack inventory management system built with React, TypeScript, Node.js, Express, and MySQL.

## Features

- **Item Management**: Create, read, update, and delete inventory items
- **User Management**: Role-based access control (Admin, Editor, Viewer)
- **Reports**: Generate comprehensive inventory reports
- **Authentication**: Secure login system with JWT tokens
- **Responsive Design**: Modern UI that works on all devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT tokens with bcrypt password hashing

## Setup Instructions

### 1. Database Setup

1. Install MySQL and create a database:
```sql
CREATE DATABASE IF NOT EXISTS inventory_system;
```

2. Run the initialization script:
```bash
mysql -u root -p inventory_system < server/init-db.sql
```

### 2. Environment Configuration

1. Update the database credentials in `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=inventory_system
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key_here
PORT=3001
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

Start the backend server:
```bash
npm run server
```

In a new terminal, start the frontend:
```bash
npm run dev
```

## Default Users

The system comes with demo accounts:

- **Admin**: `admin` / `password` (Full access)
- **Editor**: `editor` / `password` (Can manage inventory and reports)
- **Viewer**: `viewer` / `password` (Read-only access)
- **Wedyan**: `Wedyan` / `123**Wed` (Admin access)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Users
- `GET /api/users` - Get all users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Reports
- `GET /api/reports` - Get report data (Admin/Editor only)

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `password` - Hashed password
- `role` - User role (admin, editor, viewer)

### Items Table
- `id` - Primary key
- `item_no` - Item number (optional)
- `name` - Item name
- `office` - Office location
- `qty` - Total quantity
- `remaining_qty` - Remaining quantity
- `quantity_sold` - Quantity sold
- `exit_date` - Exit date (optional)
- `image_path` - Image path (optional)
- `created_at` - Creation timestamp