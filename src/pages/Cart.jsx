import React from "react";
import { useCart, cartStore } from "../lib/cart-store";
import styles from "../styles/Cart.module.css";

function Cart() {
  const { items, totalItems, totalAmount } = useCart();

  if (totalItems === 0) {
    return (
      <div className={styles.empty}>
        <h2>Your cart is empty 🛒</h2>
        <a href="/">Go to Menu</a>
      </div>
    );
  }

  const handlePlaceOrder = () => {
  const existing = JSON.parse(localStorage.getItem("orders") || "[]");

  const order = {
    id: Date.now(),
    token_number: existing.length + 1,
    items,
    total_amount: totalAmount,
    estimated_time: items.reduce(
      (sum, i) => sum + (i.prep_time_minutes || 5),
      0
    ),
    status: "placed",
    created_at: new Date().toISOString(),
  };

  localStorage.setItem("orders", JSON.stringify([...existing, order]));

  cartStore.clear();

  alert(`✅ Order placed! Token #${order.token_number}`);
};
  return (
    <div className={styles.container}>
      <h1>Your Cart</h1>

      {items.map((item) => (
        <div key={item.menuItemId} className={styles.item}>
          <div>
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
          </div>

          <div className={styles.controls}>
            <button onClick={() => cartStore.setQuantity(item.menuItemId, item.quantity - 1)}>−</button>
            <span>{item.quantity}</span>
            <button onClick={() => cartStore.setQuantity(item.menuItemId, item.quantity + 1)}>+</button>
          </div>

          <div>₹{item.price * item.quantity}</div>

          <button onClick={() => cartStore.remove(item.menuItemId)}>❌</button>
        </div>
      ))}

      <div className={styles.footer}>
        <h2>Total: ₹{totalAmount}</h2>
        <button onClick={handlePlaceOrder}>Place Order</button>
      </div>
    </div>
  );
}

export default Cart;