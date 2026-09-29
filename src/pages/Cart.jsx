import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        const savedCart = JSON.parse(
            localStorage.getItem("cart") || "[]"
        );

        setCart(savedCart);
    };

    const updateQuantity = (index, change) => {
        const updatedCart = [...cart];

        updatedCart[index].quantity += change;

        if (updatedCart[index].quantity <= 0) {
            updatedCart.splice(index, 1);
        }

        setCart(updatedCart);

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );
    };

    const removeItem = (index) => {
        const updatedCart = [...cart];

        updatedCart.splice(index, 1);

        setCart(updatedCart);

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );
    };

    const clearCart = () => {
        localStorage.removeItem("cart");
        setCart([]);
    };

    const subtotal = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="cart-page">

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

            <main className="cart-container">

                <div className="cart-header">

                    <h1>
                        Your Cart
                    </h1>

                    <p>
                        Review your selected skincare products
                    </p>

                </div>

                {cart.length === 0 ? (

                    <div className="empty-cart">

                        <div className="empty-cart-icon">
                            🛒
                        </div>

                        <h2>
                            Your cart is empty
                        </h2>

                        <p>
                            Add some skincare products to
                            continue shopping.
                        </p>

                        <button
                            className="continue-shopping"
                            onClick={() =>
                                navigate("/products")
                            }
                        >
                            Browse Products
                        </button>

                    </div>

                ) : (

                    <div className="cart-layout">

                        <div className="cart-items">

                            {cart.map((item, index) => (

                                <div
                                    className="cart-item"
                                    key={index}
                                >

                                    <div className="cart-item-image">
                                        🌿
                                    </div>

                                    <div className="cart-item-details">

                                        <h3>
                                            {item.name}
                                        </h3>

                                        <p>
                                            ₹{item.price} each
                                        </p>

                                        <div className="quantity-controls">

                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        index,
                                                        -1
                                                    )
                                                }
                                            >
                                                −
                                            </button>

                                            <span>
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        index,
                                                        1
                                                    )
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>

                                    <div className="cart-item-right">

                                        <strong>
                                            ₹
                                            {item.price *
                                                item.quantity}
                                        </strong>

                                        <button
                                            className="remove-button"
                                            onClick={() =>
                                                removeItem(index)
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            ))}

                            <button
                                className="clear-cart-button"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </button>

                        </div>

                        <div className="cart-summary">

                            <h2>
                                Order Summary
                            </h2>

                            <div className="summary-row">

                                <span>
                                    Items
                                </span>

                                <span>
                                    {cart.reduce(
                                        (total, item) =>
                                            total +
                                            item.quantity,
                                        0
                                    )}
                                </span>

                            </div>

                            <div className="summary-row">

                                <span>
                                    Subtotal
                                </span>

                                <span>
                                    ₹{subtotal}
                                </span>

                            </div>

                            <div className="summary-row">

                                <span>
                                    Delivery
                                </span>

                                <span>
                                    Free
                                </span>

                            </div>

                            <hr />

                            <div className="summary-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹{subtotal}
                                </strong>

                            </div>

                            <button
                                className="checkout-button"
                                onClick={() =>
                                    navigate("/checkout")
                                }
                            >
                                Proceed to Checkout
                            </button>

                            <button
                                className="continue-shopping"
                                onClick={() =>
                                    navigate("/products")
                                }
                            >
                                Continue Shopping
                            </button>

                        </div>

                    </div>

                )}

            </main>

        </div>
    );
}

export default Cart;