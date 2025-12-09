# E-Commerce Full Stack Platform

A comprehensive, modern e-commerce platform built with React, Vite, Supabase, and TailwindCSS. This platform supports multi-vendor capabilities with separate admin and seller dashboards, complete payment integration, and a rich customer shopping experience.

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Available Scripts](#available-scripts)
- [Key Modules](#key-modules)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [Payment Integration](#payment-integration)
- [State Management](#state-management)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Roadmap](#roadmap)

---

## 🎯 Overview

This is a full-featured e-commerce platform that enables:

- **Customers** to browse products, manage carts/wishlists, place orders, and track deliveries
- **Sellers** to manage their product inventory, view sales analytics, and process orders
- **Admins** to oversee the entire marketplace, manage sellers, products, categories, brands, marketing campaigns, and system settings

## ✨ Features

### Customer Features

- 🛍️ Product browsing with advanced filtering and sorting
- 🔍 Search functionality across products
- 🛒 Shopping cart management
- ❤️ Wishlist functionality
- 👤 User profile and account management
- 📦 Order placement and tracking
- 💳 Multiple payment options (Khalti integration)
- ⭐ Product reviews and ratings
- 📱 Responsive mobile-friendly design
- 🎯 Flash sales and special deals
- 🏷️ Category and brand-based browsing

### Seller Features

- 📊 Seller dashboard with sales analytics
- 📦 Product inventory management
- 💰 Revenue tracking
- 📈 Sales reports and insights
- 🔔 Order notifications
- 👥 Customer management

### Admin Features

- 📊 Comprehensive admin dashboard
- 👥 Seller approval and management
- 📦 Product catalog oversight
- 🏷️ Category and brand management
- 💹 Sales analytics and reporting
- 🎯 Marketing campaign management (Flash Deals, Mega Deals, Coupons)
- 📧 Newsletter management
- 🔔 Dynamic popup management
- 💰 Commission and earnings tracking
- 🔍 User search history analytics
- 💳 Wallet recharge history
- ⚙️ System settings and configuration

---

## 🛠️ Tech Stack

### Frontend

- **React 18.3.1** - UI library
- **Vite 7.0.4** - Build tool and dev server
- **React Router DOM 7.7.1** - Client-side routing
- **TailwindCSS 3.4.17** - Utility-first CSS framework
- **TypeScript** - Type safety (for admin/seller modules)

### UI Components & Libraries

- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **React Slick** - Carousel/slider components
- **Embla Carousel** - Modern carousel library
- **Recharts** - Data visualization and charts
- **React Hook Form** - Form handling
- **React Toastify** - Toast notifications
- **React Loading Skeleton** - Loading states

### State Management

- **Redux Toolkit 2.8.2** - Global state management
- **React Redux 9.2.0** - React bindings for Redux

### Backend & Database

- **Supabase** - Backend-as-a-Service (PostgreSQL database, Authentication, Real-time, Storage)
- **@supabase/supabase-js 2.56.1** - Supabase client library

### Payment Integration

- **Khalti** - Payment gateway for Nepal
- **Axios 1.13.2** - HTTP client for API requests

### Development Tools

- **ESLint** - Code linting
- **PostCSS & Autoprefixer** - CSS processing
- **React GA4** - Google Analytics 4 integration

---

## 📁 Project Structure

```
client/
├── public/                          # Static assets
│   └── vite.svg
├── src/
│   ├── AdminSeller/                 # Admin & Seller modules
│   │   ├── admin/                   # Admin dashboard
│   │   │   ├── components/          # Admin components
│   │   │   │   ├── Dashboard/       # Dashboard sections
│   │   │   │   ├── Products/        # Product management
│   │   │   │   ├── Sellers/         # Seller management
│   │   │   │   ├── Sales/           # Sales analytics
│   │   │   │   ├── Marketing/       # Marketing tools
│   │   │   │   ├── Reports/         # Reporting modules
│   │   │   │   └── Settings/        # System settings
│   │   │   ├── hooks/               # Custom React hooks
│   │   │   ├── ui/                  # UI components (shadcn)
│   │   │   ├── AdminDashboard.tsx   # Main admin component
│   │   │   ├── mockData.ts          # Mock data for development
│   │   │   └── navConfig.ts         # Navigation configuration
│   │   ├── seller/                  # Seller dashboard
│   │   │   ├── components/          # Seller components
│   │   │   ├── SellerDashboard.tsx  # Main seller component
│   │   │   └── SellerForm.tsx       # Seller registration
│   │   ├── app/                     # Redux store configuration
│   │   ├── contexts/                # React contexts
│   │   ├── hooks/                   # Shared hooks
│   │   ├── Protected-Route.jsx      # Route protection
│   │   ├── Role-Badge.tsx           # User role badges
│   │   └── Theme-Provider.tsx       # Theme management
│   ├── api/                         # API service layer
│   │   └── ProductApi.js            # Product API calls
│   ├── app/                         # Redux store (customer)
│   │   └── store.js                 # Store configuration
│   ├── assets/                      # Images and media
│   │   ├── react.svg
│   │   └── images/
│   ├── category/                    # Category components
│   │   ├── CategorySectionCard.jsx
│   │   ├── CategorySlider.jsx
│   │   ├── CategorySliderDynamic.jsx
│   │   ├── CategoryBrowserAll.jsx
│   │   ├── SubCategories.jsx
│   │   └── SubsubCategories.jsx
│   ├── checkout/                    # Checkout flow
│   │   ├── CheckoutPage.jsx
│   │   └── OrderProduct.jsx
│   ├── components/                  # Shared components
│   │   ├── profile/                 # User profile components
│   │   ├── Navbar.jsx               # Main navigation
│   │   ├── CartPage.jsx             # Shopping cart
│   │   ├── WishlistItem.jsx         # Wishlist items
│   │   ├── ProductDetailInfo.jsx    # Product details
│   │   ├── FlashSalePage.jsx        # Flash sales
│   │   └── [many more...]
│   ├── data/                        # Static data and mocks
│   │   ├── products.js
│   │   ├── categoryProductData.js
│   │   ├── featureProducts.js
│   │   └── [more data files...]
│   ├── features/                    # Redux slices
│   │   ├── cartlistSlice.js         # Cart state
│   │   ├── wishlistSlice.js         # Wishlist state
│   │   └── productsApiSlice.js      # Product API state
│   ├── layouts/                     # Layout components
│   │   └── ProductLayout.jsx
│   ├── login/                       # Authentication UI
│   │   ├── LoginDesk.jsx
│   │   └── LoginMob.jsx
│   ├── mobileNav/                   # Mobile navigation
│   │   └── BottomNavBarMobile.jsx
│   ├── order/                       # Order management
│   │   ├── OrderPage.jsx
│   │   ├── OrderContactForm.jsx
│   │   ├── OrderPayment.jsx
│   │   ├── CheckoutPayment.jsx
│   │   └── OrderSuccessDetail.jsx
│   ├── pages/                       # Main pages
│   │   ├── HeroSection.jsx
│   │   ├── HomeProduct.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── CategoryPage.jsx
│   │   ├── FilterProduct.jsx
│   │   └── [more pages...]
│   ├── payments/                    # Payment integration
│   │   ├── khalti/
│   │   │   ├── KhaltiButton.jsx
│   │   │   ├── KhaltiTestPage.jsx
│   │   │   └── Success.jsx
│   │   └── Success.jsx
│   ├── slider/                      # Slider components
│   │   └── NewProductSlider.jsx
│   ├── supabase/                    # Supabase utilities
│   ├── ui/                          # UI utilities
│   ├── utils/                       # Helper functions
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # Entry point
│   ├── index.css                    # Global styles
│   ├── supabase.js                  # Supabase client
│   └── setupSupabase.js             # Supabase setup
├── .env                             # Environment variables
├── .gitignore                       # Git ignore rules
├── eslint.config.js                 # ESLint configuration
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind configuration
├── vercel.json                      # Vercel deployment config
└── vite.config.js                   # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **pnpm** or **yarn**
- **Supabase account** (for database and authentication)
- **Khalti account** (for payment integration)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sushey01/E-Commerce_FullStack.git
   cd E-Commerce_FullStack/client
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the `client` directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_KHALTI_PUBLIC_KEY=your_khalti_public_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

---

## ⚙️ Environment Setup

### Supabase Configuration

1. Create a new project on [Supabase](https://supabase.com)
2. Set up the following tables (see [Database Schema](#database-schema))
3. Configure authentication providers
4. Set up storage buckets for product images
5. Copy your project URL and anon key to `.env`

### Khalti Payment Gateway

1. Sign up at [Khalti](https://khalti.com)
2. Get your test/live public key
3. Add the key to `.env` as `VITE_KHALTI_PUBLIC_KEY`

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production Build
npm run build        # Build for production

# Preview Build
npm run preview      # Preview production build locally

# Linting
npm run lint         # Run ESLint
```

---

## 🔑 Key Modules

### 1. Authentication & User Management

- Role-based access control (Customer, Seller, Admin)
- Protected routes with `Protected-Route.jsx`
- User profile management
- Session handling via Supabase Auth

### 2. Product Management

- Product catalog with images
- Category and subcategory organization
- Brand management
- Product filtering and sorting
- Search functionality
- Stock management

### 3. Shopping Experience

- Product browsing and details
- Cart management (Redux state)
- Wishlist functionality (Redux state)
- Product reviews and ratings
- Flash sales and special offers

### 4. Order Management

- Multi-step checkout process
- Order placement
- Order tracking
- Invoice generation
- Order history

### 5. Payment Integration

- Khalti payment gateway
- Payment verification
- Payment success/failure handling
- Transaction history

### 6. Admin Dashboard

- **Dashboard Overview**: Total sales, orders, customers, products, sellers
- **Seller Management**: Approve/reject seller requests, manage sellers
- **Product Management**: Add, edit, delete products
- **Category/Brand Management**: Organize product taxonomy
- **Sales Analytics**: Order tracking, revenue reports
- **Marketing Tools**: Flash deals, mega deals, coupons, popups, newsletters
- **Reports**: Earnings, seller reports, stock levels, commission history

### 7. Seller Dashboard

- Sales overview and analytics
- Product inventory management
- Order processing
- Revenue tracking
- Performance insights

---

## 🗄️ Database Schema

### Core Tables (Supabase PostgreSQL)

#### `users`

- `id` (UUID, Primary Key)
- `email` (Text, Unique)
- `role` (Enum: customer, seller, admin)
- `created_at` (Timestamp)
- Additional profile fields

#### `sellers`

- `seller_id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users)
- `company_name` (Text)
- `status` (Enum: pending, active, inactive)
- `created_at` (Timestamp)

#### `categories`

- `id` (UUID, Primary Key)
- `name` (Text)
- `parent_id` (UUID, nullable, for subcategories)
- `created_at` (Timestamp)

#### `brands`

- `brand_id` (UUID, Primary Key)
- `brand_name` (Text)
- `created_at` (Timestamp)

#### `products`

- `id` (UUID, Primary Key)
- `title` (Text)
- `price` (Numeric)
- `category_id` (UUID, Foreign Key → categories)
- `brand_id` (UUID, Foreign Key → brands)
- `stock` (Integer)
- `description` (Text)
- `images` (Array/JSONB)
- `created_at` (Timestamp)

#### `seller_products`

- `seller_product_id` (UUID, Primary Key)
- `seller_id` (UUID, Foreign Key → sellers)
- `product_id` (UUID, Foreign Key → products)
- `created_at` (Timestamp)

#### `orders`

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users)
- `total` (Numeric)
- `status` (Enum: Pending, Confirmed, Processed, Shipped, Delivered)
- `paid_amount` (Numeric)
- `payment_method` (Text)
- `created_at` (Timestamp)

#### `order_items`

- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key → orders)
- `product_id` (UUID, Foreign Key → products)
- `seller_product_id` (UUID, Foreign Key → seller_products)
- `quantity` (Integer)
- `price` (Numeric)

#### Additional Tables

- `wishlists` - User wishlist items
- `reviews` - Product reviews and ratings
- `coupons` - Promotional coupons
- `flash_deals` - Time-limited deals
- `newsletters` - Email subscriptions

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. User signs up/logs in via Supabase Auth
2. Session token stored in browser
3. Token verified on protected routes
4. Role checked for admin/seller access

### Role-Based Access

- **Customer**: Access to shopping, cart, orders
- **Seller**: Access to seller dashboard and product management
- **Admin**: Full access to all admin features

### Protected Routes

```jsx
<ProtectedRoute allowedRoles={["admin"]}>
  <AdminDashboard />
</ProtectedRoute>
```

---

## 💳 Payment Integration

### Khalti Integration

- Payment button component: `KhaltiButton.jsx`
- Payment verification via Khalti API
- Success/failure callbacks
- Order status update after payment

### Payment Flow

1. User proceeds to checkout
2. Khalti payment popup initiated
3. User completes payment
4. Khalti sends callback
5. Order marked as paid in database
6. Success page displayed

---

## 🔄 State Management

### Redux Store Structure

```javascript
store/
├── cartlistSlice      // Shopping cart state
├── wishlistSlice      // Wishlist state
└── productsApiSlice   // Product API cache
```

### Key Actions

- `addToCart`, `removeFromCart`, `updateQuantity`
- `addToWishlist`, `removeFromWishlist`
- `fetchProducts`, `fetchProductById`

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

#### Step 1: Prepare Your Repository

1. Ensure all changes are committed and pushed to GitHub
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin admintest
   ```

#### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository: `Sushey01/E-Commerce_FullStack`
4. Select the `client` directory as the root directory
5. Vercel will auto-detect Vite settings

#### Step 3: Configure Environment Variables (CRITICAL!)

In Vercel project settings, add these environment variables:

| Variable Name            | Value                     | Environment                      |
| ------------------------ | ------------------------- | -------------------------------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key    | Production, Preview, Development |
| `VITE_KHALTI_PUBLIC_KEY` | Your Khalti public key    | Production, Preview, Development |

**⚠️ Important**: Without these environment variables, your site will appear blank!

#### Step 4: Deploy

Click **"Deploy"** and wait for the build to complete.

#### Troubleshooting Blank Page Issues

If your deployment shows a blank page:

1. **Check Browser Console** (F12) for errors
2. **Verify Environment Variables** are set correctly in Vercel
3. **Check Build Logs** in Vercel dashboard for errors
4. **Redeploy** after adding environment variables:
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

#### Alternative: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Build Configuration

- Output directory: `dist`
- Build command: `npm run build`
- Framework preset: Vite
- Node version: 18.x or higher

### Environment Variables (Production)

Set the following in your deployment platform:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_KHALTI_PUBLIC_KEY` - Your Khalti public key (test or live)

### Post-Deployment Checklist

- [ ] Site loads without blank page
- [ ] Environment variables are set
- [ ] Navigation works correctly
- [ ] Images load properly
- [ ] API calls to Supabase work
- [ ] Authentication flow functions
- [ ] Payment integration tested
- [ ] Mobile responsive design verified

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow ESLint rules
- Use TypeScript for new admin/seller components
- Write meaningful commit messages
- Add comments for complex logic
- Test thoroughly before submitting

---

## 🗺️ Roadmap

### Upcoming Features

- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] Real-time order notifications
- [ ] Chat support between customers and sellers
- [ ] Mobile app (React Native)
- [ ] AI-powered product recommendations
- [ ] Social media integration
- [ ] Advanced search with filters
- [ ] Seller subscription plans
- [ ] Automated inventory alerts
- [ ] Returns and refunds management
- [ ] Loyalty/rewards program
- [ ] Multi-currency support
- [ ] Advanced SEO optimization
- [ ] Performance monitoring and logging

### In Progress

- [ ] Top sellers/products analytics improvement
- [ ] Enhanced dashboard visualizations
- [ ] Order management workflow optimization

### Completed

- [x] Admin dashboard with comprehensive analytics
- [x] Seller dashboard
- [x] Product management system
- [x] Category and brand management
- [x] Cart and wishlist functionality
- [x] Order placement and tracking
- [x] Khalti payment integration
- [x] Marketing tools (flash deals, coupons, popups)
- [x] Responsive design
- [x] User authentication and authorization

---

## 📞 Support & Contact

For issues, questions, or contributions:

- **GitHub Issues**: [Create an issue](https://github.com/Sushey01/E-Commerce_FullStack/issues)
- **Repository**: [E-Commerce_FullStack](https://github.com/Sushey01/E-Commerce_FullStack)

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 👥 Team

- **Owner/Developer**: Sushey01
- **Branch**: admintest (active development)

---

## 🙏 Acknowledgments

- React and Vite teams for excellent developer experience
- Supabase for backend infrastructure
- Khalti for payment gateway services
- Radix UI for accessible components
- TailwindCSS for utility-first styling
- Open source community for amazing libraries

---

**Last Updated**: December 9, 2025  
**Version**: 0.0.0 (Pre-release)
