import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate
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
import ManagePromotions from "./pages/ManagePromotions";
import ManageCoupons from "./pages/ManageCoupons";

import api from "./services/api";

import "./App.css";


/* =========================================================
   HOME PAGE
   ========================================================= */

function Home() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [promotion, setPromotion] = useState(null);

  const [promotionLoading, setPromotionLoading] =
    useState(true);


  /* =======================================================
     LOAD USER
     ======================================================= */

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {

      try {

        setUser(
          JSON.parse(storedUser)
        );

      } catch (error) {

        console.error(
          "User data error:",
          error
        );

      }

    }

  }, []);


  /* =======================================================
     LOAD ACTIVE PROMOTION
     ======================================================= */

  useEffect(() => {

    fetchPromotion();

  }, []);


  const fetchPromotion = async () => {

    try {

      setPromotionLoading(true);

      const response =
        await api.get(
          "/promotions/active"
        );

      /*
        Backend returns:
        {
          promotion: {...}
        }

        OR directly:
        {...}
      */

      const activePromotion =
        response.data?.promotion ||
        response.data;

      setPromotion(
        activePromotion &&
          activePromotion._id
          ? activePromotion
          : null
      );

    } catch (error) {

      console.error(
        "Promotion loading error:",
        error
      );

      setPromotion(null);

    } finally {

      setPromotionLoading(false);

    }

  };


  /* =======================================================
     LOGOUT
     ======================================================= */

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "/login";

  };


  /* =======================================================
     HOME
     ======================================================= */

  return (

    <div className="home-page">

      {/* =================================================
          NAVBAR
          ================================================= */}

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


      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <main className="home-content">


        {/* =================================================
            DYNAMIC PROMOTION
            ================================================= */}

        {!promotionLoading &&
          promotion && (

            <div className="coupon-ad">

              {/* ICON */}

              <div className="coupon-ad-icon">
                🎟
              </div>


              {/* CONTENT */}

              <div className="coupon-ad-content">


                {/* SUBTITLE */}

                {promotion.subtitle && (

                  <span className="coupon-ad-badge">

                    {promotion.subtitle}

                  </span>

                )}


                {/* TITLE */}

                <h2>

                  {promotion.title}

                </h2>


                {/* DESCRIPTION */}

                {promotion.description && (

                  <p>

                    {promotion.description}

                  </p>

                )}


                {/* ACTIONS */}

                <div className="coupon-ad-actions">


                  {/* COUPON CODE */}

                  {promotion.couponCode && (

                    <div className="coupon-code-box">

                      <span>
                        Use Code
                      </span>

                      <strong>

                        {promotion.couponCode}

                      </strong>

                    </div>

                  )}


                  {/* SHOP BUTTON */}

                  <a
                    href="/products"
                    className="coupon-shop-button"
                  >

                    {promotion.buttonText ||
                      "Shop Now"}

                    {" →"}

                  </a>

                </div>


              </div>


              {/* DECORATION */}

              <div className="coupon-ad-decoration">
                🌿
              </div>

            </div>

          )}


        {/* =================================================
            WELCOME CARD
            ================================================= */}

        <div className="welcome-card">


          <div className="welcome-icon">
            🌿
          </div>


          <h1>

            Welcome,{" "}
            {user?.name || "User"}!

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


          {/* BUTTONS */}

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


/* =========================================================
   APP
   ========================================================= */

function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ================= USER ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

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


        {/* ================= ADMIN ================= */}

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

        <Route
          path="/admin/promotions"
          element={<ManagePromotions />}
        />

        <Route
          path="/admin/coupons"
          element={<ManageCoupons />}
        />


        {/* ================= DEFAULT ================= */}

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