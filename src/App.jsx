import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin"; 
import Kitchen from "./pages/Kitchen";


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Menu */}
        <Route path="/" element={<Landing />} />
        <Route path="/menu" element={<Landing />} />
        <Route path="/cart" element={<Cart />} />

        {/* Admin + Kitchen */}
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}