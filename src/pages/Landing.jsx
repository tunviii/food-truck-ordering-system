import { useState, useMemo, useEffect } from "react";
import styles from "../styles/Landing.module.css";
import heroImage from "../assets/hero-noodles.jpg";
import { Link } from "react-router-dom";
import { useMenu } from "../lib/menuStore";
import { cartStore, useCart } from "../lib/cart-store";
import { clearAuthSession, getAuthSession } from "../lib/auth";

// ─── Types & Constants ────────────────────────────────────────────────────────
const CATEGORY_LABELS = {
  noodles: "Noodles",
  rice: "Rice",
  manchurian: "Manchurian",
  starters: "Starters",
  soups: "Soups",
  beverages: "Beverages",
  combos: "Combos",
};

const CATEGORY_EMOJI = {
  noodles: "🍜",
  rice: "🍚",
  manchurian: "🥟",
  starters: "🥢",
  soups: "🍲",
  beverages: "🥤",
  combos: "🍱",
};

const ALL = "all";

// ─── Category Chip ─────────────────────────────────────────────────────────────
function CategoryChip({ active, onClick, label, emoji }) {
  return (
    <button
      className={`${styles.chip} ${active ? styles.chipActive : ""}`}
      onClick={onClick}
    >
      <span>{emoji}</span>
      {label}
    </button>
  );
}

// ─── Menu Item Card ────────────────────────────────────────────────────────────
function MenuItemCard({ item }) {
  const [added, setAdded] = useState(false);

  // Read qty from cart reactively
  const [qty, setQty] = useState(() => {
    const found = cartStore.getItems().find((i) => i.menuItemId === item.id);
    return found ? found.quantity : 0;
  });

  useEffect(() => {
    const sync = () => {
      const found = cartStore.getItems().find((i) => i.menuItemId === item.id);
      setQty(found ? found.quantity : 0);
    };
    const unsub = cartStore.subscribe(sync);
    return unsub;
  }, [item.id]);

  function handleAdd(e) {
    e.stopPropagation();
    cartStore.add({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      isVeg: item.is_veg,
      prep_time_minutes: item.prep_time_minutes,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 600);
  }

  function handleInc(e) {
    e.stopPropagation();
    cartStore.setQuantity(item.id, qty + 1);
  }

  function handleDec(e) {
    e.stopPropagation();
    cartStore.setQuantity(item.id, qty - 1);
  }

  return (
    <div className={styles.card} onClick={qty === 0 ? handleAdd : undefined}>
      {/* Veg / non-veg dot */}
      <div className={`${styles.vegDot} ${item.is_veg ? styles.veg : styles.nonVeg}`} />

      {/* Emoji */}
      <div className={styles.cardEmoji}>{CATEGORY_EMOJI[item.category]}</div>

      {/* Tags */}
      <div className={styles.tags}>
        {item.is_spicy && <span className={styles.tag}>🌶 Spicy</span>}
        <span className={styles.tag}>⏱ {item.prep_time_minutes || 5} min</span>
      </div>

      <h3 className={styles.cardName}>{item.name}</h3>
      <p className={styles.cardDesc}>{item.description}</p>

      <div className={styles.cardFooter}>
        <span className={styles.price}>₹{item.price}</span>

        {qty === 0 ? (
          <button
            className={`${styles.addBtn} ${added ? styles.addBtnPop : ""}`}
            onClick={handleAdd}
          >
            + Add
          </button>
        ) : (
          <div className={styles.qtyControl}>
            <button onClick={handleDec}>−</button>
            <span>{qty}</span>
            <button onClick={handleInc}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return <div className={styles.skeleton} />;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ totalItems }) {
  const [session, setSession] = useState(getAuthSession());

  useEffect(() => {
    const sync = () => setSession(getAuthSession());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setSession(null);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navBrand}>
        <span className={styles.navLogo}>🍜</span>
        <span className={styles.navName}>Wok &amp; Roll</span>
      </div>
      <div className={styles.navLinks}>
        <a href="#menu" className={styles.navLink}>Menu</a>
        <Link to="/track" className={styles.navLink}>
          Track
        </Link>
        {session?.user?.role === "kitchen" && (
          <Link to="/kitchen" className={styles.navLink}>
            Kitchen
          </Link>
        )}
        {session?.user?.role === "admin" && (
          <Link to="/admin" className={styles.navLink}>
            Admin
          </Link>
        )}
        {session?.token ? (
          <button type="button" className={styles.navLink} onClick={handleLogout}>
                ⎋ Logout
          </button>
        ) : (
          <Link to="/login" className={styles.navLink}>
                👤 Staff Login
          </Link>
        )}
            <Link to="/cart" className={styles.navCartBtn}>🛒 Cart ({totalItems})</Link>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <span className={styles.badge}>
          <span className={styles.badgeDot} />
          Skip the queue
        </span>

        <h1 className={styles.heroTitle}>
          Order now,
          <br />
          <span className={styles.heroAccent}>pick up hot.</span>
        </h1>

        <p className={styles.heroSub}>
          Pre-order your favourite Chinese fast food from the campus counter.
          No waiting — just walk in and grab when it's ready.
        </p>

        <div className={styles.heroPills}>
          <span className={styles.heroPill}>⚡ ~10 min prep</span>
          <span className={styles.heroPill}>🔔 Live updates</span>
          <span className={styles.heroPill}>💸 Pay on pickup</span>
        </div>

        <a href="#menu" className={styles.heroCta}>
          Browse menu <span className={styles.ctaArrow}>→</span>
        </a>
      </div>

      <div className={styles.heroVisual}>
  <div className={styles.heroGlow} />

  <img
    src={heroImage}
    alt="Noodles"
    className={styles.heroImage}
  />
</div>
    </section>
  );
}

// ─── Landing Page (main export) ───────────────────────────────────────────────
export default function LandingPage() {
  const { items, loading, error } = useMenu();
  const [activeCategory, setActiveCategory] = useState(ALL);
  const { totalItems, totalAmount } = useCart();

  const categories = useMemo(() => {
    return [...new Set(items.map((i) => i.category))];
  }, [items]);

  const visible = useMemo(() => {
  const filtered =
    activeCategory === ALL
      ? items
      : items.filter((i) => i.category === activeCategory);

  return filtered.filter((i) => i.is_available);
}, [items, activeCategory]);

  return (
    <div className={styles.page}>
      <Navbar totalItems={totalItems} />
      <Hero />

      {/* ── Menu Section ─────────────────────────────────────── */}
      <section id="menu" className={styles.menuSection}>
        <div className={styles.menuHeader}>
          <div>
            <h2 className={styles.menuTitle}>Today's menu</h2>
            <p className={styles.menuSub}>Tap a card to add items. Pay when you pick up.</p>
          </div>
        </div>

        {/* Category chips */}
        <div className={styles.chips}>
          <CategoryChip
            active={activeCategory === ALL}
            onClick={() => setActiveCategory(ALL)}
            label="All"
            emoji="✨"
          />
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              label={CATEGORY_LABELS[cat]}
              emoji={CATEGORY_EMOJI[cat]}
            />
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className={styles.empty}>
            <div className={styles.emptyEmoji}>⚠️</div>
            <p>{error}</p>
          </div>
        ) : visible.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyEmoji}>🍽️</div>
            <p>No items in this category yet.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {visible.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* ── Sticky Cart Bar ───────────────────────────────────── */}
      {totalItems > 0 && (
        <div className={styles.cartBar}>
          <span className={styles.cartCount}>
            {totalItems} item{totalItems > 1 ? "s" : ""} · ₹{totalAmount.toFixed(0)}
          </span>
          <a href="/cart" className={styles.cartViewBtn}>
            View cart →
          </a>
        </div>
      )}
    </div>
  );
}