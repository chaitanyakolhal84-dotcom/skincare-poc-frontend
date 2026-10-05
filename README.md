# Skincare POC Frontend

React/Vite frontend for the Skincare POC e-commerce application.

## Features

### Customer

- Registration and login
- Product browsing
- Product details
- Shopping cart
- Checkout
- Coupon application
- Order placement
- Order history
- Profile
- Rewards and referrals

### Admin

- Admin dashboard
- Product management
- Stock management
- Order management
- Promotion management
- Coupon management
- Home-page promotion control

## Technology Stack

- React
- Vite
- JavaScript
- CSS
- Axios
- React Router

## Project Structure

```text
frontend/
├── src/
│   ├── pages/
│   ├── services/
│   │   └── api.js
│   └── App.jsx
├── package.json
└── README.md
```

## Backend Requirement

The frontend connects to:

```text
http://localhost:5000/api
```

Start the backend before testing frontend API features.

## Installation

```powershell
cd "C:\Skincare POC\skincare-poc\frontend"
npm install
```

## Run Development Server

```powershell
npm run dev
```

Vite normally provides a URL similar to:

```text
http://localhost:5173
```

## Main Routes

### Customer

| Route | Page |
|---|---|
| `/` | Home |
| `/products` | Products |
| `/cart` | Cart |
| `/checkout` | Checkout |
| `/orders` | Orders |
| `/profile` | Profile |
| `/rewards` | Rewards |
| `/login` | Login |
| `/register` | Register |

### Admin

| Route | Page |
|---|---|
| `/admin` | Admin Dashboard |
| `/admin/products` | Manage Products |
| `/admin/orders` | Manage Orders |
| `/admin/promotions` | Manage Promotions |
| `/admin/coupons` | Manage Coupons |

## Authentication

After login, authentication information is stored in browser local storage.

Protected API requests use:

```text
Authorization: Bearer <token>
```

## Product Management

Admins can:

- Add products
- Edit products
- Delete products
- Update price
- Update stock quantity
- Manage product information

## Coupon Management

Admins can create and manage:

```text
PERCENTAGE
FIXED
BUY_X_GET_Y
```

Customers apply coupon codes during checkout. The backend validates the coupon and calculates the discount.

## Promotion Management

The Home page gets its promotion dynamically from:

```text
GET /api/promotions/active
```

Admins can:

- Create promotions
- Edit promotions
- Activate/deactivate promotions
- Show a promotion on Home
- Hide a promotion from Home
- Delete promotions

Only one promotion is selected for Home display at a time.

`isActive` and `showOnHome` are separate controls. Deactivating the current Home promotion does not automatically restore a previous promotion.

## API Service

API communication is centralized in:

```text
src/services/api.js
```

This service handles requests to the backend and authentication headers.

## Production Build

```powershell
npm run build
```

Preview:

```powershell
npm run preview
```

## Development Flow

```text
React Frontend
      |
      v
Axios API Service
      |
      v
Express Backend
      |
      v
MongoDB
```

## GitHub

Frontend repository:

https://github.com/chaitanyakolhal84-dotcom/skincare-poc-frontend

## Author

**Chaitanya Kolhal**
