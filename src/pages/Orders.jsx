import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Orders.css";

function Orders() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/orders");

            setOrders(response.data.orders || response.data);
        } catch (err) {
            console.error("Orders error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load orders."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="orders-page">

            <nav className="orders-navbar">

                <div className="orders-brand">
                    🌿 Skincare POC
                </div>

                <div className="orders-nav-links">

                    <button onClick={() => navigate("/")}>
                        Home
                    </button>

                    <button
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        Products
                    </button>

                    <button
                        onClick={() =>
                            navigate("/cart")
                        }
                    >
                        Cart
                    </button>

                </div>

            </nav>

            <main className="orders-container">

                <div className="orders-header">

                    <h1>
                        My Orders
                    </h1>

                    <p>
                        View your skincare orders and
                        order status.
                    </p>

                </div>

                {loading && (
                    <div className="orders-message">
                        Loading orders...
                    </div>
                )}

                {error && (
                    <div className="orders-error">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    orders.length === 0 && (
                        <div className="empty-orders">

                            <div className="empty-icon">
                                🛍️
                            </div>

                            <h2>
                                No Orders Yet
                            </h2>

                            <p>
                                You haven't placed any
                                orders yet.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/products")
                                }
                            >
                                Browse Products
                            </button>

                        </div>
                    )}

                <div className="orders-list">

                    {orders.map((order) => (

                        <div
                            className="order-card"
                            key={order._id}
                        >

                            <div className="order-top">

                                <div>

                                    <h2>
                                        Order #
                                        {order._id.slice(-6)}
                                    </h2>

                                    <p>
                                        {order.createdAt
                                            ? new Date(
                                                order.createdAt
                                            ).toLocaleString()
                                            : ""}
                                    </p>

                                </div>

                                <span
                                    className={`order-status ${String(
                                        order.orderStatus || ""
                                    ).toLowerCase()}`}
                                >
                                    {order.orderStatus ||
                                        "Pending"}
                                </span>

                            </div>

                            <div className="order-items">

                                {order.items?.map(
                                    (item, index) => (

                                        <div
                                            className="order-item"
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

                                                <p>
                                                    Quantity:{" "}
                                                    {item.quantity}
                                                </p>

                                            </div>

                                            <strong>
                                                ₹
                                                {item.price
                                                    ? (
                                                        item.price *
                                                        item.quantity
                                                    ).toFixed(2)
                                                    : "0.00"}
                                            </strong>

                                        </div>

                                    )
                                )}

                            </div>

                            <div className="order-details">

                                <div>
                                    <span>
                                        Payment
                                    </span>

                                    <strong>
                                        {order.paymentMethod ||
                                            "COD"}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Payment Status
                                    </span>

                                    <strong>
                                        {order.paymentStatus ||
                                            "Pending"}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            order.totalAmount || 0
                                        ).toFixed(2)}
                                    </strong>
                                </div>

                            </div>

                            <div className="shipping-box">

                                <span>
                                    Shipping Address
                                </span>

                                <p>
                                    {order.shippingAddress ||
                                        "N/A"}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </main>

        </div>
    );
}

export default Orders;