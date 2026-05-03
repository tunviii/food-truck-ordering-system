import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from "react-router-dom";

import Landing from "./pages/Landing";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin"; 
import Kitchen from "./pages/Kitchen";
import Login from "./pages/Login";
import OrderTracking from "./pages/OrderTracking";
import { getAuthSession } from "./lib/auth";

function RequireRole({ roles, children }) {
  const location = useLocation();
  const session = getAuthSession();

  if (!session?.token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles.length > 0 && !roles.includes(session.user?.role)) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Menu */}
        <Route path="/" element={<Landing />} />
        <Route path="/menu" element={<Landing />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/track" element={<OrderTracking />} />
        <Route path="/login" element={<Login />} />

        {/* Admin + Kitchen */}
        <Route
          path="/kitchen"
          element={
            <RequireRole roles={["admin", "kitchen"]}>
              <Kitchen />
            </RequireRole>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireRole roles={["admin"]}>
              <Admin />
            </RequireRole>
          }
        />
      </Routes>
    </Router>
  );
}