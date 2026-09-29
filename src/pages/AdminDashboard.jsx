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

    // ==========================================
    // CHECK ADMIN + LOAD DATA
    // ==========================================

    useEffect(() => {

        const savedUser =
            JSON.parse(
                localStorage.getItem("user")
            );

        const token =
            localStorage.getItem("token");

        if (!savedUser || !token) {
            navigate("/login");
            return;
        }

        if (savedUser.role !== "admin") {
            navigate("/");
            return;
        }

        setUser(savedUser);

        loadDashboard();

    }, [navigate]);

    // ==========================================
    // LOAD DASHBOARD DATA
    // ==========================================

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                ordersResponse,
                productsResponse
            ] = await Promise.all([

                api.get("/orders"),

                api.get("/products")

            ]);

            const ordersData =
                ordersResponse.data;

            const productsData =
                productsResponse.data;

            setOrders(
                ordersData.orders ||
                ordersData ||
                []
            );

            setProducts(
                productsData.products ||
                productsData ||
                []
            );

        } catch (err) {

            console.error(
                "Dashboard error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load dashboard."
            );

        } finally {

            setLoading(false);

        }
    };

    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };

    // ==========================================
    // CALCULATIONS
    // ==========================================

    const totalSales =
        orders.reduce(
            (total, order) =>
                total +
                Number(
                    order.totalAmount || 0
                ),
            0
        );

    const pendingOrders =
        orders.filter(
            (order) =>
                String(
                    order.orderStatus || ""
                ).toLowerCase() === "pending"
        ).length;

    const processingOrders =
        orders.filter(
            (order) =>
                String(
                    order.orderStatus || ""
                ).toLowerCase() === "processing"
        ).length;

    const shippedOrders =
        orders.filter(
            (order) =>
                String(
                    order.orderStatus || ""
                ).toLowerCase() === "shipped"
        ).length;

    const deliveredOrders =
        orders.filter(
            (order) =>
                String(
                    order.orderStatus || ""
                ).toLowerCase() === "delivered"
        ).length;

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="admin-loading">

                🌿

                <p>
                    Loading Admin Dashboard...
                </p>

            </div>
        );

    }

    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="admin-page">

            {/* ================= NAVBAR ================= */}

            <nav className="admin-navbar">

                <div className="admin-brand">

                    🌿 Skincare POC

                    <span>
                        ADMIN
                    </span>

                </div>

                <div className="admin-nav">

                    <button
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Home
                    </button>

                    <button
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                    >
                        Products
                    </button>

                    <button
                        onClick={() =>
                            navigate(
                                "/admin/orders"
                            )
                        }
                    >
                        Orders
                    </button>

                    <button
                        className="admin-logout"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </nav>

            {/* ================= MAIN ================= */}

            <main className="admin-container">

                {/* HEADER */}

                <div className="admin-header">

                    <div>

                        <h1>
                            Admin Dashboard
                        </h1>

                        <p>
                            Welcome,{" "}
                            <strong>
                                {user?.name}
                            </strong>
                        </p>

                    </div>

                    <button
                        className="refresh-button"
                        onClick={
                            loadDashboard
                        }
                    >
                        ↻ Refresh
                    </button>

                </div>

                {/* ERROR */}

                {error && (

                    <div className="admin-error">
                        {error}
                    </div>

                )}

                {/* ================= STATISTICS ================= */}

                <div className="stats-grid">

                    {/* TOTAL ORDERS */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            📦
                        </div>

                        <div>

                            <span>
                                Total Orders
                            </span>

                            <strong>
                                {orders.length}
                            </strong>

                        </div>

                    </div>

                    {/* PRODUCTS */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            🛍️
                        </div>

                        <div>

                            <span>
                                Products
                            </span>

                            <strong>
                                {products.length}
                            </strong>

                        </div>

                    </div>

                    {/* PENDING */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            ⏳
                        </div>

                        <div>

                            <span>
                                Pending
                            </span>

                            <strong>
                                {pendingOrders}
                            </strong>

                        </div>

                    </div>

                    {/* PROCESSING */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            ⚙️
                        </div>

                        <div>

                            <span>
                                Processing
                            </span>

                            <strong>
                                {processingOrders}
                            </strong>

                        </div>

                    </div>

                    {/* SHIPPED */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            🚚
                        </div>

                        <div>

                            <span>
                                Shipped
                            </span>

                            <strong>
                                {shippedOrders}
                            </strong>

                        </div>

                    </div>

                    {/* DELIVERED */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            ✅
                        </div>

                        <div>

                            <span>
                                Delivered
                            </span>

                            <strong>
                                {deliveredOrders}
                            </strong>

                        </div>

                    </div>

                    {/* SALES */}

                    <div className="stat-card sales-card">

                        <div className="stat-icon">
                            ₹
                        </div>

                        <div>

                            <span>
                                Total Sales
                            </span>

                            <strong>
                                ₹
                                {totalSales.toFixed(2)}
                            </strong>

                        </div>

                    </div>

                </div>

                {/* ================= QUICK ACTIONS ================= */}

                <section className="dashboard-section">

                    <h2>
                        Quick Actions
                    </h2>

                    <div className="quick-actions">

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/products"
                                )
                            }
                        >

                            🛍️

                            <span>
                                Manage Products
                            </span>

                        </button>

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/orders"
                                )
                            }
                        >

                            📦

                            <span>
                                Manage Orders
                            </span>

                        </button>

                        <button
                            onClick={() =>
                                navigate(
                                    "/products"
                                )
                            }
                        >

                            👁️

                            <span>
                                View Store
                            </span>

                        </button>

                    </div>

                </section>

                {/* ================= RECENT ORDERS ================= */}

                <section className="dashboard-section">

                    <div className="section-title">

                        <h2>
                            Recent Orders
                        </h2>

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/orders"
                                )
                            }
                        >
                            View All →
                        </button>

                    </div>

                    {orders.length === 0 ? (

                        <div className="empty-dashboard">

                            📦

                            <p>
                                No orders found.
                            </p>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Order
                                        </th>

                                        <th>
                                            Customer
                                        </th>

                                        <th>
                                            Total
                                        </th>

                                        <th>
                                            Payment
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {orders
                                        .slice(0, 10)
                                        .map(
                                            (order) => (

                                                <tr
                                                    key={
                                                        order._id
                                                    }
                                                >

                                                    <td>
                                                        #
                                                        {String(
                                                            order._id
                                                        ).slice(
                                                            -6
                                                        )}
                                                    </td>

                                                    <td>

                                                        {order
                                                            .user
                                                            ?.name ||
                                                            "User"}

                                                    </td>

                                                    <td>
                                                        ₹
                                                        {Number(
                                                            order.totalAmount ||
                                                            0
                                                        ).toFixed(
                                                            2
                                                        )}
                                                    </td>

                                                    <td>

                                                        <span className="payment-badge">

                                                            {order.paymentStatus ||
                                                                "Pending"}

                                                        </span>

                                                    </td>

                                                    <td>

                                                        <span className="status-badge">

                                                            {order.orderStatus ||
                                                                "Pending"}

                                                        </span>

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