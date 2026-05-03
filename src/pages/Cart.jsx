import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart, cartStore } from "../lib/cart-store";
import { createOrder } from "../lib/api";
import BackButton from "../components/BackButton";
import styles from "../styles/Cart.module.css";

function Cart() {
  const { items, totalItems, totalAmount } = useCart();
  const [placing, setPlacing] = useState(false);
  const [orderToken, setOrderToken] = useState(null);

  const handlePlaceOrder = async () => {
    setPlacing(true);

    try {
      const order = await createOrder({
        items,
        total_amount: totalAmount,
        estimated_time: items.reduce(
          (sum, item) => sum + (item.prep_time_minutes || 5),
          0
        ),
        status: "placed",
        customer_name: "",
        customer_note: "",
      });

      cartStore.clear();
      setOrderToken(order.token_number);
    } catch (error) {
      console.error(error);
    } finally {
      setPlacing(false);
    }
  };

  if (totalItems === 0 && !orderToken) {
    return (
      <div className={styles.empty}>
        <BackButton to="/" label="Back" />
        <h2>Your cart is empty 🛒</h2>
        <Link to="/" className={styles.successBtn}>
          Go to Menu
        </Link>
      </div>
    );
  }

  if (orderToken) {
    return (
      <div className={styles.container}>
        <BackButton to="/" label="Back" />
        <div className={styles.success}>
          <div className={styles.successEmoji}>✅</div>
          <h1>Order Placed!</h1>
          <p className={styles.successToken}>Token #{orderToken}</p>
          <p>Your order has been submitted. You can track it using your token number.</p>
          <div className={styles.successActions}>
            <Link to="/track" className={styles.successBtn}>
              🔎 Track Order
            </Link>
            <a href="/" className={styles.successBtnAlt}>
              ← Back to Menu
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <BackButton to="/" label="Back" />
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
        <button onClick={handlePlaceOrder} disabled={placing}>
          {placing ? "Placing..." : "🛒 Place Order"}
        </button>
      </div>
    </div>
  );
}

export default Cart;