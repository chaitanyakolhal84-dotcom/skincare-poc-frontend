import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminOrders.css";

function AdminOrders() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const user =
            JSON.parse(localStorage.getItem("user"));

        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "admin") {
            navigate("/");
            return;
        }

        fetchOrders();
    }, [navigate]);

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const response =
                await api.get("/orders");

            setOrders(
                response.data.orders ||
                response.data ||
                []
            );

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load orders."
            );
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (
        orderId,
        orderStatus
    ) => {
        try {
            setError("");
            setMessage("");

            await api.put(
                `/orders/${orderId}/status`,
                {
                    orderStatus
                }
            );

            setMessage(
                "Order status updated successfully!"
            );

            fetchOrders();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to update order status."
            );
        }
    };

    const updatePaymentStatus = async (
        orderId,
        paymentStatus
    ) => {
        try {
            setError("");
            setMessage("");

            /*
             * Backend status API is used here.
             * Current backend may update orderStatus
             * and paymentStatus depending on
             * controller implementation.
             */

            await api.put(
                `/orders/${orderId}/status`,
                {
                    paymentStatus
                }
            );

            setMessage(
                "Payment status updated successfully!"
            );

            fetchOrders();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to update payment status."
            );
        }
    };

    return (
        <div className="admin-orders-page">

            {/* NAVBAR */}

            <nav className="admin-orders-navbar">

                <div className="admin-orders-brand">
                    🌿 Skincare POC
                    <span>Admin</span>
                </div>

                <div className="admin-orders-nav">

                    <button
                        onClick={() =>
                            navigate("/admin")
                        }
                    >
                        Dashboard
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
                            navigate("/orders")
                        }
                    >
                        My Orders
                    </button>

                </div>

            </nav>

            {/* MAIN */}

            <main className="admin-orders-container">

                <div className="admin-orders-header">

                    <div>
                        <h1>
                            Order Management
                        </h1>

                        <p>
                            Manage customer orders and
                            payment status.
                        </p>
                    </div>

                    <button
                        className="refresh-orders"
                        onClick={fetchOrders}
                    >
                        ↻ Refresh
                    </button>

                </div>

                {message && (
                    <div className="orders-success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="orders-error">
                        {error}
                    </div>
                )}

                {loading ? (

                    <div className="orders-loading">
                        Loading orders...
                    </div>

                ) : orders.length === 0 ? (

                    <div className="no-orders">
                        📦
                        <h2>
                            No Orders Found
                        </h2>

                        <p>
                            There are currently no
                            customer orders.
                        </p>
                    </div>

                ) : (

                    <div className="admin-orders-list">

                        {orders.map((order) => (

                            <div
                                className="admin-order-card"
                                key={order._id}
                            >

                                {/* ORDER HEADER */}

                                <div className="admin-order-top">

                                    <div>

                                        <h2>
                                            Order #
                                            {order._id.slice(
                                                -8
                                            )}
                                        </h2>

                                        <p>
                                            {order.createdAt
                                                ? new Date(
                                                    order.createdAt
                                                ).toLocaleString()
                                                : ""}
                                        </p>

                                    </div>

                                    <span className="order-total">
                                        ₹
                                        {Number(
                                            order.totalAmount || 0
                                        ).toFixed(2)}
                                    </span>

                                </div>

                                {/* CUSTOMER */}

                                <div className="customer-box">

                                    <h3>
                                        Customer
                                    </h3>

                                    <p>
                                        <strong>
                                            Name:
                                        </strong>{" "}
                                        {order.user?.name ||
                                            "User"}
                                    </p>

                                    <p>
                                        <strong>
                                            Email:
                                        </strong>{" "}
                                        {order.user?.email ||
                                            "N/A"}
                                    </p>

                                </div>

                                {/* ITEMS */}

                                <div className="admin-order-items">

                                    <h3>
                                        Ordered Products
                                    </h3>

                                    {order.items?.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                className="admin-order-item"
                                                key={
                                                    item._id ||
                                                    index
                                                }
                                            >

                                                <div>

                                                    <strong>
                                                        {item.product
                                                            ?.name ||
                                                            item.name ||
                                                            "Product"}
                                                    </strong>

                                                    <span>
                                                        Quantity:{" "}
                                                        {
                                                            item.quantity
                                                        }
                                                    </span>

                                                </div>

                                                <strong>
                                                    ₹
                                                    {(
                                                        Number(
                                                            item.price ||
                                                            0
                                                        ) *
                                                        Number(
                                                            item.quantity ||
                                                            0
                                                        )
                                                    ).toFixed(2)}
                                                </strong>

                                            </div>

                                        )
                                    )}

                                </div>

                                {/* SHIPPING */}

                                <div className="shipping-details">

                                    <h3>
                                        Shipping Address
                                    </h3>

                                    <p>
                                        {order.shippingAddress ||
                                            "N/A"}
                                    </p>

                                </div>

                                {/* STATUS */}

                                <div className="status-controls">

                                    <div className="status-control">

                                        <label>
                                            Order Status
                                        </label>

                                        <select
                                            value={
                                                order.orderStatus ||
                                                "Pending"
                                            }
                                            onChange={(e) =>
                                                updateOrderStatus(
                                                    order._id,
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option value="Pending">
                                                Pending
                                            </option>

                                            <option value="Processing">
                                                Processing
                                            </option>

                                            <option value="Shipped">
                                                Shipped
                                            </option>

                                            <option value="Delivered">
                                                Delivered
                                            </option>

                                            <option value="Cancelled">
                                                Cancelled
                                            </option>

                                        </select>

                                    </div>

                                    <div className="status-control">

                                        <label>
                                            Payment Status
                                        </label>

                                        <select
                                            value={
                                                order.paymentStatus ||
                                                "Pending"
                                            }
                                            onChange={(e) =>
                                                updatePaymentStatus(
                                                    order._id,
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option value="Pending">
                                                Pending
                                            </option>

                                            <option value="Paid">
                                                Paid
                                            </option>

                                            <option value="Failed">
                                                Failed
                                            </option>

                                            <option value="Refunded">
                                                Refunded
                                            </option>

                                        </select>

                                    </div>

                                    <div className="payment-method">

                                        <label>
                                            Payment Method
                                        </label>

                                        <strong>
                                            {order.paymentMethod ||
                                                "COD"}
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}

export default AdminOrders;