import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminCoupons.css";

function AdminCoupons() {
    const navigate = useNavigate();

    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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

    // ==========================================
    // CHECK ADMIN
    // ==========================================

    useEffect(() => {
        const savedUser = JSON.parse(
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

        loadCoupons();
    }, [navigate]);

    // ==========================================
    // LOAD COUPONS
    // ==========================================

    const loadCoupons = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await api.get("/coupons");

            setCoupons(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.coupons || []
            );

        } catch (err) {
            console.error(
                "Load coupons error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load coupons."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // FORM CHANGE
    // ==========================================

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

    // ==========================================
    // RESET FORM
    // ==========================================

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
        setError("");
    };

    // ==========================================
    // CREATE / UPDATE
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!form.code.trim()) {
            setError("Coupon code is required.");
            return;
        }

        if (!form.name.trim()) {
            setError("Coupon name is required.");
            return;
        }

        if (
            form.type === "PERCENTAGE" &&
            (
                !form.discountValue ||
                Number(form.discountValue) <= 0 ||
                Number(form.discountValue) > 100
            )
        ) {
            setError(
                "Percentage discount must be between 1 and 100."
            );
            return;
        }

        if (
            form.type === "FIXED" &&
            (
                !form.discountValue ||
                Number(form.discountValue) <= 0
            )
        ) {
            setError(
                "Fixed discount must be greater than 0."
            );
            return;
        }

        if (
            form.type === "BUY_X_GET_Y" &&
            (
                Number(form.buyQuantity) <= 0 ||
                Number(form.freeQuantity) <= 0
            )
        ) {
            setError(
                "Buy quantity and free quantity must be greater than 0."
            );
            return;
        }

        try {
            setSaving(true);

            const data = {
                code:
                    form.code
                        .trim()
                        .toUpperCase(),

                name:
                    form.name.trim(),

                description:
                    form.description.trim(),

                type:
                    form.type,

                discountValue:
                    Number(form.discountValue) || 0,

                buyQuantity:
                    Number(form.buyQuantity) || 0,

                freeQuantity:
                    Number(form.freeQuantity) || 0,

                minimumOrderAmount:
                    Number(
                        form.minimumOrderAmount
                    ) || 0,

                usageLimit:
                    Number(form.usageLimit) || 0,

                startDate:
                    form.startDate ||
                    new Date().toISOString(),

                endDate:
                    form.endDate || null,

                isActive:
                    form.isActive
            };

            if (editingId) {
                await api.put(
                    `/coupons/${editingId}`,
                    data
                );

                setSuccess(
                    "Coupon updated successfully."
                );
            } else {
                await api.post(
                    "/coupons",
                    data
                );

                setSuccess(
                    "Coupon created successfully."
                );
            }

            resetForm();
            await loadCoupons();

        } catch (err) {
            console.error(
                "Save coupon error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to save coupon."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // EDIT
    // ==========================================

    const handleEdit = (coupon) => {
        setEditingId(coupon._id);

        setForm({
            code: coupon.code || "",
            name: coupon.name || "",
            description:
                coupon.description || "",
            type:
                coupon.type || "PERCENTAGE",
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
                    ? new Date(coupon.startDate)
                        .toISOString()
                        .slice(0, 16)
                    : "",
            endDate:
                coupon.endDate
                    ? new Date(coupon.endDate)
                        .toISOString()
                        .slice(0, 16)
                    : "",
            isActive:
                coupon.isActive !== false
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete = async (id) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this coupon?"
            );

        if (!confirmDelete) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/coupons/${id}`
            );

            setSuccess(
                "Coupon deleted successfully."
            );

            await loadCoupons();

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

    // ==========================================
    // TOGGLE ACTIVE
    // ==========================================

    const toggleActive = async (coupon) => {
        try {
            setError("");
            setSuccess("");

            await api.put(
                `/coupons/${coupon._id}`,
                {
                    isActive:
                        !coupon.isActive
                }
            );

            setSuccess(
                `Coupon ${!coupon.isActive
                    ? "activated"
                    : "deactivated"
                } successfully.`
            );

            await loadCoupons();

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

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="admin-coupons-loading">
                🌿
                <p>
                    Loading Coupons...
                </p>
            </div>
        );
    }

    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="admin-coupons-page">

            {/* NAVBAR */}

            <nav className="admin-coupons-navbar">

                <div className="admin-coupons-brand">
                    🌿 Skincare POC
                    <span>ADMIN</span>
                </div>

                <div className="admin-coupons-nav">

                    <button
                        onClick={() =>
                            navigate("/admin")
                        }
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() =>
                            navigate(
                                "/admin/promotions"
                            )
                        }
                    >
                        Promotions
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

                </div>

            </nav>

            <main className="admin-coupons-container">

                {/* HEADER */}

                <div className="admin-coupons-header">

                    <div>
                        <h1>
                            Manage Coupons
                        </h1>

                        <p>
                            Create and manage
                            coupons used at Checkout.
                        </p>
                    </div>

                    <button
                        className="back-dashboard-btn"
                        onClick={() =>
                            navigate("/admin")
                        }
                    >
                        ← Dashboard
                    </button>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="coupon-alert coupon-alert-error">
                        ❌ {error}
                    </div>
                )}

                {/* SUCCESS */}

                {success && (
                    <div className="coupon-alert coupon-alert-success">
                        ✅ {success}
                    </div>
                )}

                {/* FORM */}

                <section className="coupon-form-card">

                    <div className="coupon-form-title">

                        <div>
                            🎟️
                        </div>

                        <div>
                            <h2>
                                {editingId
                                    ? "Edit Coupon"
                                    : "Create New Coupon"}
                            </h2>

                            <p>
                                This coupon will be
                                available in Checkout.
                            </p>
                        </div>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                    >

                        <div className="coupon-form-grid">

                            {/* CODE */}

                            <div className="form-group">

                                <label>
                                    Coupon Code *
                                </label>

                                <input
                                    type="text"
                                    name="code"
                                    value={form.code}
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="GET20"
                                    disabled={
                                        !!editingId
                                    }
                                />

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
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="20% OFF"
                                />

                            </div>

                            {/* TYPE */}

                            <div className="form-group">

                                <label>
                                    Discount Type *
                                </label>

                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="PERCENTAGE">
                                        Percentage
                                    </option>

                                    <option value="FIXED">
                                        Fixed Amount
                                    </option>

                                    <option value="BUY_X_GET_Y">
                                        Buy X Get Y
                                    </option>

                                </select>

                            </div>

                            {/* DISCOUNT */}

                            {form.type !==
                                "BUY_X_GET_Y" && (

                                    <div className="form-group">

                                        <label>
                                            Discount Value *
                                        </label>

                                        <input
                                            type="number"
                                            name="discountValue"
                                            value={
                                                form.discountValue
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder={
                                                form.type ===
                                                    "PERCENTAGE"
                                                    ? "20"
                                                    : "100"
                                            }
                                            min="0"
                                        />

                                    </div>
                                )}

                            {/* BUY QUANTITY */}

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
                                                min="1"
                                                placeholder="1"
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
                                                min="1"
                                                placeholder="1"
                                            />

                                        </div>
                                    </>
                                )}

                            {/* MINIMUM */}

                            <div className="form-group">

                                <label>
                                    Minimum Order Amount
                                </label>

                                <input
                                    type="number"
                                    name="minimumOrderAmount"
                                    value={
                                        form.minimumOrderAmount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    placeholder="0"
                                />

                            </div>

                            {/* USAGE */}

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
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    placeholder="0 = Unlimited"
                                />

                            </div>

                            {/* START */}

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
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                            {/* END */}

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
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                        </div>

                        {/* DESCRIPTION */}

                        <div className="form-group full-width">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    form.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Get 20% off on your order"
                                rows="3"
                            />

                        </div>

                        {/* ACTIVE */}

                        <label className="active-checkbox">

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
                                Coupon Active
                            </span>

                        </label>

                        {/* BUTTONS */}

                        <div className="coupon-form-actions">

                            <button
                                type="submit"
                                className="save-coupon-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Coupon"
                                        : "Create Coupon"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="cancel-edit-btn"
                                    onClick={
                                        resetForm
                                    }
                                >
                                    Cancel Edit
                                </button>
                            )}

                        </div>

                    </form>

                </section>

                {/* COUPON LIST */}

                <section className="coupon-list-card">

                    <div className="coupon-list-header">

                        <div>
                            <h2>
                                All Coupons
                            </h2>

                            <p>
                                {coupons.length} coupon
                                {coupons.length !== 1
                                    ? "s"
                                    : ""}
                            </p>
                        </div>

                        <button
                            onClick={loadCoupons}
                            className="refresh-coupons-btn"
                        >
                            ↻ Refresh
                        </button>

                    </div>

                    {coupons.length === 0 ? (

                        <div className="empty-coupons">
                            🎟️
                            <h3>
                                No Coupons Yet
                            </h3>
                            <p>
                                Create your first
                                coupon above.
                            </p>
                        </div>

                    ) : (

                        <div className="coupon-table-wrapper">

                            <table>

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
                                                key={
                                                    coupon._id
                                                }
                                            >

                                                <td>

                                                    <strong className="coupon-code">
                                                        {
                                                            coupon.code
                                                        }
                                                    </strong>

                                                </td>

                                                <td>
                                                    {
                                                        coupon.name
                                                    }
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
                                                        "PERCENTAGE"
                                                        ? `${coupon.discountValue}%`
                                                        : coupon.type ===
                                                            "FIXED"
                                                            ? `₹${coupon.discountValue}`
                                                            : `Buy ${coupon.buyQuantity} Get ${coupon.freeQuantity}`}

                                                </td>

                                                <td>

                                                    {coupon.usedCount ||
                                                        0}

                                                    {" / "}

                                                    {coupon.usageLimit >
                                                        0
                                                        ? coupon.usageLimit
                                                        : "∞"}

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

                                                    <div className="coupon-actions">

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

export default AdminCoupons;