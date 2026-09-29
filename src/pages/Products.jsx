import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Products.css";

function Products() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/products");

            setProducts(response.data);
        } catch (err) {
            console.error("Products error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load products"
            );
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        const existingCart =
            JSON.parse(localStorage.getItem("cart")) || [];

        const existingItem = existingCart.find(
            (item) => item.product === product._id
        );

        let updatedCart;

        if (existingItem) {
            updatedCart = existingCart.map((item) =>
                item.product === product._id
                    ? {
                        ...item,
                        quantity: item.quantity + 1
                    }
                    : item
            );
        } else {
            updatedCart = [
                ...existingCart,
                {
                    product: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                }
            ];
        }

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );

        setMessage(
            `${product.name} added to cart successfully!`
        );

        setTimeout(() => {
            setMessage("");
        }, 2500);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");

        navigate("/login");
    };

    if (loading) {
        return (
            <div className="products-loading">
                <div className="loading-icon">
                    🌿
                </div>

                <h2>
                    Loading Products...
                </h2>
            </div>
        );
    }

    return (
        <div className="products-page">

            {/* Navbar */}
            <nav className="products-navbar">

                <div
                    className="products-brand"
                    onClick={() => navigate("/")}
                >
                    🌿 Skincare POC
                </div>

                <div className="products-nav-links">

                    <button
                        onClick={() => navigate("/")}
                    >
                        Home
                    </button>

                    <button className="active">
                        Products
                    </button>

                    <button
                        onClick={() =>
                            navigate("/orders")
                        }
                    >
                        My Orders
                    </button>

                    <button
                        onClick={() =>
                            navigate("/rewards")
                        }
                    >
                        Rewards
                    </button>

                    <button
                        onClick={() =>
                            navigate("/profile")
                        }
                    >
                        Profile
                    </button>

                    <button
                        onClick={() =>
                            navigate("/cart")
                        }
                    >
                        🛒 Cart
                    </button>

                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>
            </nav>

            {/* Success Message */}
            {message && (
                <div className="cart-success-message">
                    <span className="success-check">
                        ✓
                    </span>

                    <span>
                        {message}
                    </span>
                </div>
            )}

            {/* Main Content */}
            <main className="products-container">

                <div className="products-heading">

                    <div>
                        <span className="small-title">
                            OUR COLLECTION
                        </span>

                        <h1>
                            Skincare Products
                        </h1>

                        <p>
                            Discover products designed
                            for healthy and beautiful skin.
                        </p>
                    </div>

                    <button
                        className="view-cart-button"
                        onClick={() =>
                            navigate("/cart")
                        }
                    >
                        🛒 View Cart
                    </button>

                </div>

                {/* Error */}
                {error && (
                    <div className="products-error">
                        ⚠️ {error}
                    </div>
                )}

                {/* Products */}
                {products.length === 0 ? (
                    <div className="empty-products">
                        <div>
                            🧴
                        </div>

                        <h2>
                            No Products Available
                        </h2>

                        <p>
                            There are currently no
                            skincare products available.
                        </p>
                    </div>
                ) : (
                    <div className="products-grid">

                        {products.map((product) => (

                            <div
                                className="product-card"
                                key={product._id}
                            >

                                {/* Product Image */}
                                <div className="product-image">

                                    <div className="product-image-icon">
                                        🌿
                                    </div>

                                    {product.stockQuantity <=
                                        5 &&
                                        product.stockQuantity >
                                        0 && (
                                            <span className="stock-badge">
                                                Only{" "}
                                                {
                                                    product.stockQuantity
                                                }{" "}
                                                left
                                            </span>
                                        )}

                                    {product.stockQuantity ===
                                        0 && (
                                            <span className="out-stock-badge">
                                                Out of Stock
                                            </span>
                                        )}

                                </div>

                                {/* Product Info */}
                                <div className="product-info">

                                    <span className="product-brand">
                                        {product.brand ||
                                            "Skincare"}
                                    </span>

                                    <h2>
                                        {product.name}
                                    </h2>

                                    <p className="product-description">
                                        {product.description ||
                                            "Premium skincare product for your daily skincare routine."}
                                    </p>

                                    {product.skinType && (
                                        <div className="skin-type">
                                            Skin Type:{" "}
                                            {Array.isArray(
                                                product.skinType
                                            )
                                                ? product.skinType.join(
                                                    ", "
                                                )
                                                : product.skinType}
                                        </div>
                                    )}

                                    <div className="product-bottom">

                                        <div className="product-price">
                                            ₹
                                            {Number(
                                                product.price
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </div>

                                        <button
                                            className="add-cart-button"
                                            disabled={
                                                product.stockQuantity ===
                                                0
                                            }
                                            onClick={() =>
                                                addToCart(
                                                    product
                                                )
                                            }
                                        >
                                            {product.stockQuantity ===
                                                0
                                                ? "Out of Stock"
                                                : "🛒 Add to Cart"}
                                        </button>

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

export default Products;