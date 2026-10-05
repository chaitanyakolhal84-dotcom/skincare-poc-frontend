import { useEffect, useState } from "react";
import api from "../services/api";
import "./ManageCoupons.css";

function ManageCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        code: "",
        name: "",
        description: "",
        type: "PERCENTAGE",
        discountValue: "",
        buyQuantity: "",
        freeQuantity: "",
        minimumOrderAmount: "0",
        usageLimit: "0",
        startDate: "",
        endDate: "",
        isActive: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    // ================= GET COUPONS =================

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/coupons");

            setCoupons(
                Array.isArray(response.data)
                    ? response.data
                    : response.data?.coupons || []
            );
        } catch (err) {
            console.error("Fetch coupons error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load coupons."
            );
        } finally {
            setLoading(false);
        }
    };

    // ================= HANDLE INPUT =================

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };

    // ================= RESET FORM =================

    const resetForm = () => {
        setForm({
            code: "",
            name: "",
            description: "",
            type: "PERCENTAGE",
            discountValue: "",
            buyQuantity: "",
            freeQuantity: "",
            minimumOrderAmount: "0",
            usageLimit: "0",
            startDate: "",
            endDate: "",
            isActive: true
        });

        setEditingId(null);
    };

    // ================= CREATE / UPDATE =================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        // Coupon code validation
        if (!form.code.trim()) {
            setError("Please enter coupon code.");
            return;
        }

        // Name validation
        if (!form.name.trim()) {
            setError("Please enter coupon name.");
            return;
        }

        // Percentage validation
        if (form.type === "PERCENTAGE") {
            const discount = Number(
                form.discountValue
            );

            if (
                discount <= 0 ||
                discount > 100
            ) {
                setError(
                    "Percentage discount must be between 1 and 100."
                );
                return;
            }
        }

        // Fixed validation
        if (form.type === "FIXED") {
            const discount = Number(
                form.discountValue
            );

            if (discount <= 0) {
                setError(
                    "Fixed discount must be greater than 0."
                );
                return;
            }
        }

        // Buy X Get Y validation
        if (form.type === "BUY_X_GET_Y") {
            if (
                Number(form.buyQuantity) <= 0 ||
                Number(form.freeQuantity) <= 0
            ) {
                setError(
                    "Buy quantity and free quantity must be greater than 0."
                );
                return;
            }
        }

        const payload = {
            code: form.code
                .trim()
                .toUpperCase(),

            name: form.name.trim(),

            description:
                form.description.trim(),

            type: form.type,

            discountValue:
                form.type === "BUY_X_GET_Y"
                    ? 0
                    : Number(
                        form.discountValue || 0
                    ),

            buyQuantity:
                form.type === "BUY_X_GET_Y"
                    ? Number(
                        form.buyQuantity || 0
                    )
                    : 0,

            freeQuantity:
                form.type === "BUY_X_GET_Y"
                    ? Number(
                        form.freeQuantity || 0
                    )
                    : 0,

            minimumOrderAmount:
                Number(
                    form.minimumOrderAmount || 0
                ),

            usageLimit:
                Number(
                    form.usageLimit || 0
                ),

            startDate: form.startDate
                ? new Date(
                    form.startDate
                ).toISOString()
                : new Date().toISOString(),

            endDate: form.endDate
                ? new Date(
                    form.endDate
                ).toISOString()
                : null,

            isActive:
                form.isActive
        };

        try {
            if (editingId) {

                await api.put(
                    `/coupons/${editingId}`,
                    payload
                );

                setMessage(
                    "Coupon updated successfully! ✅"
                );

            } else {

                await api.post(
                    "/coupons",
                    payload
                );

                setMessage(
                    "Coupon created successfully! 🎉"
                );
            }

            resetForm();

            await fetchCoupons();

        } catch (err) {
            console.error(
                "Save coupon error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to save coupon."
            );
        }
    };

    // ================= EDIT =================

    const handleEdit = (coupon) => {
        setEditingId(coupon._id);

        setForm({
            code: coupon.code || "",

            name: coupon.name || "",

            description:
                coupon.description || "",

            type:
                coupon.type ||
                "PERCENTAGE",

            discountValue:
                coupon.discountValue ?? "",

            buyQuantity:
                coupon.buyQuantity ?? "",

            freeQuantity:
                coupon.freeQuantity ?? "",

            minimumOrderAmount:
                coupon.minimumOrderAmount ?? 0,

            usageLimit:
                coupon.usageLimit ?? 0,

            startDate:
                coupon.startDate
                    ? new Date(
                        coupon.startDate
                    )
                        .toISOString()
                        .slice(0, 16)
                    : "",

            endDate:
                coupon.endDate
                    ? new Date(
                        coupon.endDate
                    )
                        .toISOString()
                        .slice(0, 16)
                    : "",

            isActive:
                coupon.isActive
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ================= DELETE =================

    const handleDelete = async (id) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this coupon?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await api.delete(
                `/coupons/${id}`
            );

            setMessage(
                "Coupon deleted successfully! 🗑️"
            );

            await fetchCoupons();

        } catch (err) {
            console.error(
                "Delete coupon error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete coupon."
            );
        }
    };

    // ================= TOGGLE ACTIVE =================

    const toggleActive = async (coupon) => {
        try {
            setError("");
            setMessage("");

            await api.put(
                `/coupons/${coupon._id}`,
                {
                    isActive:
                        !coupon.isActive
                }
            );

            setMessage(
                `Coupon ${coupon.isActive
                    ? "deactivated"
                    : "activated"
                } successfully!`
            );

            await fetchCoupons();

        } catch (err) {
            console.error(
                "Toggle coupon error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update coupon."
            );
        }
    };

    return (
        <div className="manage-coupons-page">

            {/* ================= NAVBAR ================= */}

            <nav className="coupon-navbar">

                <div className="coupon-brand">
                    🌿 Skincare POC
                </div>

                <div className="coupon-nav-links">

                    <a href="/admin">
                        Admin Dashboard
                    </a>

                    <a href="/">
                        Home
                    </a>

                    <a href="/products">
                        Products
                    </a>

                    <a href="/cart">
                        🛒 Cart
                    </a>

                </div>

            </nav>

            {/* ================= MAIN ================= */}

            <main className="coupon-container">

                {/* HEADER */}

                <div className="coupon-header">

                    <div>

                        <span className="coupon-small-title">
                            ADMIN PANEL
                        </span>

                        <h1>
                            Manage Coupons 🎟️
                        </h1>

                        <p>
                            Create coupons that customers
                            can use directly at Checkout.
                        </p>

                    </div>

                    <button
                        className="back-admin-btn"
                        onClick={() =>
                        (window.location.href =
                            "/admin")
                        }
                    >
                        ← Admin Dashboard
                    </button>

                </div>

                {/* SUCCESS */}

                {message && (
                    <div className="coupon-success">
                        {message}
                    </div>
                )}

                {/* ERROR */}

                {error && (
                    <div className="coupon-error">
                        {error}
                    </div>
                )}

                {/* ================= FORM ================= */}

                <section className="coupon-form-card">

                    <div className="section-title">

                        <h2>
                            {editingId
                                ? "✏️ Edit Coupon"
                                : "➕ Create New Coupon"}
                        </h2>

                        <p>
                            This coupon will be available
                            in Checkout.
                        </p>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            {/* CODE */}

                            <div className="form-group">

                                <label>
                                    Coupon Code *
                                </label>

                                <input
                                    type="text"
                                    name="code"
                                    value={form.code}
                                    onChange={handleChange}
                                    placeholder="Example: WELCOME20"
                                    disabled={!!editingId}
                                />

                                <small>
                                    Customers will enter this
                                    code at Checkout.
                                </small>

                            </div>

                            {/* NAME */}

                            <div className="form-group">

                                <label>
                                    Coupon Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Welcome Discount"
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
                                    placeholder="Enter coupon description"
                                    rows="3"
                                />

                            </div>

                            {/* TYPE */}

                            <div className="form-group">

                                <label>
                                    Coupon Type *
                                </label>

                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                >

                                    <option value="PERCENTAGE">
                                        Percentage Discount
                                    </option>

                                    <option value="FIXED">
                                        Fixed Amount
                                    </option>

                                    <option value="BUY_X_GET_Y">
                                        Buy X Get Y Free
                                    </option>

                                </select>

                            </div>

                            {/* DISCOUNT */}

                            {(form.type ===
                                "PERCENTAGE" ||
                                form.type === "FIXED") && (

                                    <div className="form-group">

                                        <label>
                                            {form.type ===
                                                "PERCENTAGE"
                                                ? "Discount Percentage (%) *"
                                                : "Discount Amount (₹) *"}
                                        </label>

                                        <input
                                            type="number"
                                            name="discountValue"
                                            value={
                                                form.discountValue
                                            }
                                            onChange={handleChange}
                                            placeholder={
                                                form.type ===
                                                    "PERCENTAGE"
                                                    ? "Example: 20"
                                                    : "Example: 100"
                                            }
                                            min="1"
                                        />

                                    </div>

                                )}

                            {/* BUY X GET Y */}

                            {form.type ===
                                "BUY_X_GET_Y" && (
                                    <>
                                        <div className="form-group">

                                            <label>
                                                Buy Quantity *
                                            </label>

                                            <input
                                                type="number"
                                                name="buyQuantity"
                                                value={
                                                    form.buyQuantity
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Example: 1"
                                                min="1"
                                            />

                                        </div>

                                        <div className="form-group">

                                            <label>
                                                Free Quantity *
                                            </label>

                                            <input
                                                type="number"
                                                name="freeQuantity"
                                                value={
                                                    form.freeQuantity
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Example: 1"
                                                min="1"
                                            />

                                        </div>
                                    </>
                                )}

                            {/* MINIMUM ORDER */}

                            <div className="form-group">

                                <label>
                                    Minimum Order Amount (₹)
                                </label>

                                <input
                                    type="number"
                                    name="minimumOrderAmount"
                                    value={
                                        form.minimumOrderAmount
                                    }
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="0"
                                />

                                <small>
                                    Enter 0 if there is no minimum.
                                </small>

                            </div>

                            {/* USAGE LIMIT */}

                            <div className="form-group">

                                <label>
                                    Usage Limit
                                </label>

                                <input
                                    type="number"
                                    name="usageLimit"
                                    value={
                                        form.usageLimit
                                    }
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="0"
                                />

                                <small>
                                    0 = Unlimited usage
                                </small>

                            </div>

                            {/* START DATE */}

                            <div className="form-group">

                                <label>
                                    Start Date
                                </label>

                                <input
                                    type="datetime-local"
                                    name="startDate"
                                    value={
                                        form.startDate
                                    }
                                    onChange={handleChange}
                                />

                            </div>

                            {/* END DATE */}

                            <div className="form-group">

                                <label>
                                    End Date
                                </label>

                                <input
                                    type="datetime-local"
                                    name="endDate"
                                    value={
                                        form.endDate
                                    }
                                    onChange={handleChange}
                                />

                                <small>
                                    Leave empty for no expiry.
                                </small>

                            </div>

                            {/* ACTIVE */}

                            <div className="form-group checkbox-group">

                                <label>

                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={
                                            form.isActive
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                    <span>
                                        Coupon is Active
                                    </span>

                                </label>

                            </div>

                        </div>

                        {/* BUTTONS */}

                        <div className="form-actions">

                            <button
                                type="submit"
                                className="save-coupon-btn"
                            >
                                {editingId
                                    ? "Update Coupon"
                                    : "Create Coupon"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="cancel-edit-btn"
                                    onClick={resetForm}
                                >
                                    Cancel Edit
                                </button>
                            )}

                        </div>

                    </form>

                </section>

                {/* ================= COUPON LIST ================= */}

                <section className="coupon-list-section">

                    <div className="list-header">

                        <div>

                            <h2>
                                All Coupons
                            </h2>

                            <p>
                                Coupons created from Admin
                                Dashboard
                            </p>

                        </div>

                        <span className="coupon-count">
                            {coupons.length} Coupons
                        </span>

                    </div>

                    {loading ? (

                        <div className="loading-box">
                            Loading coupons...
                        </div>

                    ) : coupons.length === 0 ? (

                        <div className="empty-box">

                            <div>
                                🎟️
                            </div>

                            <h3>
                                No Coupons Found
                            </h3>

                            <p>
                                Create your first coupon above.
                            </p>

                        </div>

                    ) : (

                        <div className="coupon-table-wrapper">

                            <table className="coupon-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Code
                                        </th>

                                        <th>
                                            Name
                                        </th>

                                        <th>
                                            Type
                                        </th>

                                        <th>
                                            Discount
                                        </th>

                                        <th>
                                            Min Order
                                        </th>

                                        <th>
                                            Usage
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {coupons.map(
                                        (coupon) => (

                                            <tr
                                                key={coupon._id}
                                            >

                                                <td>

                                                    <span className="code-badge">
                                                        {coupon.code}
                                                    </span>

                                                </td>

                                                <td>

                                                    <strong>
                                                        {coupon.name}
                                                    </strong>

                                                    {coupon.description && (
                                                        <small className="table-description">
                                                            {
                                                                coupon.description
                                                            }
                                                        </small>
                                                    )}

                                                </td>

                                                <td>

                                                    {coupon.type ===
                                                        "PERCENTAGE"
                                                        ? "Percentage"
                                                        : coupon.type ===
                                                            "FIXED"
                                                            ? "Fixed"
                                                            : "Buy X Get Y"}

                                                </td>

                                                <td>

                                                    {coupon.type ===
                                                        "PERCENTAGE" &&
                                                        `${coupon.discountValue}%`}

                                                    {coupon.type ===
                                                        "FIXED" &&
                                                        `₹${coupon.discountValue}`}

                                                    {coupon.type ===
                                                        "BUY_X_GET_Y" &&
                                                        `Buy ${coupon.buyQuantity} Get ${coupon.freeQuantity}`}

                                                </td>

                                                <td>
                                                    ₹
                                                    {coupon.minimumOrderAmount ||
                                                        0}
                                                </td>

                                                <td>

                                                    {coupon.usageLimit ===
                                                        0
                                                        ? "Unlimited"
                                                        : `${coupon.usedCount ||
                                                        0
                                                        } / ${coupon.usageLimit
                                                        }`}

                                                </td>

                                                <td>

                                                    <button
                                                        className={
                                                            coupon.isActive
                                                                ? "status-active"
                                                                : "status-inactive"
                                                        }
                                                        onClick={() =>
                                                            toggleActive(
                                                                coupon
                                                            )
                                                        }
                                                    >
                                                        {coupon.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </button>

                                                </td>

                                                <td>

                                                    <div className="action-buttons">

                                                        <button
                                                            className="edit-btn"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    coupon
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    coupon._id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

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

export default ManageCoupons;