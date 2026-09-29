import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Profile.css";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [points, setPoints] = useState(0);

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
        loadPoints(storedUser.id);
    }, [navigate]);

    const loadPoints = async (userId) => {
        try {
            const response = await api.get(
                `/rewards/user/${userId}`
            );

            const data = response.data;

            setPoints(
                data?.points ??
                data?.user?.points ??
                data?.data?.points ??
                0
            );
        } catch (error) {
            console.error(
                "Unable to load points:",
                error
            );

            setPoints(user?.points ?? 0);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    if (!user) {
        return (
            <div className="profile-loading">
                Loading Profile...
            </div>
        );
    }

    return (
        <div className="profile-page">

            {/* Navbar */}
            <nav className="profile-navbar">

                <div
                    className="profile-brand"
                    onClick={() => navigate("/")}
                >
                    🌿 Skincare POC
                </div>

                <div className="profile-nav-links">

                    <button
                        onClick={() => navigate("/")}
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

                    <button className="active">
                        Profile
                    </button>

                    <button
                        onClick={() =>
                            navigate("/cart")
                        }
                    >
                        Cart
                    </button>

                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>
            </nav>

            {/* Main */}
            <main className="profile-container">

                <div className="profile-header">
                    <span>
                        MY ACCOUNT
                    </span>

                    <h1>
                        My Profile 👤
                    </h1>

                    <p>
                        Manage your account information
                        and view your rewards details.
                    </p>
                </div>

                <div className="profile-layout">

                    {/* Profile Card */}
                    <div className="profile-card">

                        <div className="profile-avatar">
                            {user.name
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>

                        <h2>
                            {user.name}
                        </h2>

                        <p className="profile-email">
                            {user.email}
                        </p>

                        <span className="role-badge">
                            {user.role || "user"}
                        </span>

                    </div>

                    {/* Details */}
                    <div className="details-card">

                        <div className="card-title">
                            <h2>
                                Account Details
                            </h2>

                            <span>
                                ✓ Active
                            </span>
                        </div>

                        <div className="details-grid">

                            <div className="detail-item">
                                <label>
                                    Full Name
                                </label>

                                <strong>
                                    {user.name}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <label>
                                    Email Address
                                </label>

                                <strong>
                                    {user.email}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <label>
                                    Account Role
                                </label>

                                <strong>
                                    {user.role ||
                                        "user"}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <label>
                                    Reward Points
                                </label>

                                <strong className="points-value">
                                    ⭐ {points}
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>

                {/* Referral Card */}
                <div className="profile-referral-card">

                    <div className="referral-content">

                        <div className="referral-symbol">
                            🔗
                        </div>

                        <div>
                            <h2>
                                Your Referral Code
                            </h2>

                            <p>
                                Share this code with your
                                friends to earn rewards.
                            </p>
                        </div>

                    </div>

                    <div className="profile-referral-code">
                        {user.referralCode ||
                            "N/A"}
                    </div>

                </div>

                {/* Quick Actions */}
                <div className="quick-section">

                    <h2>
                        Quick Actions
                    </h2>

                    <div className="quick-grid">

                        <button
                            onClick={() =>
                                navigate("/products")
                            }
                        >
                            <span>🛍️</span>
                            <div>
                                <strong>
                                    Browse Products
                                </strong>
                                <small>
                                    Explore skincare
                                    products
                                </small>
                            </div>
                        </button>

                        <button
                            onClick={() =>
                                navigate("/orders")
                            }
                        >
                            <span>📦</span>
                            <div>
                                <strong>
                                    My Orders
                                </strong>
                                <small>
                                    Track your orders
                                </small>
                            </div>
                        </button>

                        <button
                            onClick={() =>
                                navigate("/rewards")
                            }
                        >
                            <span>⭐</span>
                            <div>
                                <strong>
                                    My Rewards
                                </strong>
                                <small>
                                    View reward history
                                </small>
                            </div>
                        </button>

                        <button
                            onClick={() =>
                                navigate("/cart")
                            }
                        >
                            <span>🛒</span>
                            <div>
                                <strong>
                                    Shopping Cart
                                </strong>
                                <small>
                                    View your cart
                                </small>
                            </div>
                        </button>

                    </div>

                </div>

            </main>
        </div>
    );
}

export default Profile;