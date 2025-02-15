"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faPenToSquare,
  faFolder,
  faUser,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./adminMenu.module.css"; // Asegúrate de que el archivo CSS esté bien importado

// Mapa de elementos del menú con etiquetas e iconos
const menuItems = {
  newPub: { label: "Nueva publicación", icon: faSquarePlus },
  editPub: { label: "Editar publicación", icon: faPenToSquare },
  newFile: { label: "Nuevo archivo", icon: faFolder },
  newUser: { label: "Nuevo colaborador", icon: faUser },
  logout: { label: "Cerrar sesión", icon: faArrowRightFromBracket },
};

const AdminMenu = ({ active, setActive }) => {
  // const [active, setActive] = useState("");

  // Manejar la selección del ítem
  const handleSelect = (e) => {
    if (active) {
      const exitConfirm = window.confirm("Estás seguro de que deseas salir?");
      if (!exitConfirm) {
        return;
      } else {
        const id = e.currentTarget.id; // Usamos `e.currentTarget.id` en lugar de `e.target.id` para asegurarnos de obtener el id correcto
        setActive(id);
      }
    } else {
      const id = e.currentTarget.id; // Usamos `e.currentTarget.id` en lugar de `e.target.id` para asegurarnos de obtener el id correcto
        setActive(id);
    }
  };

  return (
    <section className={styles.adminMenu}>
      {Object.entries(menuItems).map(([id, { label, icon }]) => (
        <article
          key={id}
          id={id}
          className={`${styles.adminItem} ${
            active === id ? styles.active : ""
          }`} // Comprobamos el estado para añadir 'active'
          onClick={handleSelect}
          aria-selected={active === id ? "true" : "false"}
          role="button"
          tabIndex={0}
        >
          <FontAwesomeIcon
            icon={icon}
            className={`${"fa-fw"} ${styles.icon}`}
          />
          <h3>{label}</h3>
        </article>
      ))}
    </section>
  );
};

export default AdminMenu;
