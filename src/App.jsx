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


function Home() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="home-page">

      {/* Navbar */}
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


      {/* Home Content */}
      <main className="home-content">

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


function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* User Routes */}

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


        {/* Admin Routes */}

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