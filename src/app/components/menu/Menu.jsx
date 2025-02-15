"use client";
import styles from "./menu.module.css";
import { useRef, useEffect } from "react";
import { categories } from "@/app/fakeData/data";
import OptionMenu from "../atoms/optionMenu/OptionMenu";

const Menu = ({ handler, isActive, buttonRef }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verifica si el clic fue fuera del menú y del botón de hamburguesa
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        isActive
      ) {
        handler(); // Cierra el menú si se hace clic fuera
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handler, isActive, buttonRef]);

  return (
    <>
      <div
        className={`${styles.menuContainer} ${isActive ? styles.active : ""}`}
        ref={menuRef}
        id="menu"
      >
        <div className={styles.optionsContainer}>
          {categories.map((cat) => (
            <OptionMenu
              handler={handler}
              key={cat.id}
              path={`/categories/${cat.slug}`}
              name={cat.name}
            />
          ))}
        </div>
      </div>
      <div className={`${styles.overlay} ${isActive ? styles.viewOverlay : ""}`}></div>
    </>
  );
};

export default Menu;
