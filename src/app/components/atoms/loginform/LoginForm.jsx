import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import styles from "./loginForm.module.css";

import Swal from "sweetalert2";

const LoginForm = ({setLoginActive}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { data: session, status } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.error) {
      setError(res.error);
    } else {
      Swal.fire({
        title: "Inicio de sesión exitoso",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });

      setLoginActive(false);
     
    }
  };

    // Espera a que la sesión se cargue antes de redirigir
    useEffect(() => {
      if (session && status === "authenticated") {
        window.location.href = "/admin"; // Redirige al usuario cuando la sesión esté disponible
      }
    }, [session, status]);

  return (
    <form className={styles.loginContainer} onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Iniciar sesión</button>
    </form>
  );
};

export default LoginForm;
