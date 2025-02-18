"use client";

import { useEffect, useState } from "react";
import styles from "./publicationDataSetter.module.css";
import { categories } from "@/app/fakeData/data"; // Suponiendo que tienes un array de categorías con subcategorías
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

export const PublicationDataSetter = ({ states, setStates, isEditMode }) => {
  const [inputTag, setInputTag] = useState("");
  const [currentCategories, setCurrentCategories] = useState(categories);
  const [selectedCategories, setSelectedCategories] = useState("");
  const [finalPath, setFinalPath] = useState(isEditMode && states.path);

  useEffect(() => {
    if (isEditMode && states.path) {
      // Si ya hay un path, lo validamos
      const pathParts = states.path.split("/");

      let currentCategory = categories; // Empezamos con el array de categorías principal

      // Recorremos los elementos del path, excepto el último
      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        // Buscamos la categoría correspondiente a esta parte del path
        const foundCategory = currentCategory.find((c) => c.slug === part);

        if (foundCategory) {
          // Si encontramos la categoría, actualizamos `currentCategory` a sus subcategorías (si las tiene)
          currentCategory = foundCategory.subcategories || [];
        } else {
          // Si no encontramos la categoría, salimos del bucle
          break;
        }
      }

      // Verificamos si llegamos a una categoría final (sin subcategorías)
      if (currentCategory.length === 0) {
        setFinalPath(true); // Si no hay más subcategorías, es un "final path"
      } else {
        setFinalPath(false); // Si aún hay subcategorías, no es un "final path"
      }
    }
  }, [isEditMode, states.path, categories]);

  console.log(finalPath);

  // Actualiza el estado del campo específico
  const handleChange = (field, value) => {
    setStates((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Función para manejar el cambio de texto en el input
  const handleTagsInputChange = (e) => {
    setInputTag(e.target.value);
  };

  // Función que maneja la tecla presionada (para agregar la etiqueta cuando se presiona Enter)
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const newTag = inputTag.trim();
      if (newTag && !states.tags.includes(newTag)) {
        // Agrega la nueva etiqueta al estado de tags
        setStates((prevState) => ({
          ...prevState,
          tags: [...prevState.tags, newTag],
        }));
        setInputTag(""); // Limpiar el campo de entrada
      }
    }
  };

  //Función para eliminar un tag
  const handleDeleteTag = (tagToDelete) => {
    setStates((prevState) => ({
      ...prevState,
      tags: prevState.tags.filter((tag) => tag !== tagToDelete), // Filtra el tag a eliminar
    }));
  };

  // Función para manejar la selección de una categoría
  const handleCategorySelect = (category, parentPath = selectedCategories) => {
    // Generamos el nuevo path, concatenando el slug de la categoría
    const newPath = parentPath
      ? `${parentPath}/${category.slug}` // Si hay un parentPath, concatenamos el slug
      : category.slug; // Si no, simplemente asignamos el slug de la categoría

    setSelectedCategories(newPath);

    // Si la categoría seleccionada tiene subcategorías, las mostramos
    if (category.subcategories && category.subcategories.length > 0) {
      setCurrentCategories(category.subcategories); // Mostramos las subcategorías
      setFinalPath(false); // Aún no estamos en el final, ya que hay más subcategorías
    } else {
      setStates((prevState) => ({
        ...prevState,
        path: newPath, // Actualizamos el valor de `path`
        categories: newPath.split('/'), // Guardamos las categorías como array de strings
      }));
      setFinalPath(true); // Si no tiene subcategorías, estamos en el final
      setSelectedCategories("");
    }
  };

  // Función para regresar a la categoría anterior
  const handleBack = () => {
    setCurrentCategories(categories); // Asegúrate de que `categories` sea el conjunto raíz de categorías
    setStates((prevState) => ({
      ...prevState,
      path: "", // Restablecemos el path a vacío
      categories: [], // Limpiamos las categorías seleccionadas
    }));
    setFinalPath(false); // Volver atrás implica que no estamos en el final
  };

  return (
    <div className={styles.publicationDSContainer}>
      <div className={styles.topDisplay}>
        <h2>{isEditMode ? "Editar Información" : "Agregar Información"}</h2>
      </div>

      <div className={styles.bottomDisplay}>
        <div className={styles.commonData}>
          {/* Título */}
          <div className={styles.inputWrapper}>
            <input
              type="text"
              id="title"
              value={states.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={styles.inputField}
              required
            />
            <label
              htmlFor="title"
              className={states.title ? styles.shrink : ""}
            >
              <h5>Título</h5>
            </label>
          </div>

          {/* Fotógrafo */}
          <div className={styles.inputWrapper}>
            <input
              type="text"
              id="photographer"
              value={states.photographer}
              onChange={(e) => handleChange("photographer", e.target.value)}
              className={styles.inputField}
              required
            />
            <label
              htmlFor="photographer"
              className={states.photographer ? styles.shrink : ""}
            >
              <h5>Fotógrafo</h5>
            </label>
          </div>

          {/* Créditos */}
          <div className={styles.inputWrapper}>
            <input
              type="text"
              id="credits"
              value={states.credits}
              onChange={(e) => handleChange("credits", e.target.value)}
              className={styles.inputField}
              required
            />
            <label
              htmlFor="credits"
              className={states.credits ? styles.shrink : ""}
            >
              <h5>Créditos</h5>
            </label>
          </div>

          {/* Fecha */}
          <div className={styles.inputWrapper}>
            <input
              type="date"
              id="date"
              value={states.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className={styles.inputField}
              required
            />
            <label htmlFor="date" className={states.date ? styles.shrink : ""}>
              <h5>Fecha</h5>
            </label>
          </div>

       

          {/* Etiquetas */}
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.inputField}
              value={inputTag}
              onChange={handleTagsInputChange} // Maneja el cambio en el input
              onKeyUp={handleKeyPress} // Maneja el evento de tecla (Enter)
              placeholder="agregar etiquetas..."
            />
            <label
              htmlFor="tags"
              className={states.tags.length > 0 ? styles.shrink : ""}
            >
              <h5>Etiquetas</h5>
            </label>
          </div>

          {/*Visor de etiquetas*/}
          <div className={styles.tagsContainer}>
            {Array.isArray(states.tags) && states.tags.length > 0 ? (
              states.tags.map((tag, index) => (
                <li key={index}>
                  <h4>{tag}</h4>
                  <button
                    className={styles.deleteTag}
                    onClick={() => handleDeleteTag(tag)} // Eliminar tag al hacer clic
                  >
                    <FontAwesomeIcon icon={faCircleXmark} className="fa-fw" />
                  </button>
                </li>
              ))
            ) : (
              <p>No hay etiquetas.</p>
            )}
          </div>
        </div>

        {/* Categorías */}
        <div className={styles.categories}>
          {finalPath ? (
            <div className={styles.selectedCategory}>
              <h4>Categoría seleccionada: </h4>
              <h3>{states.path}</h3> {/* Accede directamente a states.path */}
              <button onClick={handleBack} className={styles.btnContainer}>
                Cancelar
              </button>
            </div>
          ) : (
            <div className={styles.categoriesList}>
              <h3 className={styles.categoriesTitle}>Seleccionar categoría</h3>

              {currentCategories.map((category) => (
                <h5
                  key={category.slug} // Usamos slug para la clave, que debería ser único
                  onClick={
                    () => handleCategorySelect(category) // Solo pasamos el slug de la categoría
                  }
                >
                  {`${category.name} >`}
                </h5>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
