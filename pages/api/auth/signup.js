import bcrypt from "bcryptjs";
import { db } from "../../../utils/firebaseAdmin"; // Firebase Admin SDK

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    // Buscar usuario con el email (si lo quieres único)
    const userQuery = await db.collection("users").where("email", "==", email).get();
    if (!userQuery.empty) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar usuario con ID automático
    const userRef = await db.collection("users").add({
      email,
      username,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "Usuario registrado con éxito", userId: userRef.id });
  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

