import { useState, useEffect } from "react";
import { DescriptionSetter } from "../atoms/descriptionSetter/DescriptionSetter";
import { ImageUploader } from "../atoms/imageUploader/ImageUploader";
import { PublicationDataSetter } from "../atoms/publicationDataSetter/PublicationDataSetter";
import styles from "./createComponent.module.css";

const CreateComponent = ({ active, setActive }) => {
  const [states, setStates] = useState({
    title: "",
    photographer: "",
    description: "",
    credits: "",
    date: "",
    tags: [],
    urls: [],
    path: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [isModified, setIsModified] = useState(false); // Estado para detectar cambios


  

  // Evento de confirmación antes de salir o recargar la página
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isModified) {
        const message =
          "Tienes cambios sin guardar. ¿Seguro que quieres salir?";
        event.returnValue = message; // Mensaje estándar en algunos navegadores
        return message; // Mensaje en otros navegadores
      }
    };

    // Agregar el listener de `beforeunload` cuando el componente se monta
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Limpiar el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isModified]);

  //Función para salvar datos
  const handleSave = () => {
    alert(`title: ${states.title}
      description: ${states.description} 
      photographer: ${states.photographer}
      credits: ${states.credits}
      date: ${states.date}
      tags: ${states.tags}
      path: ${states.path}
      urls: ${states.urls}`);
  };

  //Función para cancelar la entrada de datos
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
          <DescriptionSetter states={states} setStates={setStates} isEditMode={false}/>
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
