import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Rewards.css";

function Rewards() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [points, setPoints] = useState(0);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedUser = JSON.parse(
            localStorage.getItem("user")
        );

        const token = localStorage.getItem("token");

        if (!token || !storedUser) {
            navigate("/login");
            return;
        }

        setUser(storedUser);
        loadRewards(storedUser.id);
    }, [navigate]);

    const loadRewards = async (userId) => {
        try {
            setLoading(true);
            setError("");

            const [pointsResponse, historyResponse] =
                await Promise.all([
                    api.get(`/rewards/user/${userId}`),
                    api.get(`/rewards/history/${userId}`)
                ]);

            const pointsData = pointsResponse.data;
            const historyData = historyResponse.data;

            const currentPoints =
                pointsData?.points ??
                pointsData?.user?.points ??
                pointsData?.data?.points ??
                0;

            const rewardHistory =
                historyData?.history ??
                historyData?.rewards ??
                historyData?.data ??
                (Array.isArray(historyData)
                    ? historyData
                    : []);

            setPoints(currentPoints);
            setHistory(
                Array.isArray(rewardHistory)
                    ? rewardHistory
                    : []
            );
        } catch (err) {
            console.error("Rewards error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load rewards"
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    if (loading) {
        return (
            <div className="rewards-loading">
                <div className="loading-icon">🌿</div>
                <h2>Loading Rewards...</h2>
            </div>
        );
    }

    return (
        <div className="rewards-page">

            {/* Navbar */}
            <nav className="rewards-navbar">

                <div
                    className="rewards-brand"
                    onClick={() => navigate("/")}
                >
                    🌿 Skincare POC
                </div>

                <div className="rewards-nav-links">

                    <button
                        onClick={() => navigate("/")}
                    >
                        Home
                    </button>

                    <button
                        onClick={() => navigate("/products")}
                    >
                        Products
                    </button>

                    <button
                        onClick={() => navigate("/orders")}
                    >
                        My Orders
                    </button>

                    <button className="active">
                        Rewards
                    </button>

                    <button
                        onClick={() => navigate("/cart")}
                    >
                        Cart
                    </button>

                    <button
                        className="logout-btn"
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            navigate("/login");
                        }}
                    >
                        Logout
                    </button>

                </div>
            </nav>

            {/* Main Content */}
            <main className="rewards-container">

                <div className="rewards-heading">
                    <div>
                        <span className="small-title">
                            MY REWARDS
                        </span>

                        <h1>
                            Welcome, {user?.name || "User"} 🎉
                        </h1>

                        <p>
                            Track your skincare rewards,
                            referral points and purchase points.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="rewards-error">
                        ⚠️ {error}
                    </div>
                )}

                {/* Points Cards */}
                <div className="points-grid">

                    <div className="points-card main-points">
                        <div className="points-icon">
                            ⭐
                        </div>

                        <div>
                            <span>
                                Current Points
                            </span>

                            <strong>
                                {points}
                            </strong>

                            <small>
                                Reward points available
                            </small>
                        </div>
                    </div>

                    <div className="points-card">
                        <div className="points-icon">
                            🎁
                        </div>

                        <div>
                            <span>
                                Reward Entries
                            </span>

                            <strong>
                                {history.length}
                            </strong>

                            <small>
                                Total reward activities
                            </small>
                        </div>
                    </div>

                    <div className="points-card">
                        <div className="points-icon">
                            🔗
                        </div>

                        <div>
                            <span>
                                Referral Code
                            </span>

                            <strong className="referral-code">
                                {user?.referralCode || "N/A"}
                            </strong>

                            <small>
                                Share with your friends
                            </small>
                        </div>
                    </div>

                </div>

                {/* Referral Section */}
                <div className="referral-card">

                    <div className="referral-left">
                        <div className="referral-icon">
                            🔗
                        </div>

                        <div>
                            <h2>
                                Invite Friends & Earn Rewards
                            </h2>

                            <p>
                                Share your referral code and
                                earn reward points when your
                                referrals complete eligible
                                purchases.
                            </p>
                        </div>
                    </div>

                    <div className="referral-code-box">
                        <span>Your Referral Code</span>

                        <strong>
                            {user?.referralCode || "N/A"}
                        </strong>
                    </div>

                </div>

                {/* Reward History */}
                <section className="history-section">

                    <div className="section-header">
                        <div>
                            <span className="small-title">
                                TRANSACTIONS
                            </span>

                            <h2>
                                Reward History
                            </h2>
                        </div>

                        <span className="history-count">
                            {history.length} entries
                        </span>
                    </div>

                    {history.length === 0 ? (
                        <div className="empty-history">
                            <div>🎁</div>

                            <h3>
                                No rewards yet
                            </h3>

                            <p>
                                Complete purchases or referrals
                                to start earning points.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/products")
                                }
                            >
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <div className="history-list">

                            {history.map(
                                (reward, index) => {

                                    const rewardPoints =
                                        reward.points ??
                                        reward.pointsAwarded ??
                                        reward.amount ??
                                        0;

                                    const rewardType =
                                        reward.type ||
                                        reward.rewardType ||
                                        "Reward";

                                    const description =
                                        reward.description ||
                                        "Reward points activity";

                                    const rewardDate =
                                        reward.createdAt ||
                                        reward.date ||
                                        reward.awardedAt;

                                    return (
                                        <div
                                            className="history-item"
                                            key={
                                                reward._id ||
                                                reward.id ||
                                                index
                                            }
                                        >

                                            <div className="history-icon">
                                                {rewardType
                                                    .toLowerCase()
                                                    .includes(
                                                        "referral"
                                                    )
                                                    ? "🔗"
                                                    : rewardType
                                                        .toLowerCase()
                                                        .includes(
                                                            "redeem"
                                                        )
                                                        ? "🎁"
                                                        : "⭐"}
                                            </div>

                                            <div className="history-details">

                                                <h3>
                                                    {rewardType}
                                                </h3>

                                                <p>
                                                    {description}
                                                </p>

                                                <small>
                                                    {formatDate(
                                                        rewardDate
                                                    )}
                                                </small>

                                            </div>

                                            <div
                                                className={
                                                    `history-points ${Number(
                                                        rewardPoints
                                                    ) >= 0
                                                        ? "earned"
                                                        : "redeemed"
                                                    }`
                                                }
                                            >
                                                {Number(
                                                    rewardPoints
                                                ) >= 0
                                                    ? "+"
                                                    : ""}
                                                {rewardPoints}
                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </section>

            </main>
        </div>
    );
}

export default Rewards;