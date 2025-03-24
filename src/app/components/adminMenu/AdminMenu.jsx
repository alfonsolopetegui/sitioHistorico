"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {
  faSquarePlus,
  faPenToSquare,
  faFolder,
  faUser,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./adminMenu.module.css"; // Asegúrate de que el archivo CSS esté bien importado

import Swal from "sweetalert2"; // Asegúrate de que la librería esté bien importada

import { useSession, signOut } from "next-auth/react";

import { redirect } from "next/navigation";

// Mapa de elementos del menú con etiquetas e iconos
const menuItems = {
  newPub: { label: "Nueva publicación", icon: faSquarePlus },
  editPub: { label: "Editar publicación", icon: faPenToSquare },
  categories: { label: "Categorias", icon: faFolder },
  newUser: { label: "Nuevo colaborador", icon: faUser },
};

const AdminMenu = ({ active, setActive }) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session && status === "unauthenticated") {
      redirect("/archivo");
    }
  }, [session, status]);

  // Manejar la selección del ítem
  const handleSelect = (e) => {
    const id = e.currentTarget.id;
    if (active && active !== id) {
      Swal.fire({
        title: "Si salis ahora, perderás los cambios no guardados",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Ok",
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          setActive(id);
        } else if (result.isDenied) {
          return;
        }
      });
    } else {
      setActive(id);
    }
  };

  return (
    <section className={styles.adminMenu}>
      <h4 className={styles.userName}>{session?.user?.username}</h4>
      <div className={styles.adminItems}>
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
      </div>

      <h4 className={styles.close} onClick={() => signOut()}>Cerrar sesión</h4>
    </section>
  );
};

export default AdminMenu;
