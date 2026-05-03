import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import styles from "../styles/Auth.module.css";
import { getAuthSession, loginRequest, setAuthSession } from "../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("kitchen");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname;

  useEffect(() => {
    const session = getAuthSession();

    if (session?.token) {
      const destination =
        session.user?.role === "admin"
          ? "/admin"
          : session.user?.role === "kitchen"
            ? "/kitchen"
            : "/";

      navigate(destination, { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const session = await loginRequest(email, password);
      if (session.user.role !== role) {
        throw new Error("This account does not match the selected role.");
      }

      setAuthSession(session);
      navigate(from || (session.user.role === "admin" ? "/admin" : "/kitchen"), { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <BackButton to="/" label="Back" />
        <span className={styles.eyebrow}>Wok &amp; Roll access</span>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>
          Use your kitchen or admin account to manage the dashboard and menu.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Role</span>
            <select value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="kitchen">Kitchen</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className={styles.notice}>{error}</div>
        </form>

        <div className={styles.links}>
          <Link to="/">Back to menu</Link>
          <Link to="/cart">Open cart</Link>
        </div>
      </section>
    </main>
  );
}
