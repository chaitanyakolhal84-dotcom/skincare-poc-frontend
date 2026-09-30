import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Checkout.css";

function Checkout() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);

    const [shippingAddress, setShippingAddress] =
        useState("");

    const [paymentMethod, setPaymentMethod] =
        useState("COD");

    // Coupon states
    const [couponCode, setCouponCode] =
        useState("");

    const [couponData, setCouponData] =
        useState(null);

    const [couponError, setCouponError] =
        useState("");

    const [couponLoading, setCouponLoading] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [orderSuccess, setOrderSuccess] =
        useState(false);

    // ==========================================
    // LOAD USER + CART
    // ==========================================

    useEffect(() => {
        const savedUser =
            JSON.parse(
                localStorage.getItem("user")
            );

        const savedCart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];

        if (!savedUser) {
            navigate("/login");
            return;
        }

        setUser(savedUser);
        setCart(savedCart);
    }, [navigate]);

    // ==========================================
    // CART TOTAL
    // ==========================================

    const subtotal = cart.reduce(
        (total, item) => {
            const price =
                Number(item.price) || 0;

            const quantity =
                Number(item.quantity) || 0;

            return total +
                price * quantity;
        },
        0
    );

    const couponDiscount =
        Number(couponData?.discount) || 0;

    const finalTotal =
        Math.max(
            0,
            subtotal - couponDiscount
        );

    // ==========================================
    // APPLY COUPON
    // ==========================================

    const applyCoupon = async () => {

        if (!couponCode.trim()) {
            setCouponError(
                "Please enter a coupon code."
            );
            return;
        }

        if (cart.length === 0) {
            setCouponError(
                "Your cart is empty."
            );
            return;
        }

        try {
            setCouponLoading(true);
            setCouponError("");
            setCouponData(null);

            const response =
                await api.post(
                    "/coupons/apply",
                    {
                        code:
                            couponCode
                                .trim()
                                .toUpperCase(),

                        items: cart.map(
                            (item) => ({
                                product:
                                    item.product ||
                                    item._id,

                                quantity:
                                    Number(
                                        item.quantity
                                    )
                            })
                        )
                    }
                );

            setCouponData(
                response.data
            );

        } catch (error) {

            console.error(
                "Coupon error:",
                error
            );

            setCouponData(null);

            setCouponError(
                error.response?.data
                    ?.message ||
                "Unable to apply coupon."
            );

        } finally {
            setCouponLoading(false);
        }
    };

    // ==========================================
    // REMOVE COUPON
    // ==========================================

    const removeCoupon = () => {
        setCouponData(null);
        setCouponCode("");
        setCouponError("");
    };

    // ==========================================
    // PLACE ORDER
    // ==========================================

    const placeOrder = async (e) => {

        e.preventDefault();

        if (!user) {
            alert(
                "Please login before placing order."
            );
            navigate("/login");
            return;
        }

        if (cart.length === 0) {
            alert(
                "Your cart is empty."
            );
            navigate("/products");
            return;
        }

        if (!shippingAddress.trim()) {
            alert(
                "Please enter shipping address."
            );
            return;
        }

        try {

            setLoading(true);

            /*
             * IMPORTANT:
             * We only send coupon CODE.
             *
             * Backend calculates the actual
             * discount and final amount.
             */

            const orderData = {

                user: user.id,

                items: cart.map(
                    (item) => ({
                        product:
                            item.product ||
                            item._id,

                        quantity:
                            Number(
                                item.quantity
                            )
                    })
                ),

                shippingAddress:
                    shippingAddress.trim(),

                paymentMethod,

                couponCode:
                    couponData?.coupon?.code ||
                    null
            };

            console.log(
                "Creating order:",
                orderData
            );

            const response =
                await api.post(
                    "/orders",
                    orderData
                );

            console.log(
                "Order created:",
                response.data
            );

            // Clear cart
            localStorage.removeItem(
                "cart"
            );

            setCart([]);

            setOrderSuccess(true);

            /*
             * Give user time to see
             * success message.
             */

            setTimeout(() => {
                navigate("/orders");
            }, 1800);

        } catch (error) {

            console.error(
                "Place order error:",
                error
            );

            alert(
                error.response?.data
                    ?.message ||
                "Failed to place order."
            );

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // EMPTY CART
    // ==========================================

    if (
        !user
    ) {
        return (
            <div className="checkout-loading">
                Loading...
            </div>
        );
    }

    if (
        cart.length === 0 &&
        !orderSuccess
    ) {
        return (
            <div className="checkout-page">

                <nav className="checkout-navbar">

                    <div
                        className="checkout-brand"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        🌿 Skincare POC
                    </div>

                    <div className="checkout-nav-links">

                        <button
                            onClick={() =>
                                navigate(
                                    "/products"
                                )
                            }
                        >
                            Products
                        </button>

                        <button
                            onClick={() =>
                                navigate(
                                    "/cart"
                                )
                            }
                        >
                            🛒 Cart
                        </button>

                    </div>

                </nav>

                <div className="empty-checkout">

                    <div className="empty-icon">
                        🛒
                    </div>

                    <h2>
                        Your cart is empty
                    </h2>

                    <p>
                        Add some skincare
                        products before
                        checkout.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/products"
                            )
                        }
                    >
                        Browse Products
                    </button>

                </div>

            </div>
        );
    }

    // ==========================================
    // SUCCESS SCREEN
    // ==========================================

    if (orderSuccess) {
        return (
            <div className="checkout-success-page">

                <div className="success-card">

                    <div className="success-icon">
                        ✓
                    </div>

                    <h1>
                        Order Placed Successfully!
                    </h1>

                    <p>
                        Your skincare order
                        has been created.
                    </p>

                    <p className="success-total">
                        Total Paid:
                        <strong>
                            ₹
                            {finalTotal.toLocaleString(
                                "en-IN"
                            )}
                        </strong>
                    </p>

                    <p className="redirect-text">
                        Redirecting to
                        My Orders...
                    </p>

                </div>

            </div>
        );
    }

    // ==========================================
    // MAIN CHECKOUT
    // ==========================================

    return (
        <div className="checkout-page">

            {/* NAVBAR */}

            <nav className="checkout-navbar">

                <div
                    className="checkout-brand"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    🌿 Skincare POC
                </div>

                <div className="checkout-nav-links">

                    <button
                        onClick={() =>
                            navigate(
                                "/products"
                            )
                        }
                    >
                        Products
                    </button>

                    <button
                        onClick={() =>
                            navigate(
                                "/cart"
                            )
                        }
                    >
                        🛒 Cart
                    </button>

                    <button
                        onClick={() =>
                            navigate(
                                "/orders"
                            )
                        }
                    >
                        My Orders
                    </button>

                    <button
                        onClick={() =>
                            navigate(
                                "/profile"
                            )
                        }
                    >
                        Profile
                    </button>

                </div>

            </nav>

            {/* PAGE */}

            <main className="checkout-container">

                <div className="checkout-heading">

                    <span>
                        🛍️
                    </span>

                    <div>
                        <h1>
                            Checkout
                        </h1>

                        <p>
                            Complete your
                            skincare order
                        </p>
                    </div>

                </div>

                <form
                    onSubmit={placeOrder}
                    className="checkout-layout"
                >

                    {/* LEFT SIDE */}

                    <div className="checkout-left">

                        {/* SHIPPING */}

                        <section className="checkout-card">

                            <div className="section-title">

                                <span>
                                    📦
                                </span>

                                <div>
                                    <h2>
                                        Shipping Address
                                    </h2>

                                    <p>
                                        Where should
                                        we deliver
                                        your order?
                                    </p>
                                </div>

                            </div>

                            <textarea
                                value={
                                    shippingAddress
                                }
                                onChange={(e) =>
                                    setShippingAddress(
                                        e.target.value
                                    )
                                }
                                placeholder={
                                    "Enter full shipping address\nExample: Flat 101, ABC Society, Pune, Maharashtra, India"
                                }
                                rows="5"
                                required
                            />

                        </section>

                        {/* PAYMENT */}

                        <section className="checkout-card">

                            <div className="section-title">

                                <span>
                                    💳
                                </span>

                                <div>
                                    <h2>
                                        Payment Method
                                    </h2>

                                    <p>
                                        Select your
                                        preferred
                                        payment method
                                    </p>
                                </div>

                            </div>

                            <div className="payment-options">

                                <label
                                    className={
                                        paymentMethod ===
                                            "COD"
                                            ? "payment-option selected"
                                            : "payment-option"
                                    }
                                >

                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={
                                            paymentMethod ===
                                            "COD"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <span className="payment-icon">
                                        💵
                                    </span>

                                    <div>
                                        <strong>
                                            Cash on Delivery
                                        </strong>

                                        <small>
                                            Pay when your
                                            order arrives
                                        </small>
                                    </div>

                                </label>

                                <label
                                    className={
                                        paymentMethod ===
                                            "Online"
                                            ? "payment-option selected"
                                            : "payment-option"
                                    }
                                >

                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Online"
                                        checked={
                                            paymentMethod ===
                                            "Online"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <span className="payment-icon">
                                        💳
                                    </span>

                                    <div>
                                        <strong>
                                            Online Payment
                                        </strong>

                                        <small>
                                            Pay securely
                                            online
                                        </small>
                                    </div>

                                </label>

                            </div>

                        </section>

                        {/* COUPON */}

                        <section className="checkout-card coupon-card">

                            <div className="section-title">

                                <span>
                                    🎟️
                                </span>

                                <div>
                                    <h2>
                                        Apply Coupon
                                    </h2>

                                    <p>
                                        Save more on
                                        your skincare
                                        order
                                    </p>
                                </div>

                            </div>

                            <div className="coupon-input-row">

                                <input
                                    type="text"
                                    value={
                                        couponCode
                                    }
                                    onChange={(e) =>
                                        setCouponCode(
                                            e.target.value
                                                .toUpperCase()
                                        )
                                    }
                                    placeholder="Enter coupon code"
                                    disabled={
                                        !!couponData
                                    }
                                />

                                {!couponData ? (

                                    <button
                                        type="button"
                                        className="apply-coupon-btn"
                                        onClick={
                                            applyCoupon
                                        }
                                        disabled={
                                            couponLoading
                                        }
                                    >
                                        {couponLoading
                                            ? "Applying..."
                                            : "Apply"}
                                    </button>

                                ) : (

                                    <button
                                        type="button"
                                        className="remove-coupon-btn"
                                        onClick={
                                            removeCoupon
                                        }
                                    >
                                        Remove
                                    </button>

                                )}

                            </div>

                            {couponData && (

                                <div className="coupon-success">

                                    <div className="coupon-success-icon">
                                        ✓
                                    </div>

                                    <div className="coupon-success-content">

                                        <strong>
                                            Coupon Applied!
                                        </strong>

                                        <span>
                                            {
                                                couponData
                                                    .coupon
                                                    ?.name
                                            }
                                        </span>

                                        <small>
                                            {couponData.description}
                                        </small>

                                    </div>

                                    <div className="coupon-saving">

                                        Save

                                        <strong>
                                            ₹
                                            {Number(
                                                couponData.discount ||
                                                0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            )}

                            {couponError && (

                                <div className="coupon-error">
                                    ❌ {couponError}
                                </div>

                            )}

                            <div className="coupon-hint">

                                💡 Try:

                                <span>
                                    BUY1GET1
                                </span>

                                <span>
                                    WELCOME10
                                </span>

                                <span>
                                    FLAT100
                                </span>

                            </div>

                        </section>

                    </div>

                    {/* RIGHT SIDE */}

                    <div className="checkout-right">

                        <section className="checkout-card order-summary">

                            <div className="section-title">

                                <span>
                                    🧾
                                </span>

                                <div>
                                    <h2>
                                        Order Summary
                                    </h2>

                                    <p>
                                        {cart.length}
                                        {" "}
                                        item
                                        {cart.length !== 1
                                            ? "s"
                                            : ""}
                                    </p>
                                </div>

                            </div>

                            {/* PRODUCTS */}

                            <div className="summary-products">

                                {cart.map(
                                    (item, index) => {

                                        const productId =
                                            item.product ||
                                            item._id;

                                        const price =
                                            Number(
                                                item.price
                                            ) || 0;

                                        const quantity =
                                            Number(
                                                item.quantity
                                            ) || 0;

                                        return (
                                            <div
                                                className="summary-product"
                                                key={
                                                    productId ||
                                                    index
                                                }
                                            >

                                                <div className="product-info">

                                                    <div className="product-mini-icon">
                                                        🌿
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                item.name ||
                                                                item.productName ||
                                                                "Skincare Product"
                                                            }
                                                        </strong>

                                                        <span>
                                                            Qty:
                                                            {" "}
                                                            {quantity}
                                                        </span>

                                                    </div>

                                                </div>

                                                <strong>
                                                    ₹
                                                    {(
                                                        price *
                                                        quantity
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                            <div className="summary-divider" />

                            {/* SUBTOTAL */}

                            <div className="summary-row">

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹
                                    {subtotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>

                            {/* COUPON DISCOUNT */}

                            {couponDiscount > 0 && (

                                <div className="summary-row discount-row">

                                    <span>
                                        🎟️ Coupon Discount
                                    </span>

                                    <strong>
                                        -₹
                                        {couponDiscount.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>

                            )}

                            <div className="summary-divider" />

                            {/* TOTAL */}

                            <div className="final-total-row">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹
                                    {finalTotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>

                            {couponDiscount > 0 && (

                                <div className="total-saving">

                                    🎉 You saved ₹
                                    {couponDiscount.toLocaleString(
                                        "en-IN"
                                    )}

                                </div>

                            )}

                            <button
                                type="submit"
                                className="place-order-btn"
                                disabled={
                                    loading
                                }
                            >

                                {loading
                                    ? "Placing Order..."
                                    : `Place Order • ₹${finalTotal.toLocaleString(
                                        "en-IN"
                                    )}`}

                            </button>

                            <button
                                type="button"
                                className="back-cart-btn"
                                onClick={() =>
                                    navigate(
                                        "/cart"
                                    )
                                }
                            >
                                ← Back to Cart
                            </button>

                        </section>

                    </div>

                </form>

            </main>

        </div>
    );
}

export default Checkout;