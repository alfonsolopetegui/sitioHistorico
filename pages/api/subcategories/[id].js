import { db } from "../../../utils/firebaseAdmin";

// Función para manejar solicitudes DELETE
const handleDelete = async (req, res) => {
    try {
      const { id } = req.query;
      const docRef = db.collection("subcategories").doc(id);
      const docSnap = await docRef.get();
  
      if (!docSnap.exists) {
        return res.status(404).json({ error: "Subcategoría no encontrada" });
      }
  
      await docRef.delete();
      return res.status(200).json({ message: "Subcategoría eliminada correctamente", id });
    } catch (error) {
      console.error("Error eliminando subcategoría:", error);
      return res.status(500).json({ error: "Error eliminando la subcategoría" });
    }
  };
  
  
  // Función principal que maneja las solicitudes HTTP
  export default async function handler(req, res) {
    if (req.method === "DELETE") {
      await handleDelete(req, res);
    } else {
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }