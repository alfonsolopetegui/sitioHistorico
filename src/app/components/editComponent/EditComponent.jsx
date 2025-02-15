import { useState, useEffect } from "react";
import styles from "./editComponent.module.css";
import { images } from "@/app/fakeData/data"; // Suponiendo que `images` es tu lista de publicaciones
import { PublicationDataSetter } from "../atoms/publicationDataSetter/PublicationDataSetter";
import { DescriptionSetter } from "../atoms/descriptionSetter/DescriptionSetter";
import { ImageUploader } from "../atoms/imageUploader/ImageUploader";

const EditComponent = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [noMatch, setNoMatch] = useState(false);
  const [selectedPub, setSelectedPub] = useState(null); // Estado para la publicación seleccionada
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

  // Actualiza el estado cuando seleccionas una publicación
  useEffect(() => {
    if (selectedPub) {
      setStates({
        title: selectedPub.title,
        photographer: selectedPub.photographer,
        description: selectedPub.description,
        credits: selectedPub.credits,
        date: selectedPub.date,
        tags: selectedPub.tags,
        urls: selectedPub.urls,
        path: selectedPub.path,
      });
    }
  }, [selectedPub]);

  //Buscador
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      // Filtra las imágenes cuyo título contiene la cadena de búsqueda
      const filteredImages = images.filter((image) =>
        image.title.toLowerCase().includes(search.toLowerCase())
      );
      if (filteredImages.length > 0) {
        setSearchResult(filteredImages);
        setNoMatch(false);
      } else {
        setSearchResult([]); // Si no hay resultados, limpiamos los resultados
        setNoMatch(true);
      }
    }
  };

  const handleSelectPub = (image) => {
    setSelectedPub(image); // Set the selected image when clicked
  };

  const handleSave = () => {
    alert(`title: ${states.title}
      description: ${states.description} 
      photographer: ${states.photographer}
      credits: ${states.credits}
      date: ${states.date}
      year: ${states.year}
      tags: ${states.tags}
      path: ${states.path}
      
      urls: ${states.urls}`);
  };

  return (
    <div className={styles.editorWrapper}>
      {selectedPub ? (
        // Si seleccionaron una publicación, mostrar el data setter para edición
        <div className={styles.editCompContainer}>
          <div className={styles.leftDisplay}>
            <PublicationDataSetter
              isEditMode={true}
              states={states}
              setStates={setStates}
            />
          </div>
          <div className={styles.rightDisplay}>
            <ImageUploader
              imageFiles={imageFiles}
              setImageFiles={setImageFiles}
              isEditMode={true}
              states={states}
              setStates={setStates}
            />
            <div className={styles.rightBottom}>
              <DescriptionSetter
                isEditMode={true}
                states={states}
                setStates={setStates}
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
                  // onClick={handleCancel}
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
      ) : (
        <div className={styles.searchContainer}>
          <h3>EditComponent</h3>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyUp={handleEnter}
            placeholder="Busca por título de publicación"
          />
          <div>
            {searchResult.length > 0
              ? searchResult.map((image, index) => (
                  <h3 key={index} onClick={() => handleSelectPub(image)}>
                    {image.title}
                  </h3>
                ))
              : noMatch && <h3>No encontramos publicaciones con ese título</h3>}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditComponent;
