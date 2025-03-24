import React from "react";
import { useSession } from "next-auth/react";
import styles from "./welcomeAdmin.module.css";

const WelcomeAdmin = () => {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className={styles.name}>{`Bienvenido: ${session?.user?.username}`}</h1>
    </div>
  );
};

export default WelcomeAdmin;
