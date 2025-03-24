import { db } from "../../../utils/firebaseAdmin";

// Función para manejar solicitudes GET
const handleGet = async (req, res) => {
  try {
    const snapshot = await db.collection("subcategories").get();
    const subcategories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subcategories" });
  }
};

// Función para manejar solicitudes POST
const handlePost = async (req, res) => {
  try {
    const newSubcategory = req.body;
    const docRef = await db.collection("subcategories").add(newSubcategory);
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: "Error creating subcategories" });
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