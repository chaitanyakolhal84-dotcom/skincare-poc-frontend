import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminProducts.css";

function AdminProducts() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        brand: "",
        category: "",
        price: "",
        stockQuantity: "",
        description: "",
        skinType: ""
    });

    // ==========================================
    // CHECK ADMIN + LOAD PRODUCTS
    // ==========================================
    useEffect(() => {
        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "admin") {
            navigate("/");
            return;
        }

        fetchProducts();
    }, [navigate]);

    // ==========================================
    // GET PRODUCTS
    // ==========================================
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/products");

            setProducts(
                response.data.products ||
                response.data ||
                []
            );

        } catch (err) {
            console.error(
                "Fetch products error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load products."
            );

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // HANDLE INPUT
    // ==========================================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // ==========================================
    // RESET FORM
    // ==========================================
    const resetForm = () => {
        setForm({
            name: "",
            brand: "",
            category: "",
            price: "",
            stockQuantity: "",
            description: "",
            skinType: ""
        });

        setEditingId(null);
    };

    // ==========================================
    // ADD / UPDATE PRODUCT
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Convert values properly
        const stockValue =
            Number(form.stockQuantity);

        const priceValue =
            Number(form.price);

        const productData = {
            name: form.name.trim(),
            brand: form.brand.trim(),
            category: form.category.trim(),
            price: priceValue,
            stockQuantity: stockValue,
            description: form.description.trim(),
            skinType: form.skinType
                ? form.skinType
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
                : []
        };

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!productData.name) {
            setError("Product name is required.");
            return;
        }

        if (!productData.brand) {
            setError("Brand is required.");
            return;
        }

        if (!productData.category) {
            setError("Category is required.");
            return;
        }

        if (
            Number.isNaN(priceValue) ||
            priceValue <= 0
        ) {
            setError("Please enter a valid price.");
            return;
        }

        if (
            Number.isNaN(stockValue) ||
            stockValue < 0
        ) {
            setError(
                "Please enter a valid stock quantity."
            );
            return;
        }

        try {
            setSaving(true);

            // ==========================================
            // UPDATE PRODUCT
            // ==========================================
            if (editingId) {

                console.log(
                    "UPDATING PRODUCT ID:",
                    editingId
                );

                console.log(
                    "PRODUCT DATA:",
                    productData
                );

                const response = await api.put(
                    `/products/${editingId}`,
                    productData
                );

                console.log(
                    "UPDATE RESPONSE:",
                    response.data
                );

                setSuccess(
                    "Product updated successfully!"
                );

            } else {

                // ==========================================
                // CREATE PRODUCT
                // ==========================================
                const response = await api.post(
                    "/products",
                    productData
                );

                console.log(
                    "CREATE RESPONSE:",
                    response.data
                );

                setSuccess(
                    "Product added successfully!"
                );
            }

            resetForm();

            await fetchProducts();

        } catch (err) {
            console.error(
                "Save product error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to save product."
            );

        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // EDIT PRODUCT
    // ==========================================
    const editProduct = (product) => {
        setEditingId(product._id);

        setForm({
            name: product.name || "",
            brand: product.brand || "",
            category: product.category || "",
            price:
                product.price !== undefined
                    ? product.price
                    : "",

            stockQuantity:
                product.stockQuantity !== undefined
                    ? product.stockQuantity
                    : "",

            description:
                product.description || "",

            skinType:
                Array.isArray(product.skinType)
                    ? product.skinType.join(", ")
                    : product.skinType || ""
        });

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ==========================================
    // DELETE PRODUCT
    // ==========================================
    const deleteProduct = async (productId) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this product?"
            );

        if (!confirmDelete) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/products/${productId}`
            );

            setSuccess(
                "Product deleted successfully!"
            );

            if (editingId === productId) {
                resetForm();
            }

            await fetchProducts();

        } catch (err) {
            console.error(
                "Delete product error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to delete product."
            );
        }
    };

    // ==========================================
    // CANCEL EDIT
    // ==========================================
    const handleCancelEdit = () => {
        resetForm();
        setError("");
        setSuccess("");
    };

    // ==========================================
    // UI
    // ==========================================
    return (
        <div className="admin-products-page">

            {/* HEADER */}
            <div className="admin-products-header">

                <div>
                    <h1>
                        🌿 Manage Products
                    </h1>

                    <p>
                        Add, edit and manage
                        skincare products.
                    </p>
                </div>

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/admin")
                    }
                >
                    ← Admin Dashboard
                </button>

            </div>

            {/* MESSAGES */}
            {error && (
                <div className="message error-message">
                    ❌ {error}
                </div>
            )}

            {success && (
                <div className="message success-message">
                    ✅ {success}
                </div>
            )}

            {/* PRODUCT FORM */}
            <div className="admin-product-form-card">

                <div className="form-header">

                    <h2>
                        {editingId
                            ? "✏️ Edit Product"
                            : "➕ Add New Product"}
                    </h2>

                    {editingId && (
                        <button
                            type="button"
                            className="cancel-edit-button"
                            onClick={
                                handleCancelEdit
                            }
                        >
                            Cancel Edit
                        </button>
                    )}

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="admin-product-form"
                >

                    {/* PRODUCT NAME */}
                    <div className="form-group">

                        <label>
                            Product Name *
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g. Vitamin C Face Serum"
                            required
                        />

                    </div>

                    {/* BRAND */}
                    <div className="form-group">

                        <label>
                            Brand *
                        </label>

                        <input
                            type="text"
                            name="brand"
                            value={form.brand}
                            onChange={handleChange}
                            placeholder="e.g. GlowCare"
                            required
                        />

                    </div>

                    {/* CATEGORY */}
                    <div className="form-group">

                        <label>
                            Category *
                        </label>

                        <input
                            type="text"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="e.g. Face Serum"
                            required
                        />

                    </div>

                    {/* PRICE */}
                    <div className="form-group">

                        <label>
                            Price (₹) *
                        </label>

                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="e.g. 799"
                            min="1"
                            step="0.01"
                            required
                        />

                    </div>

                    {/* STOCK */}
                    <div className="form-group">

                        <label>
                            Stock Quantity *
                        </label>

                        <input
                            type="number"
                            name="stockQuantity"
                            value={form.stockQuantity}
                            onChange={handleChange}
                            placeholder="e.g. 100"
                            min="0"
                            step="1"
                            required
                        />

                    </div>

                    {/* SKIN TYPE */}
                    <div className="form-group">

                        <label>
                            Skin Type
                        </label>

                        <input
                            type="text"
                            name="skinType"
                            value={form.skinType}
                            onChange={handleChange}
                            placeholder="e.g. Normal, Dry, Oily"
                        />

                    </div>

                    {/* DESCRIPTION */}
                    <div className="form-group full-width">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Enter product description..."
                            rows="4"
                        />

                    </div>

                    {/* BUTTONS */}
                    <div className="form-actions full-width">

                        <button
                            type="submit"
                            className="save-product-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "💾 Update Product"
                                    : "➕ Add Product"}
                        </button>

                        <button
                            type="button"
                            className="clear-form-button"
                            onClick={resetForm}
                            disabled={saving}
                        >
                            Clear
                        </button>

                    </div>

                </form>
            </div>

            {/* PRODUCT LIST */}
            <div className="products-list-section">

                <div className="products-list-header">

                    <div>

                        <h2>
                            📦 Product List
                        </h2>

                        <p>
                            Total Products:{" "}
                            <strong>
                                {products.length}
                            </strong>
                        </p>

                    </div>

                    <button
                        className="refresh-button"
                        onClick={fetchProducts}
                        disabled={loading}
                    >
                        🔄 Refresh
                    </button>

                </div>

                {/* LOADING */}
                {loading ? (

                    <div className="loading-box">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading products...
                        </p>

                    </div>

                ) : products.length === 0 ? (

                    <div className="empty-products">

                        <div className="empty-icon">
                            📦
                        </div>

                        <h3>
                            No Products Found
                        </h3>

                        <p>
                            Add your first skincare
                            product using the form above.
                        </p>

                    </div>

                ) : (

                    <div className="admin-products-grid">

                        {products.map((product) => (

                            <div
                                className="admin-product-card"
                                key={product._id}
                            >

                                <div className="product-card-icon">
                                    🌿
                                </div>

                                <div className="product-card-content">

                                    <h3>
                                        {product.name}
                                    </h3>

                                    <p className="product-brand">
                                        {product.brand}
                                    </p>

                                    <p className="product-category">
                                        <strong>
                                            Category:
                                        </strong>{" "}
                                        {product.category ||
                                            "N/A"}
                                    </p>

                                    <p className="product-description">
                                        {product.description ||
                                            "No description available."}
                                    </p>

                                    <div className="product-info">

                                        <div>

                                            <span>
                                                Price
                                            </span>

                                            <strong>
                                                ₹
                                                {Number(
                                                    product.price || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>

                                        </div>

                                        <div>

                                            <span>
                                                Stock
                                            </span>

                                            <strong>
                                                {product.stockQuantity ??
                                                    0}
                                            </strong>

                                        </div>

                                    </div>

                                    {product.skinType &&
                                        (Array.isArray(
                                            product.skinType
                                        )
                                            ? product.skinType.length > 0
                                            : product.skinType) && (

                                            <div className="product-skin-type">

                                                <strong>
                                                    Skin Type:
                                                </strong>{" "}

                                                {Array.isArray(
                                                    product.skinType
                                                )
                                                    ? product.skinType.join(
                                                        ", "
                                                    )
                                                    : product.skinType}

                                            </div>
                                        )}

                                    <div className="product-status">

                                        <span
                                            className={
                                                product.isActive === false
                                                    ? "status-inactive"
                                                    : "status-active"
                                            }
                                        >
                                            {product.isActive === false
                                                ? "Inactive"
                                                : "Active"}
                                        </span>

                                    </div>

                                    <div className="product-card-actions">

                                        <button
                                            className="edit-product-button"
                                            onClick={() =>
                                                editProduct(product)
                                            }
                                        >
                                            ✏️ Edit
                                        </button>

                                        <button
                                            className="delete-product-button"
                                            onClick={() =>
                                                deleteProduct(
                                                    product._id
                                                )
                                            }
                                        >
                                            🗑️ Delete
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default AdminProducts;