import { useState, useEffect } from "react";
import { DescriptionSetter } from "../atoms/descriptionSetter/DescriptionSetter";
import { ImageUploader } from "../atoms/imageUploader/ImageUploader";
import { PublicationDataSetter } from "../atoms/publicationDataSetter/PublicationDataSetter";
import styles from "./createComponent.module.css";
import { storage } from "../../../../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { categories } from "@/app/fakeData/data";

const CreateComponent = ({ active, setActive }) => {
  const [states, setStates] = useState({
    title: "",
    photographer: "",
    description: "",
    credits: "",
    date: "",
    tags: [],
    urls: [],
    categories:[],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [isModified, setIsModified] = useState(false); // Estado para detectar cambios

   // Función para subir las imágenes a Firebase Storage
   const uploadImagesToStorage = async (files) => {
    const imageUrls = []; // Guardamos las URLs de las imágenes subidas
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `publications/${file.name}`);  // Aquí se usa ref correctamente
        const uploadTask = uploadBytesResumable(storageRef, file);      // Usamos uploadBytesResumable con la referencia
  
        uploadTask.on(
          "state_changed",
          null, // Puedes agregar el progreso de carga aquí si lo deseas
          (error) => reject(error), // En caso de error, lo rechazamos
          async () => {
            // Una vez que la imagen se haya subido correctamente
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref); // Obtener URL de descarga
            imageUrls.push(downloadURL);
            resolve();
          }
        );
      });
    });
  
    // Esperamos que todas las imágenes se suban
    await Promise.all(promises);
  
    return imageUrls; // Devolvemos las URLs de las imágenes
  };
  


  const handleSave = async () => {
    // Verifica que los datos esenciales estén presentes antes de hacer el POST
    if (!states.title || !states.description || !states.photographer) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }
  
    try {
      // Utilizamos la función uploadImagesToStorage para obtener las URLs de las imágenes
      const imageUrls = await uploadImagesToStorage(imageFiles);
  
      // Ahora que tenemos las URLs de las imágenes, podemos realizar el POST con todos los datos
      const postData = {
        title: states.title,
        description: states.description,
        photographer: states.photographer,
        credits: states.credits,
        date: states.date,
        tags: states.tags,
        urls: imageUrls, // Asigna las URLs de las imágenes
        categories: states.categories,
      };
  
      // Realiza el POST a tu API
      const response = await fetch("/api/publications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
  
      if (response.ok) {
        alert("La publicación se ha guardado correctamente.");
        setStates({
          title: "",
          photographer: "",
          description: "",
          credits: "",
          date: "",
          tags: [],
          urls: [],
          categories:[],
        });
        setImageFiles([]); // Limpiar las imágenes después del éxito
      } else {
        alert("Hubo un error al guardar la publicación. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al guardar la publicación:", error);
      alert("Hubo un error al cargar las imágenes o al guardar la publicación.");
    }
  };

  // Función para cancelar la entrada de datos
  const handleCancel = () => {
    const cancelConfirm = window.confirm("Estas seguro que deseas salir?");
    if (!cancelConfirm) {
      return;
    } else {
      setActive("");
    }
  };

  return (
    <div className={styles.createCompContainer}>
      <div className={styles.leftDisplay}>
        <PublicationDataSetter
          states={states}
          setStates={setStates}
          isEditMode={false}
        />
      </div>
      <div className={styles.rightDisplay}>
        <ImageUploader
          states={states}
          setStates={setStates}
          imageFiles={imageFiles}
          setImageFiles={setImageFiles}
          imageUrls={states.urls}
          setImageUrls={(newUrls) =>
            setStates((prevState) => ({ ...prevState, urls: newUrls }))
          }
          isEditMode={false}
        />
        <div className={styles.rightBottom}>
          <DescriptionSetter
            states={states}
            setStates={setStates}
            isEditMode={false}
          />
          <div className={styles.btnContainer}>
            <article
              className={styles.btn}
              style={{ backgroundColor: "#ABE188", color: "white" }}
              onClick={handleSave}
            >
              <h5>Guardar</h5>
            </article>
            <article
              className={styles.btn}
              style={{ backgroundColor: "#B0A1BA", color: "white" }}
              onClick={handleCancel}
            >
              <h5>Cancelar</h5>
            </article>
            <article
              className={styles.btn}
              style={{ backgroundColor: "#43BCCD", color: "white" }}
            >
              <h5>Borrador</h5>
            </article>
            <article
              className={styles.btn}
              style={{ backgroundColor: "#EA3546", color: "white" }}
            >
              <h5>Eliminar</h5>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComponent;
