import { db } from "../../../utils/firebaseAdmin";

// Función para manejar solicitudes PUT
const handlePut = async (req, res) => {
  try {
    const { id } = req.query;
    const updatedPublication = req.body;
    await db.collection("publications").doc(id).set(updatedPublication);
    res.status(200).json(updatedPublication);
  } catch (error) {
    res.status(500).json({ error: "Error updating publication" });
  }
};

// Función para manejar solicitudes DELETE
const handleDelete = async (req, res) => {
  try {
    const { id } = req.query;
    await db.collection("publications").doc(id).delete();
    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ error: "Error deleting publication" });
  }
};

// Función principal que maneja las solicitudes HTTP
export default async function handler(req, res) {
  if (req.method === "PUT") {
    await handlePut(req, res);
  } else if (req.method === "DELETE") {
    await handleDelete(req, res);
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
