import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";

// Placeholder pages (replace later)
const Kitchen = () => (
  <div style={{ padding: "40px" }}>
    <h1>🍳 Kitchen Dashboard</h1>
  </div>
);

const Admin = () => (
  <div style={{ padding: "40px" }}>
    <h1>⚙️ Admin Panel</h1>
  </div>
);

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Menu */}
        <Route path="/" element={<Landing/>} />
        <Route path="/menu" element={<Landing/>} />

        {/* Future Pages */}
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}