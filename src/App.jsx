import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";

import "./App.css";


// ==========================================
// HOME PAGE
// ==========================================
function Home() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // ==========================================
  // LOGOUT
  // ==========================================
  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };


  return (
    <div className="home-page">

      {/* =========================================
                NAVBAR
            ========================================= */}
      <nav className="navbar">

        <div className="brand">
          🌿 Skincare POC
        </div>


        <div className="home-nav-links">

          <a href="/">
            Home
          </a>

          <a href="/products">
            Products
          </a>

          <a href="/orders">
            My Orders
          </a>

          <a href="/rewards">
            Rewards
          </a>

          <a href="/profile">
            Profile
          </a>

          <a href="/cart">
            🛒 Cart
          </a>


          {/* Admin Link */}
          {user?.role === "admin" && (
            <a href="/admin">
              Admin
            </a>
          )}


          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* =========================================
                HOME CONTENT
            ========================================= */}
      <main className="home-content">


        {/* =========================================
                    COUPON ADVERTISEMENT
                ========================================= */}
        <div className="coupon-ad">

          {/* Coupon Icon */}
          <div className="coupon-ad-icon">
            🎟️
          </div>


          {/* Coupon Content */}
          <div className="coupon-ad-content">

            <span className="coupon-ad-badge">
              LIMITED OFFER
            </span>


            <h2>
              BUY 1 GET 1 FREE 🎁
            </h2>


            <p>
              Buy 1 product and get 1 product
              free on selected skincare products.
            </p>


            <div className="coupon-ad-actions">

              <div className="coupon-code-box">

                <span>
                  Use Code
                </span>

                <strong>
                  BUY1GET1
                </strong>

              </div>


              <a
                href="/products"
                className="coupon-shop-button"
              >
                Shop Now →
              </a>

            </div>

          </div>


          {/* Decoration */}
          <div className="coupon-ad-decoration">
            🌿
          </div>

        </div>


        {/* =========================================
                    WELCOME CARD
                ========================================= */}
        <div className="welcome-card">

          <div className="welcome-icon">
            🌿
          </div>


          <h1>
            Welcome, {user?.name || "User"}!
          </h1>


          <p>
            Welcome to Skincare POC.
            Explore skincare products,
            manage your orders and earn
            reward points.
          </p>


          {/* USER INFORMATION */}
          <div className="user-info">

            <div>
              <span>
                Email
              </span>

              <strong>
                {user?.email || "N/A"}
              </strong>
            </div>


            <div>
              <span>
                Role
              </span>

              <strong>
                {user?.role || "user"}
              </strong>
            </div>


            <div>
              <span>
                Points
              </span>

              <strong>
                {user?.points ?? 0}
              </strong>
            </div>

          </div>


          {/* HOME BUTTONS */}
          <div className="home-buttons">

            <a href="/products">
              Browse Products
            </a>


            <a
              href="/rewards"
              className="secondary-home-button"
            >
              View Rewards
            </a>

          </div>

        </div>

      </main>

    </div>
  );
}


// ==========================================
// MAIN APP
// ==========================================
function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* User Pages */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/rewards"
          element={<Rewards />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* Admin Pages */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />

        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />


        {/* Unknown Route */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;