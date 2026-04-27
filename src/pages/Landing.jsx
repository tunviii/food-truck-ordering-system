import React, { useState, useMemo, useEffect } from "react";
import styles from "../styles/Landing.module.css";
import heroImage from "../assets/hero-noodles.jpg";

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

// ─── Cart Store (plain JS, no localStorage issues in all environments) ────────
const STORAGE_KEY = "wokroll_cart";
const listeners = new Set();

function readCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

export const cartStore = {
  getItems: readCart,
  add(item) {
    const items = readCart();
    const existing = items.find((i) => i.menuItemId === item.menuItemId);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ ...item, quantity: 1 });
    }
    writeCart(items);
  },
  remove(menuItemId) {
    writeCart(readCart().filter((i) => i.menuItemId !== menuItemId));
  },
  setQuantity(menuItemId, quantity) {
    const items = readCart();
    const item = items.find((i) => i.menuItemId === menuItemId);
    if (!item) return;
    if (quantity <= 0) {
      writeCart(items.filter((i) => i.menuItemId !== menuItemId));
    } else {
      item.quantity = quantity;
      writeCart(items);
    }
  },
  clear() {
    writeCart([]);
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

function useCart() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(cartStore.getItems());
    const unsub = cartStore.subscribe(() => setItems(cartStore.getItems()));
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setItems(cartStore.getItems());
    };
    window.addEventListener("storage", onStorage);
    return () => {
      unsub();
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return { items, totalItems, totalAmount };
}

// ─── Demo Menu Data (replace with Supabase call) ──────────────────────────────
const DEMO_ITEMS = [
  {
    id: "1",
    name: "Veg Hakka Noodles",
    description: "Classic street-style tossed with crunchy veggies & soy",
    price: 80,
    category: "noodles",
    is_veg: true,
    is_spicy: false,
    prep_time_minutes: 8,
  },
  {
    id: "2",
    name: "Schezwan Noodles",
    description: "Fiery wok-tossed with schezwan sauce & peppers",
    price: 90,
    category: "noodles",
    is_veg: true,
    is_spicy: true,
    prep_time_minutes: 10,
  },
  {
    id: "3",
    name: "Veg Fried Rice",
    description: "Fragrant rice stir-fried with seasonal vegetables",
    price: 80,
    category: "rice",
    is_veg: true,
    is_spicy: false,
    prep_time_minutes: 8,
  },
  {
    id: "4",
    name: "Egg Fried Rice",
    description: "Golden scrambled eggs folded into aromatic rice",
    price: 100,
    category: "rice",
    is_veg: false,
    is_spicy: false,
    prep_time_minutes: 10,
  },
  {
    id: "5",
    name: "Veg Manchurian",
    description: "Crispy veggie balls dunked in tangy manchurian gravy",
    price: 100,
    category: "manchurian",
    is_veg: true,
    is_spicy: true,
    prep_time_minutes: 12,
  },
  {
    id: "6",
    name: "Spring Rolls",
    description: "Golden crispy rolls stuffed with spiced cabbage & noodles",
    price: 70,
    category: "starters",
    is_veg: true,
    is_spicy: false,
    prep_time_minutes: 6,
  },
  {
    id: "7",
    name: "Hot & Sour Soup",
    description: "Rich, tangy broth with silky tofu and mushrooms",
    price: 60,
    category: "soups",
    is_veg: true,
    is_spicy: true,
    prep_time_minutes: 5,
  },
  {
    id: "8",
    name: "Noodles + Manchurian Combo",
    description: "Half portion noodles + veg manchurian — the classics together",
    price: 130,
    category: "combos",
    is_veg: true,
    is_spicy: false,
    prep_time_minutes: 12,
  },
  {
    id: "9",
    name: "Cold Coffee",
    description: "Chilled café-style blended coffee with a creamy finish",
    price: 50,
    category: "beverages",
    is_veg: true,
    is_spicy: false,
    prep_time_minutes: 3,
  },
];

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
        <span className={styles.tag}>⏱ {item.prep_time_minutes} min</span>
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
  return (
    <nav className={styles.nav}>
      <div className={styles.navBrand}>
        <span className={styles.navLogo}>🍜</span>
        <span className={styles.navName}>Wok &amp; Roll</span>
      </div>
      <div className={styles.navLinks}>
        <a href="#menu" className={styles.navLink}>Menu</a>
        <a href="/kitchen" className={styles.navLink}>Kitchen</a>
        <a href="/admin" className={styles.navLink}>Admin</a>
        {totalItems > 0 && (
          <a href="/cart" className={styles.navCartBtn}>
            🛒 {totalItems}
          </a>
        )}
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
  const [items] = useState(DEMO_ITEMS); // swap with useEffect + supabase
  const [loading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(ALL);
  const { totalItems, totalAmount } = useCart();

  const categories = useMemo(() => {
    return [...new Set(items.map((i) => i.category))];
  }, [items]);

  const visible = useMemo(() => {
    return activeCategory === ALL
      ? items
      : items.filter((i) => i.category === activeCategory);
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