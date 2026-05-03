import { Link } from "react-router-dom";
import styles from "../styles/BackButton.module.css";

export default function BackButton({ to = "/", label = "Back" }) {
  return (
    <Link to={to} className={styles.backButton} aria-label={label}>
      <span className={styles.arrow}>←</span>
      <span>{label}</span>
    </Link>
  );
}
