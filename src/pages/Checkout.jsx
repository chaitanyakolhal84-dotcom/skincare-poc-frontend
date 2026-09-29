import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Checkout.css";

function Checkout() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        paymentMethod: "COD"
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = JSON.parse(
            localStorage.getItem("user")
        );

        if (!token || !storedUser) {
            navigate("/login");
            return;
        }

        setUser(storedUser);

        setFormData((prev) => ({
            ...prev,
            name: storedUser.name || "",
            email: storedUser.email || ""
        }));

        const storedCart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];

        if (storedCart.length === 0) {
            navigate("/cart");
            return;
        }

        setCart(storedCart);
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const subtotal = cart.reduce(
        (total, item) =>
            total +
            Number(item.price) *
            Number(item.quantity),
        0
    );

    const totalItems = cart.reduce(
        (total, item) =>
            total + Number(item.quantity),
        0
    );

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.phone.trim() ||
            !formData.address.trim() ||
            !formData.city.trim() ||
            !formData.state.trim() ||
            !formData.pincode.trim()
        ) {
            setError(
                "Please fill all required fields."
            );
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.phone)) {
            setError(
                "Please enter a valid 10-digit phone number."
            );
            return;
        }

        if (!/^[0-9]{6}$/.test(formData.pincode)) {
            setError(
                "Please enter a valid 6-digit PIN code."
            );
            return;
        }

        try {
            setLoading(true);

            const shippingAddress =
                `${formData.name}, ${formData.phone}, ` +
                `${formData.address}, ${formData.city}, ` +
                `${formData.state} - ${formData.pincode}`;

            const orderData = {
                user: user.id,

                items: cart.map((item) => ({
                    product: item.product,
                    quantity: Number(item.quantity)
                })),

                shippingAddress,

                paymentMethod:
                    formData.paymentMethod
            };

            const response = await api.post(
                "/orders",
                orderData
            );

            console.log(
                "Order created:",
                response.data
            );

            setSuccess(
                "Order placed successfully!"
            );

            localStorage.removeItem("cart");

            setTimeout(() => {
                navigate("/orders");
            }, 1000);

        } catch (err) {
            console.error(
                "Checkout error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to place order. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">

            {/* Navbar */}
            <nav className="checkout-navbar">

                <div
                    className="checkout-brand"
                    onClick={() => navigate("/")}
                >
                    🌿 Skincare POC
                </div>

                <div className="checkout-nav-links">

                    <button
                        onClick={() =>
                            navigate("/")
                        }
                    >
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

                    <button
                        onClick={() =>
                            navigate("/orders")
                        }
                    >
                        My Orders
                    </button>

                    <button
                        className="checkout-logout"
                        onClick={() => {
                            localStorage.removeItem(
                                "token"
                            );

                            localStorage.removeItem(
                                "user"
                            );

                            navigate("/login");
                        }}
                    >
                        Logout
                    </button>

                </div>
            </nav>

            {/* Main */}
            <main className="checkout-container">

                <div className="checkout-heading">
                    <span>
                        SECURE CHECKOUT
                    </span>

                    <h1>
                        Complete Your Order
                    </h1>

                    <p>
                        Enter your delivery details
                        and choose your payment method.
                    </p>
                </div>

                {error && (
                    <div className="checkout-error">
                        ⚠️ {error}
                    </div>
                )}

                {success && (
                    <div className="checkout-success">
                        ✓ {success}
                    </div>
                )}

                <div className="checkout-layout">

                    {/* LEFT */}
                    <form
                        className="checkout-form-card"
                        onSubmit={handlePlaceOrder}
                    >

                        {/* Customer Details */}
                        <section className="checkout-section">

                            <div className="section-heading">
                                <span>1</span>

                                <div>
                                    <h2>
                                        Customer Details
                                    </h2>

                                    <p>
                                        Your basic contact information
                                    </p>
                                </div>
                            </div>

                            <div className="checkout-grid">

                                <div className="input-group">
                                    <label>
                                        Full Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={
                                            formData.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>
                                        Email Address *
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="input-group full-width">
                                    <label>
                                        Phone Number *
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={
                                            formData.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="10-digit mobile number"
                                        maxLength="10"
                                    />
                                </div>

                            </div>

                        </section>


                        {/* Address */}
                        <section className="checkout-section">

                            <div className="section-heading">
                                <span>2</span>

                                <div>
                                    <h2>
                                        Delivery Address
                                    </h2>

                                    <p>
                                        Where should we deliver
                                        your order?
                                    </p>
                                </div>
                            </div>

                            <div className="checkout-grid">

                                <div className="input-group full-width">
                                    <label>
                                        Address *
                                    </label>

                                    <textarea
                                        name="address"
                                        value={
                                            formData.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="House / Flat / Street / Area"
                                        rows="3"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>
                                        City *
                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={
                                            formData.city
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter city"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>
                                        State *
                                    </label>

                                    <input
                                        type="text"
                                        name="state"
                                        value={
                                            formData.state
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter state"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>
                                        PIN Code *
                                    </label>

                                    <input
                                        type="text"
                                        name="pincode"
                                        value={
                                            formData.pincode
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="6-digit PIN"
                                        maxLength="6"
                                    />
                                </div>

                            </div>

                        </section>


                        {/* Payment */}
                        <section className="checkout-section">

                            <div className="section-heading">
                                <span>3</span>

                                <div>
                                    <h2>
                                        Payment Method
                                    </h2>

                                    <p>
                                        Select your preferred
                                        payment option
                                    </p>
                                </div>
                            </div>

                            <label className="payment-option">

                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={
                                        formData.paymentMethod ===
                                        "COD"
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <div>
                                    <strong>
                                        💵 Cash on Delivery
                                    </strong>

                                    <small>
                                        Pay when your order
                                        arrives.
                                    </small>
                                </div>

                            </label>

                        </section>


                        <button
                            type="submit"
                            className="place-order-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Placing Order..."
                                : `Place Order • ₹${subtotal}`}
                        </button>

                    </form>


                    {/* RIGHT - ORDER SUMMARY */}
                    <aside className="order-summary">

                        <div className="summary-header">
                            <h2>
                                Order Summary
                            </h2>

                            <span>
                                {totalItems} item
                                {totalItems !== 1
                                    ? "s"
                                    : ""}
                            </span>
                        </div>

                        <div className="summary-items">

                            {cart.map((item, index) => (
                                <div
                                    className="summary-item"
                                    key={
                                        item.product ||
                                        index
                                    }
                                >

                                    <div className="summary-product-icon">
                                        🌿
                                    </div>

                                    <div className="summary-product-info">

                                        <strong>
                                            {item.name}
                                        </strong>

                                        <span>
                                            Qty:{" "}
                                            {item.quantity}
                                        </span>

                                    </div>

                                    <strong>
                                        ₹
                                        {Number(
                                            item.price
                                        ) *
                                            Number(
                                                item.quantity
                                            )}
                                    </strong>

                                </div>
                            ))}

                        </div>

                        <div className="summary-line">
                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ₹{subtotal}
                            </strong>
                        </div>

                        <div className="summary-line">
                            <span>
                                Delivery
                            </span>

                            <strong className="free">
                                FREE
                            </strong>
                        </div>

                        <div className="summary-total">
                            <span>
                                Total
                            </span>

                            <strong>
                                ₹{subtotal}
                            </strong>
                        </div>

                        <div className="secure-message">
                            🔒 Your information is
                            securely processed.
                        </div>

                    </aside>

                </div>

            </main>

        </div>
    );
}

export default Checkout;