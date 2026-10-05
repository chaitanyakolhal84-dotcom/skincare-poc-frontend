import React, { useEffect, useState } from "react";
import "./ManagePromotions.css";

const API_URL = "http://localhost:5000/api/promotions";

const emptyForm = {
    title: "",
    subtitle: "",
    description: "",
    couponCode: "",
    buttonText: "Shop Now",
    discountText: "",
    startDate: "",
    endDate: "",
    isActive: true,
    showOnHome: true
};

function ManagePromotions() {
    const [promotions, setPromotions] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const getToken = () => {
        return localStorage.getItem("token");
    };

    // ==========================================
    // GET ALL PROMOTIONS
    // ==========================================
    const fetchPromotions = async () => {
        try {
            setLoading(true);
            setError("");

            const token = getToken();

            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load promotions"
                );
            }

            setPromotions(data.promotions || []);

        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    // ==========================================
    // HANDLE INPUT
    // ==========================================
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // ==========================================
    // OPEN CREATE FORM
    // ==========================================
    const handleCreate = () => {
        setEditingId(null);

        setForm({
            ...emptyForm
        });

        setShowForm(true);
        setError("");
    };

    // ==========================================
    // OPEN EDIT FORM
    // ==========================================
    const handleEdit = (promotion) => {
        setEditingId(promotion._id);

        setForm({
            title: promotion.title || "",
            subtitle: promotion.subtitle || "",
            description: promotion.description || "",
            couponCode: promotion.couponCode || "",
            buttonText: promotion.buttonText || "Shop Now",
            discountText: promotion.discountText || "",
            startDate: promotion.startDate
                ? promotion.startDate.substring(0, 10)
                : "",
            endDate: promotion.endDate
                ? promotion.endDate.substring(0, 10)
                : "",
            isActive: promotion.isActive,
            showOnHome: promotion.showOnHome
        });

        setShowForm(true);
        setError("");
    };

    // ==========================================
    // CREATE / UPDATE
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            const token = getToken();

            const payload = {
                title: form.title,
                subtitle: form.subtitle,
                description: form.description,
                couponCode: form.couponCode,
                buttonText: form.buttonText,
                discountText: form.discountText,
                startDate: form.startDate
                    ? new Date(
                        `${form.startDate}T00:00:00`
                    ).toISOString()
                    : new Date().toISOString(),
                endDate: form.endDate
                    ? new Date(
                        `${form.endDate}T23:59:59`
                    ).toISOString()
                    : null,
                isActive: form.isActive,
                showOnHome: form.showOnHome
            };

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to save promotion"
                );
            }

            alert(
                editingId
                    ? "Promotion updated successfully!"
                    : "Promotion created successfully!"
            );

            setShowForm(false);
            setEditingId(null);
            setForm({
                ...emptyForm
            });

            fetchPromotions();

        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // TOGGLE ACTIVE
    // ==========================================
    const handleToggle = async (id) => {
        try {
            const token = getToken();

            const response = await fetch(
                `${API_URL}/${id}/toggle`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update status"
                );
            }

            fetchPromotions();

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // ==========================================
    // TOGGLE HOME VISIBILITY
    // ==========================================
    const handleHomeVisibility = async (promotion) => {
        try {
            const token = getToken();

            const response = await fetch(
                `${API_URL}/${promotion._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        showOnHome: !promotion.showOnHome
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update home visibility"
                );
            }

            fetchPromotions();

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // ==========================================
    // DELETE
    // ==========================================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this promotion?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = getToken();

            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete promotion"
                );
            }

            alert("Promotion deleted successfully!");

            fetchPromotions();

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // ==========================================
    // CANCEL FORM
    // ==========================================
    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setForm({
            ...emptyForm
        });
        setError("");
    };

    return (
        <div className="manage-promotions-page">

            <div className="promotion-header">

                <div>
                    <h1>Manage Promotions</h1>

                    <p>
                        Create and manage offers displayed
                        on the Home page.
                    </p>
                </div>

                <button
                    className="create-promotion-btn"
                    onClick={handleCreate}
                >
                    + Create Promotion
                </button>

            </div>

            {error && (
                <div className="promotion-error">
                    {error}
                </div>
            )}

            {/* =====================================
                CREATE / EDIT FORM
            ====================================== */}

            {showForm && (
                <div className="promotion-form-card">

                    <h2>
                        {editingId
                            ? "Edit Promotion"
                            : "Create New Promotion"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="promotion-form-grid">

                            <div className="form-group">
                                <label>
                                    Promotion Title *
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="BUY 1 GET 1 FREE 🎁"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Subtitle *
                                </label>

                                <input
                                    type="text"
                                    name="subtitle"
                                    value={form.subtitle}
                                    onChange={handleChange}
                                    placeholder="LIMITED OFFER"
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Enter offer description"
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Coupon Code
                                </label>

                                <input
                                    type="text"
                                    name="couponCode"
                                    value={form.couponCode}
                                    onChange={handleChange}
                                    placeholder="BUY1GET1"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Discount Text
                                </label>

                                <input
                                    type="text"
                                    name="discountText"
                                    value={form.discountText}
                                    onChange={handleChange}
                                    placeholder="BUY 1 GET 1 FREE"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Button Text
                                </label>

                                <input
                                    type="text"
                                    name="buttonText"
                                    value={form.buttonText}
                                    onChange={handleChange}
                                    placeholder="Shop Now"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    name="startDate"
                                    value={form.startDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    name="endDate"
                                    value={form.endDate}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>

                        <div className="promotion-checkboxes">

                            <label>
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={form.isActive}
                                    onChange={handleChange}
                                />

                                Active Promotion
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    name="showOnHome"
                                    checked={form.showOnHome}
                                    onChange={handleChange}
                                />

                                Show on Home
                            </label>

                        </div>

                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="save-promotion-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Promotion"
                                        : "Create Promotion"}
                            </button>

                            <button
                                type="button"
                                className="cancel-promotion-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* =====================================
                PROMOTION LIST
            ====================================== */}

            <div className="promotion-list">

                <div className="list-title">
                    <h2>
                        All Promotions
                    </h2>

                    <span>
                        {promotions.length} Promotion
                        {promotions.length !== 1
                            ? "s"
                            : ""}
                    </span>
                </div>

                {loading ? (
                    <div className="promotion-loading">
                        Loading promotions...
                    </div>
                ) : promotions.length === 0 ? (
                    <div className="no-promotions">
                        <h3>
                            No Promotions Found
                        </h3>

                        <p>
                            Create your first promotion
                            for the Home page.
                        </p>
                    </div>
                ) : (
                    <div className="promotion-grid">

                        {promotions.map(
                            (promotion) => (
                                <div
                                    className="promotion-card"
                                    key={
                                        promotion._id
                                    }
                                >

                                    <div className="card-top">

                                        <span
                                            className={
                                                promotion.isActive
                                                    ? "status active"
                                                    : "status inactive"
                                            }
                                        >
                                            {promotion.isActive
                                                ? "● Active"
                                                : "● Inactive"}
                                        </span>

                                        <span
                                            className={
                                                promotion.showOnHome
                                                    ? "home-status visible"
                                                    : "home-status hidden"
                                            }
                                        >
                                            {promotion.showOnHome
                                                ? "🏠 Home"
                                                : "🚫 Hidden"}
                                        </span>

                                    </div>

                                    <h3>
                                        {promotion.title}
                                    </h3>

                                    <h4>
                                        {
                                            promotion.subtitle
                                        }
                                    </h4>

                                    {promotion.discountText && (
                                        <div className="discount-badge">
                                            {
                                                promotion.discountText
                                            }
                                        </div>
                                    )}

                                    {promotion.description && (
                                        <p className="promotion-description">
                                            {
                                                promotion.description
                                            }
                                        </p>
                                    )}

                                    {promotion.couponCode && (
                                        <div className="coupon-display">
                                            <span>
                                                Coupon:
                                            </span>

                                            <strong>
                                                {
                                                    promotion.couponCode
                                                }
                                            </strong>
                                        </div>
                                    )}

                                    <div className="promotion-dates">

                                        <span>
                                            Start:{" "}
                                            {promotion.startDate
                                                ? new Date(
                                                    promotion.startDate
                                                ).toLocaleDateString()
                                                : "-"}
                                        </span>

                                        <span>
                                            End:{" "}
                                            {promotion.endDate
                                                ? new Date(
                                                    promotion.endDate
                                                ).toLocaleDateString()
                                                : "No expiry"}
                                        </span>

                                    </div>

                                    <div className="promotion-actions">

                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                handleEdit(
                                                    promotion
                                                )
                                            }
                                        >
                                            ✏️ Edit
                                        </button>

                                        <button
                                            className={
                                                promotion.isActive
                                                    ? "toggle-btn deactivate"
                                                    : "toggle-btn activate"
                                            }
                                            onClick={() =>
                                                handleToggle(
                                                    promotion._id
                                                )
                                            }
                                        >
                                            {promotion.isActive
                                                ? "🔴 Deactivate"
                                                : "🟢 Activate"}
                                        </button>

                                        <button
                                            className={
                                                promotion.showOnHome
                                                    ? "home-btn hide"
                                                    : "home-btn show"
                                            }
                                            onClick={() =>
                                                handleHomeVisibility(
                                                    promotion
                                                )
                                            }
                                        >
                                            {promotion.showOnHome
                                                ? "🚫 Hide Home"
                                                : "🏠 Show Home"}
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(
                                                    promotion._id
                                                )
                                            }
                                        >
                                            🗑️ Delete
                                        </button>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            </div>

        </div>
    );
}

export default ManagePromotions;