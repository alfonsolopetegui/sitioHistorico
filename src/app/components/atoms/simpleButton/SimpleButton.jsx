"use client";
import Link from "next/link";
import styles from "./simpleButton.module.css";

const SimpleButton = ({ handler, text = "Volver", href }) => {
  // Si href está presente, el componente actúa como un enlace pero con estilo de botón
  if (href) {
    return (
      <Link
        href={href}
        className={`${styles.btnContainer} ${styles.linkStyle}`}
      >
        {text}
      </Link>
    );
  }

  // Si no hay href, definimos el comportamiento del botón
  const handleClick =
    handler === "back" ? () => window.history.back() : handler;

  // Comprobamos si handler es una función válida

  return (
    <button className={styles.btnContainer} onClick={handleClick}>
      {text}
    </button>
  );
};

export default SimpleButton;
