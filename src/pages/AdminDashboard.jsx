import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedUser = JSON.parse(
            localStorage.getItem("user")
        );

        const token = localStorage.getItem("token");

        if (!token || !storedUser) {
            navigate("/login");
            return;
        }

        if (storedUser.role !== "admin") {
            navigate("/");
            return;
        }

        setUser(storedUser);

        fetchDashboardData();
    }, [navigate]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const [ordersResponse, productsResponse] =
                await Promise.all([
                    api.get("/orders"),
                    api.get("/products")
                ]);

            setOrders(
                Array.isArray(ordersResponse.data)
                    ? ordersResponse.data
                    : ordersResponse.data?.orders || []
            );

            setProducts(
                Array.isArray(productsResponse.data)
                    ? productsResponse.data
                    : productsResponse.data?.products || []
            );
        } catch (err) {
            console.error("Dashboard error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };

    const totalOrders = orders.length;

    const totalProducts = products.length;

    const totalRevenue = orders.reduce(
        (total, order) => {
            return total + Number(order.totalAmount || 0);
        },
        0
    );

    const recentOrders = [...orders]
        .sort(
            (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
        )
        .slice(0, 5);

    return (
        <div className="admin-dashboard">

            {/* ================= NAVBAR ================= */}

            <nav className="admin-navbar">

                <div className="admin-brand">
                    🌿 Skincare POC
                </div>

                <div className="admin-nav-links">

                    <button
                        onClick={() => navigate("/")}
                    >
                        Home
                    </button>

                    <button
                        onClick={() =>
                            navigate("/admin/products")
                        }
                    >
                        Products
                    </button>

                    <button
                        onClick={() =>
                            navigate("/admin/orders")
                        }
                    >
                        Orders
                    </button>

                    <button
                        onClick={() =>
                            navigate("/admin/promotions")
                        }
                    >
                        Promotions
                    </button>

                    <button
                        className="admin-coupon-nav-btn"
                        onClick={() =>
                            navigate("/admin/coupons")
                        }
                    >
                        🎟 Coupons
                    </button>

                    <button
                        className="admin-logout-btn"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </nav>

            {/* ================= MAIN CONTENT ================= */}

            <main className="admin-content">

                {/* HEADER */}

                <div className="admin-page-header">

                    <div>

                        <span className="admin-label">
                            ADMIN PANEL
                        </span>

                        <h1>
                            Admin Dashboard
                        </h1>

                        <p>
                            Welcome back,{" "}
                            <strong>
                                {user?.name || "Admin"}
                            </strong>
                            . Manage your skincare store
                            from here.
                        </p>

                    </div>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="admin-error">
                        {error}
                    </div>
                )}

                {/* ================= STATS ================= */}

                <div className="admin-stats-grid">

                    {/* Orders */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            📦
                        </div>

                        <div>

                            <span>
                                Total Orders
                            </span>

                            <strong>
                                {loading
                                    ? "..."
                                    : totalOrders}
                            </strong>

                        </div>

                    </div>

                    {/* Products */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            🧴
                        </div>

                        <div>

                            <span>
                                Total Products
                            </span>

                            <strong>
                                {loading
                                    ? "..."
                                    : totalProducts}
                            </strong>

                        </div>

                    </div>

                    {/* Revenue */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            ₹
                        </div>

                        <div>

                            <span>
                                Total Revenue
                            </span>

                            <strong>
                                {loading
                                    ? "..."
                                    : `₹${totalRevenue}`}
                            </strong>

                        </div>

                    </div>

                </div>

                {/* ================= QUICK ACTIONS ================= */}

                <section className="admin-section">

                    <div className="admin-section-header">

                        <div>

                            <h2>
                                Quick Actions
                            </h2>

                            <p>
                                Manage different parts of
                                your store.
                            </p>

                        </div>

                    </div>

                    <div className="admin-action-grid">

                        {/* PRODUCTS */}

                        <button
                            className="admin-action-card"
                            onClick={() =>
                                navigate("/admin/products")
                            }
                        >

                            <span className="action-icon">
                                🧴
                            </span>

                            <div>

                                <strong>
                                    Manage Products
                                </strong>

                                <small>
                                    Add, edit and delete
                                    products
                                </small>

                            </div>

                        </button>

                        {/* ORDERS */}

                        <button
                            className="admin-action-card"
                            onClick={() =>
                                navigate("/admin/orders")
                            }
                        >

                            <span className="action-icon">
                                📦
                            </span>

                            <div>

                                <strong>
                                    Manage Orders
                                </strong>

                                <small>
                                    View and update customer
                                    orders
                                </small>

                            </div>

                        </button>

                        {/* PROMOTIONS */}

                        <button
                            className="admin-action-card"
                            onClick={() =>
                                navigate("/admin/promotions")
                            }
                        >

                            <span className="action-icon">
                                📢
                            </span>

                            <div>

                                <strong>
                                    Manage Promotions
                                </strong>

                                <small>
                                    Manage Home page offers
                                </small>

                            </div>

                        </button>

                        {/* COUPONS */}

                        <button
                            className="admin-action-card coupon-action-card"
                            onClick={() =>
                                navigate("/admin/coupons")
                            }
                        >

                            <span className="action-icon">
                                🎟️
                            </span>

                            <div>

                                <strong>
                                    Manage Coupons
                                </strong>

                                <small>
                                    Create coupons for
                                    Checkout
                                </small>

                            </div>

                        </button>

                        {/* VIEW STORE */}

                        <button
                            className="admin-action-card"
                            onClick={() =>
                                navigate("/products")
                            }
                        >

                            <span className="action-icon">
                                🛍️
                            </span>

                            <div>

                                <strong>
                                    View Store
                                </strong>

                                <small>
                                    Open customer store
                                </small>

                            </div>

                        </button>

                    </div>

                </section>

                {/* ================= RECENT ORDERS ================= */}

                <section className="admin-section">

                    <div className="admin-section-header">

                        <div>

                            <h2>
                                Recent Orders
                            </h2>

                            <p>
                                Latest customer orders.
                            </p>

                        </div>

                        <button
                            className="view-all-btn"
                            onClick={() =>
                                navigate("/admin/orders")
                            }
                        >
                            View All →
                        </button>

                    </div>

                    {/* Loading */}

                    {loading ? (
                        <div className="admin-loading">
                            Loading orders...
                        </div>

                    ) : recentOrders.length === 0 ? (

                        <div className="admin-empty">
                            No orders found.
                        </div>

                    ) : (

                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Order ID
                                        </th>

                                        <th>
                                            Customer
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Payment
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {recentOrders.map(
                                        (order) => (

                                            <tr
                                                key={order._id}
                                            >

                                                <td>
                                                    #
                                                    {order._id
                                                        ? order._id.slice(-6)
                                                        : "N/A"}
                                                </td>

                                                <td>
                                                    {order.user?.name ||
                                                        order.customerName ||
                                                        "Customer"}
                                                </td>

                                                <td>
                                                    ₹
                                                    {order.totalAmount ||
                                                        0}
                                                </td>

                                                <td>
                                                    {order.paymentStatus ||
                                                        order.paymentMethod ||
                                                        "Pending"}
                                                </td>

                                                <td>

                                                    <span className="order-status">
                                                        {order.orderStatus ||
                                                            "Pending"}
                                                    </span>

                                                </td>

                                                <td>
                                                    {order.createdAt
                                                        ? new Date(
                                                            order.createdAt
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )
                                                        : "N/A"}
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default AdminDashboard;