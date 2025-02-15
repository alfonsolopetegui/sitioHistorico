import Image from "next/image";
import styles from "./page.module.css";
import Welcome from "./components/welcome/Welcome";

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <Welcome />
    </div>
  );
}
