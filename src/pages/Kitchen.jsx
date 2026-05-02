import React, { useEffect, useState } from "react";
import styles from "../styles/Kitchen.module.css";

const ACTIVE_STATUSES = ["placed", "accepted", "cooking", "ready"];

function Kitchen() {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    const data = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(data.filter((o) => ACTIVE_STATUSES.includes(o.status)));
  };

  useEffect(() => {
    loadOrders();

    // simple polling instead of realtime
    const interval = setInterval(loadOrders, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = (id, status) => {
    const updated = JSON.parse(localStorage.getItem("orders") || "[]")
      .map((o) => (o.id === id ? { ...o, status } : o));

    localStorage.setItem("orders", JSON.stringify(updated));
    loadOrders();
  };

  const buckets = {
    placed: [],
    accepted: [],
    cooking: [],
    ready: [],
  };

  orders.forEach((o) => {
    if (buckets[o.status]) {
      buckets[o.status].push(o);
    }
  });

  return (
    <div className={styles.container}>
      <h1> Kitchen Dashboard</h1>

      <div className={styles.grid}>
        <Column title="New Orders" count={buckets.placed.length}>
          {buckets.placed.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              actionLabel="Accept"
              next="accepted"
              updateStatus={updateStatus}
            />
          ))}
        </Column>

        <Column title="Accepted" count={buckets.accepted.length}>
          {buckets.accepted.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              actionLabel="Start Cooking"
              next="cooking"
              updateStatus={updateStatus}
            />
          ))}
        </Column>

        <Column title="Cooking" count={buckets.cooking.length}>
          {buckets.cooking.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              actionLabel="Mark Ready"
              next="ready"
              updateStatus={updateStatus}
            />
          ))}
        </Column>

        <Column title="Ready" count={buckets.ready.length}>
          {buckets.ready.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              actionLabel="Complete"
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
        {order.items.map((item, i) => (
          <p key={i}>
            <b>{item.quantity}×</b> {item.name}
          </p>
        ))}
      </div>

      <div className={styles.actions}>
        <button onClick={() => updateStatus(order.id, next)}>
          {actionLabel}
        </button>

        <button
          className={styles.cancel}
          onClick={() => updateStatus(order.id, "cancelled")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Kitchen;