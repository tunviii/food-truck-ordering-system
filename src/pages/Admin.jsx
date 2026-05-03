import { useState } from "react";
import styles from "../styles/Admin.module.css";
import { CATEGORY_LABELS } from "../lib/types";
import { menuStore, useMenu } from "../lib/menuStore";
import BackButton from "../components/BackButton";


function Admin() {
  const { items: menu, loading, error } = useMenu();
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "noodles",
    is_veg: true,
    is_spicy: false,
    prep_time_minutes: 10,
  });

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      category: "noodles",
      is_veg: true,
      is_spicy: false,
      prep_time_minutes: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) return;

    setSaving(true);
    setMessage("");

    const newItem = {
      id: editingId || Date.now().toString(),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      is_veg: form.is_veg,
      is_spicy: form.is_spicy,
      prep_time_minutes: Number(form.prep_time_minutes || 5),
      is_available: editingId ? menu.find((item) => item.id === editingId)?.is_available ?? true : true,
    };

    try {
      if (editingId) {
        await menuStore.update(newItem);
        setMessage("Item updated.");
      } else {
        await menuStore.add(newItem);
        setMessage("Item added.");
      }

      resetForm();
    } catch (submitError) {
      setMessage(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (id) => {
    setMessage("");
    try {
      await menuStore.toggleAvailability(id);
    } catch (toggleError) {
      setMessage(toggleError.message);
    }
  };

  const deleteItem = async (id) => {
    setMessage("");
    try {
      await menuStore.remove(id);
    } catch (deleteError) {
      setMessage(deleteError.message);
    }
  };

  const handleEdit = (item) => {
  setEditingId(item.id);

  setForm({
    name: item.name,
    description: item.description || "",
    price: item.price,
    category: item.category,
    is_veg: item.is_veg,
    is_spicy: item.is_spicy,
    prep_time_minutes: item.prep_time_minutes || "",
  });
};

  return (
    <div className={styles.container}>
      <BackButton to="/" label="Back" />
      <h1>Admin Panel</h1>
      {loading && <p>Loading menu...</p>}
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      {/* ─── Add Item Form ─── */}
      <div className={styles.form}>
        <input
          placeholder="Item name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
  type="number"
  placeholder="Prep time (minutes)"
  value={form.prep_time_minutes}
  onChange={(e) =>
    setForm({ ...form, prep_time_minutes: e.target.value })
  }
/>

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <label>
          <input
            type="checkbox"
            checked={form.is_veg}
            onChange={(e) => setForm({ ...form, is_veg: e.target.checked })}
          />
          Veg
        </label>

        <label>
          <input
            type="checkbox"
            checked={form.is_spicy}
            onChange={(e) => setForm({ ...form, is_spicy: e.target.checked })}
          />
          Spicy
        </label>

        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : editingId ? "💾 Update Item" : "➕ Add Item"}
        </button>
      </div>

      {/* ─── Menu Table ─── */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Description</th>
            <th>Prep Time</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {menu.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{CATEGORY_LABELS[item.category]}</td>
              <td>₹{item.price}</td>
              <td>{item.description || "-"}</td>
              <td>{item.prep_time_minutes || 5} min</td>
              <td>
                <input
                  type="checkbox"
                  checked={item.is_available}
                  onChange={() => toggleAvailability(item.id)}
                />
              </td>

              <td>
                <button onClick={() => deleteItem(item.id)}>🗑 Delete</button>
                <button onClick={() => handleEdit(item)}>✏️ Edit</button>
              </td>
              
            </tr>
            
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;