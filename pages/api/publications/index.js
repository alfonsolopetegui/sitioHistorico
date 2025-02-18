import { db } from "../../../utils/firebaseAdmin";

// Función para manejar solicitudes GET
const handleGet = async (req, res) => {
  try {
    const snapshot = await db.collection("publications").get();
    const publications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(publications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching publications" });
  }
};

// Función para manejar solicitudes POST
const handlePost = async (req, res) => {
  try {
    const newPublication = req.body;
    const docRef = await db.collection("publications").add(newPublication);
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: "Error creating publication" });
  }
};

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
  if (req.method === "GET") {
    await handleGet(req, res);
  } else if (req.method === "POST") {
    await handlePost(req, res);
  } else if (req.method === "PUT") {
    await handlePut(req, res);
  } else if (req.method === "DELETE") {
    await handleDelete(req, res);
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
