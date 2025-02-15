"use client";

import { useState } from "react";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState(false);

  const router = useRouter();

  const handleActive = () => {
    setActive(!active);
  };

  const handleForm = (e) => {
    if (e.key === "Enter") {
      alert(username);
      setUsername("");
        router.push("/admin")
    }
  };

  return (
    <div>
      <h3 onClick={handleActive}>{active ? "cerrar" : "soy colaborador"}</h3>
      {active && (
        <div className={`${styles.loginContainer}`}>
          <form onKeyUp={handleForm}>
            <div className={styles.field}>
              <label htmlFor="username">usuario</label>
              <input
                id={"username"}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="password">password</label>
              <input
                id={"password"}
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
