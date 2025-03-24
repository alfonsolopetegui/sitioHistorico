"use client";
import React from "react";
import styles from "./adminArchive.module.css";

import { useSession } from "next-auth/react";
import Link from "next/link";

const AdminArchive = ({ setLoginActive }) => {
  const { data: session, status } = useSession();

  return (
    <div>
      {!session && status === "unauthenticated" ? (
        <p className={styles.text} onClick={() => setLoginActive(true)}>Soy colaborador</p>
      ) : (
        <>
       <h2>{`Hola, ${session?.user?.username || "Usuario"}`}</h2>
        <Link href="/admin">
          <h2 className={styles.text} >{"<< IR A ADMIN >>"}</h2>
        </Link>
        </>
      )}
    </div>
  );
};

export default AdminArchive;
