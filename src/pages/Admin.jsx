import React, { useState } from "react";
import styles from "../styles/Admin.module.css";
import { CATEGORY_LABELS } from "../lib/types";
import { menuStore, useMenu } from "../lib/menuStore";

const initialMenu = [
  {
    id: "1",
    name: "Veg Noodles",
    price: 80,
    category: "noodles",
    is_veg: true,
    is_available: true,
  },
];



function Admin() {
  const menu = useMenu();
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "noodles",
    is_veg: true,
    prep_time_minutes: 10
  });

  const handleSubmit = () => {
  if (!form.name || !form.price) return;

  const newItem = {
    id: editingId || Date.now().toString(),
    name: form.name,
    price: Number(form.price),
    category: form.category,
    is_veg: form.is_veg,
    prep_time_minutes: Number(form.prep_time_minutes || 5),
    is_available: true,
  };

  if (editingId) {
    menuStore.update(newItem);
  } else {
    menuStore.add(newItem);
  }

  // Reset form
  setForm({
    name: "",
    price: "",
    category: "noodles",
    is_veg: true,
    prep_time_minutes: "",
  });

  setEditingId(null);
};

  const toggleAvailability = (id) => {
    menuStore.toggleAvailability(id);
  };

const deleteItem = (id) => {
    menuStore.remove(id);
  };

  const handleEdit = (item) => {
  setEditingId(item.id);

  setForm({
    name: item.name,
    price: item.price,
    category: item.category,
    is_veg: item.is_veg,
    prep_time_minutes: item.prep_time_minutes || "",
  });
};

  return (
    <div className={styles.container}>
      <h1>Admin Panel</h1>

      {/* ─── Add Item Form ─── */}
      <div className={styles.form}>
        <input
          placeholder="Item name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
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

        <button onClick={handleSubmit}>
  {editingId ? "Update Item" : "Add Item"}
</button>
      </div>

      {/* ─── Menu Table ─── */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
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
              <td>{item.prep_time_minutes || 5} min</td>
              <td>
                <input
                  type="checkbox"
                  checked={item.is_available}
                  onChange={() => toggleAvailability(item.id)}
                />
              </td>

              <td>
                <button onClick={() => deleteItem(item.id)}>Delete</button>
                <button onClick={() => handleEdit(item)}>Edit</button>
              </td>
              
            </tr>
            
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;