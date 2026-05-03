import { useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import { fetchOrderByToken } from "../lib/api";
import styles from "../styles/OrderTracking.module.css";

const STATUS_DISPLAY = {
  placed: { label: "Placed", emoji: "📋", color: "#fbbf24" },
  accepted: { label: "Accepted", emoji: "✅", color: "#34d399" },
  cooking: { label: "Cooking", emoji: "🍳", color: "#60a5fa" },
  ready: { label: "Ready", emoji: "🎉", color: "#8b5cf6" },
  completed: { label: "Completed", emoji: "✔️", color: "#10b981" },
  cancelled: { label: "Cancelled", emoji: "❌", color: "#ef4444" },
};

export default function OrderTracking() {
  const [tokenInput, setTokenInput] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const found = await fetchOrderByToken(Number(tokenInput));
      setOrder(found);
    } catch (searchError) {
      setError(searchError.message || "Order not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <BackButton to="/" label="Back" />
        <div className={styles.header}>
          <h1>Track Your Order</h1>
          <p>Enter your token number to see order status</p>
        </div>

        <form className={styles.form} onSubmit={handleSearch}>
          <input
            type="number"
            placeholder="Token number"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            min="1"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        {order && (
          <div className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div>
                <h2>Order #{order.token_number}</h2>
                <p>{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <div className={styles.statusBadge}>
                <span className={styles.statusEmoji}>
                  {STATUS_DISPLAY[order.status]?.emoji || "⏳"}
                </span>
                <span className={styles.statusLabel}>
                  {STATUS_DISPLAY[order.status]?.label || "Unknown"}
                </span>
              </div>
            </div>

            <div className={styles.items}>
              <h3>Items</h3>
              {order.items.map((item, idx) => (
                <div key={idx} className={styles.item}>
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className={styles.summary}>
              <div>
                <span>Total:</span>
                <strong>₹{order.total_amount}</strong>
              </div>
              <div>
                <span>Est. Time:</span>
                <strong>{order.estimated_time} min</strong>
              </div>
            </div>

            <div className={styles.timeline}>
              <h3>Status</h3>
              {["placed", "accepted", "cooking", "ready"].map((step) => {
                const isActive = ["placed", "accepted", "cooking", "ready"].indexOf(step) <=
                  ["placed", "accepted", "cooking", "ready"].indexOf(order.status);
                return (
                  <div key={step} className={`${styles.timelineStep} ${isActive ? styles.active : ""}`}>
                    <div className={styles.stepDot} />
                    <span>{STATUS_DISPLAY[step].label}</span>
                  </div>
                );
              })}
            </div>

            <Link to="/" className={styles.backLink}>
              ← Back to Menu
            </Link>
          </div>
        )}

        {!order && !error && !loading && (
          <div className={styles.empty}>
            <p>Enter a token number above to track your order.</p>
          </div>
        )}
      </section>
    </main>
  );
}
