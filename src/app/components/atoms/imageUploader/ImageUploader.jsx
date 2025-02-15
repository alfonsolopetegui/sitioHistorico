"use client";
import { useState } from "react";
import styles from "./imageUploader.module.css";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faCircleXmark } from "@fortawesome/free-regular-svg-icons";

export const ImageUploader = ({
  states,
  setStates,
  imageFiles,
  setImageFiles,
  imageUrls,
  setImageUrls,
  isEditMode,
}) => {
  // const [imageUrls, setImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Estado para almacenar el índice de la imagen actual

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convierte los archivos seleccionados a un array
    setImageFiles((prevFiles) => [...prevFiles, ...files]); // Agrega nuevos archivos al estado

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;

        setStates((prevState) => ({
          ...prevState,
          urls: [...prevState.urls, url],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePrevImage = () => {
    // Si no estamos en la primera imagen, retrocedemos
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    // Si hay más imágenes, avanzamos al siguiente índice
    if (currentImageIndex < states.urls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // Función para abrir el selector de archivos al hacer clic en el botón
  const triggerFileInput = () => {
    document.getElementById("image-upload").click(); // Simula el clic en el input de archivos
  };

  // Función para eliminar una imagen
  const handleDeleteImage = (index) => {
    // Elimina la imagen del array de URLs y también del array de archivos
    const newImageUrls = states.urls.filter((_, i) => i !== index);
    const newImageFiles = imageFiles.filter((_, i) => i !== index);

    setStates((prevState) => ({
      ...prevState,
      urls: newImageUrls,
    }));
    setImageFiles(newImageFiles); // Actualiza el estado con los archivos restantes

    // Si la imagen eliminada era la actual, ajustamos el índice
    if (index === currentImageIndex && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1); // Retrocedemos el índice si es necesario
    }
  };

  return (
    <div className={styles.imageUploaderContainer}>
      {/* Campo para cargar imágenes */}
      <div className={styles.downDisplay}>
        <div className={styles.leftDisplay}>
          <h2 className={styles.title}>Agregar Imágenes</h2>

          <div>
            <input
              type="file"
              accept="image/*"
              id="image-upload"
              multiple
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <button onClick={triggerFileInput} className={styles.btnContainer}>
              Subir imagen
            </button>
          </div>

          {/* Mostrar los nombres de las imágenes subidas */}
          {states.urls.length > 0 && (
            <div className={styles.nameListContainer}>
              <ul>
                {states.urls.map((url, index) => (
                  <li key={index}>
                    <h4>{`Imagen ${index + 1}`}</h4>
                    <button
                      className={styles.deleteImage}
                      onClick={() => handleDeleteImage(index)}
                    >
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        className={`${"fa-fw"}`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.rightDisplay}>
          {/* Vista previa de la imagen actual */}
          {states.urls && states.urls.length > 0 ? (
            <div className={styles.imageViewer}>
              <div className={styles.imageWrapper}>
                <div className={styles.imageContainer}>
                  <Image
                    src={states.urls[currentImageIndex]} // Muestra la imagen actual según el índice
                    alt={`Preview ${currentImageIndex}`}
                    width={250}
                    height={250}
                  />
                </div>
              </div>
              {/* botones para recorrer las imagenes */}

              <div className={styles.imageNavigation}>
                <button
                  onClick={handlePrevImage}
                  disabled={currentImageIndex === 0}
                  className={styles.btnContainer}
                  style={{ padding: "3px 6px" }}
                >
                  Anterior
                </button>
                <button
                  onClick={handleNextImage}
                  disabled={currentImageIndex === states.urls.length - 1}
                  className={styles.btnContainer}
                  style={{ padding: "3px 6px" }}
                >
                  Siguiente
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.noImageContainer}>
              <h3>No hay imágenes seleccionadas</h3>
              <FontAwesomeIcon
                icon={faImage}
                className={`${"fa-fw"} ${styles.icon}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
