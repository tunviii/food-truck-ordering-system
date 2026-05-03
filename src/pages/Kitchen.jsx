import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { fetchOrders, updateOrderStatus } from "../lib/api";
import styles from "../styles/Kitchen.module.css";

const ACTIVE_STATUSES = ["placed", "accepted", "cooking", "ready"];

function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await fetchOrders();
      setOrders(data.filter((order) => ACTIVE_STATUSES.includes(order.status)));
      setError("");
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      if (silent) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      await loadOrders();
    };

    bootstrap();

    const interval = setInterval(() => {
      loadOrders({ silent: true });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    setError("");

    try {
      await updateOrderStatus(id, status);
      await loadOrders({ silent: true });
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  const buckets = {
    placed: [],
    accepted: [],
    cooking: [],
    ready: [],
  };

  orders.forEach((order) => {
    if (buckets[order.status]) {
      buckets[order.status].push(order);
    }
  });

  return (
    <div className={styles.container}>
      <BackButton to="/" label="Back" />
      <h1>Kitchen Dashboard</h1>
      {(loading || refreshing) && <p>Loading orders...</p>}
      {error && <p>{error}</p>}

      <div className={styles.grid}>
        <Column title="New Orders" count={buckets.placed.length}>
          {buckets.placed.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              actionLabel="✅ Accept"
              next="accepted"
              updateStatus={updateStatus}
            />
          ))}
        </Column>

        <Column title="Accepted" count={buckets.accepted.length}>
          {buckets.accepted.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              actionLabel="🍳 Start Cooking"
              next="cooking"
              updateStatus={updateStatus}
            />
          ))}
        </Column>

        <Column title="Cooking" count={buckets.cooking.length}>
          {buckets.cooking.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              actionLabel="🎉 Mark Ready"
              next="ready"
              updateStatus={updateStatus}
            />
          ))}
        </Column>

        <Column title="Ready" count={buckets.ready.length}>
          {buckets.ready.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              actionLabel="✔️ Complete"
              next="completed"
              updateStatus={updateStatus}
              ready
            />
          ))}
        </Column>
      </div>
    </div>
  );
}

function Column({ title, count, children }) {
  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <h2>{title}</h2>
        <span>{count}</span>
      </div>

      <div className={styles.columnBody}>
        {children.length ? children : <p className={styles.empty}>No orders</p>}
      </div>
    </div>
  );
}

function OrderCard({ order, actionLabel, next, updateStatus, ready }) {
  return (
    <div className={`${styles.card} ${ready ? styles.ready : ""}`}>
      <div className={styles.cardHeader}>
        <h3>#{order.token_number || order.id}</h3>
        <span>{new Date(order.created_at).toLocaleTimeString()}</span>
      </div>

      <div className={styles.items}>
        {order.items.map((item, index) => (
          <p key={`${order.id}-${index}`}>
            <b>{item.quantity}×</b> {item.name}
          </p>
        ))}
      </div>

      <div className={styles.actions}>
        <button onClick={() => updateStatus(order.id, next)}>{actionLabel}</button>

        <button
          className={styles.cancel}
          onClick={() => updateStatus(order.id, "cancelled")}
        >
          ✖ Cancel
        </button>
      </div>
    </div>
  );
}

export default Kitchen;