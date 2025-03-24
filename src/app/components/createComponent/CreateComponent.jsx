import { useState, useEffect } from "react";
import { DescriptionSetter } from "../atoms/descriptionSetter/DescriptionSetter";
import { ImageUploader } from "../atoms/imageUploader/ImageUploader";
import { PublicationDataSetter } from "../atoms/publicationDataSetter/PublicationDataSetter";
import styles from "./createComponent.module.css";
import { storage } from "../../../../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useCategories } from "../../../../hooks/useCategories";
import { useSubcategories } from "../../../../hooks/useSubcategories";

import imageCompression from "browser-image-compression";

import Swal from "sweetalert2";

const CreateComponent = ({ active, setActive }) => {
  const [states, setStates] = useState({
    title: "",
    photographer: "",
    description: "",
    credits: "",
    date: "",
    tags: [],
    urls: [],
    categoryId: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [isModified, setIsModified] = useState(false); // Estado para detectar cambios

   // Función para subir las imágenes a Firebase Storage
   const uploadImagesToStorage = async (files) => {
    const imageUrls = [];
    
    const promises = files.map(async (file) => {
      try {
        // Comprimir la imagen antes de subirla
        const options = {
          maxSizeMB: 1, // Tamaño máximo en MB
          maxWidthOrHeight: 1024, // Dimensiones máximas
          useWebWorker: true, // Usar Web Worker para no bloquear el hilo principal
        };
  
        const compressedFile = await imageCompression(file, options);
  
        const storageRef = ref(storage, `publications/${compressedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, compressedFile);
  
        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null, // Puedes agregar el progreso de carga aquí si lo deseas
            (error) => reject(error), // En caso de error, lo rechazamos
            async () => {
              // Una vez que la imagen se haya subido correctamente
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              imageUrls.push(downloadURL);
              resolve();
            }
          );
        });
      } catch (error) {
        console.error("Error al comprimir la imagen:", error);
        throw new Error("Error al comprimir la imagen");
      }
    });
  
    await Promise.all(promises);
    return imageUrls;
  };
  

  const handleSave = () => {
    Swal.fire({
      title: "Seguro que deseas guardar los cambios?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Ok",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        savePublication();
      } else if (result.isDenied) {
        return;
      }
    });
  };


  const savePublication = async () => {
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
        categoryId: states.categoryId,
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
        Swal.fire("Publicación guardada con éxito", "", "success");
        setStates({
          title: "",
          photographer: "",
          description: "",
          credits: "",
          date: "",
          tags: [],
          urls: [],
          categoryId: "",
        });
        setImageFiles([]); // Limpiar las imágenes después del éxito
      } else {
        Swal.fire("Hubo un error al guardar la publicación", "", "error");
      }
    } catch (error) {
      console.error("Error al guardar la publicación:", error);
      Swal.fire("Hubo un error al guardar la publicación", "", "error");
    }
  };

  const handleErase = () => {
    Swal.fire({
      title: "Seguro que deseas vaciar el formulario?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Ok",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setStates({
          title: "",
          photographer: "",
          description: "",
          credits: "",
          date: "",
          tags: [],
          urls: [],
          categoryId: "",
        });
        setImageFiles([]);
      } else if (result.isDenied) {
        return;
      }
    });
  };


   const handleCancel = () => {
     Swal.fire({
       title: "Seguro que deseas cancelar? Los cambios no guardados se perderán",
       showDenyButton: true,
       showCancelButton: false,
       confirmButtonText: "Ok",
       denyButtonText: `Cancelar`,
     }).then((result) => {
       /* Read more about isConfirmed, isDenied below */
       if (result.isConfirmed) {
         setActive("");
       } else if (result.isDenied) {
         return;
       }
     });
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
              <h5>Cerrar</h5>
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
              onClick={handleErase}
            >
              <h5>Vaciar</h5>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComponent;
