import { db } from "../../../utils/firebaseAdmin";

// Función para manejar solicitudes GET
const handleGet = async (req, res) => {
  try {
    const snapshot = await db.collection("categories").get();
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" });
  }
};

// Función para manejar solicitudes POST
const handlePost = async (req, res) => {
  try {
    const newCategory = req.body;
    const docRef = await db.collection("categories").add(newCategory);
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: "Error creating categories" });
  }
};



// Función principal que maneja las solicitudes HTTP
export default async function handler(req, res) {
  if (req.method === "GET") {
    await handleGet(req, res);
  } else if (req.method === "POST") {
    await handlePost(req, res);
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
