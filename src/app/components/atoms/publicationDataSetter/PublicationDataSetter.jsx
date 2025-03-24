"use client";

import { useEffect, useState } from "react";
import styles from "./publicationDataSetter.module.css";
import { Lilita_One } from "next/font/google";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

import { useCategories } from "../../../../../hooks/useCategories";
import { useSubcategories } from "../../../../../hooks/useSubcategories";
import { HashLoader } from "react-spinners";
import SimpleButton from "../simpleButton/SimpleButton";

const lilita = Lilita_One({ subsets: ["latin"], weight: "400" });

export const PublicationDataSetter = ({ states, setStates, isEditMode }) => {
  const [inputTag, setInputTag] = useState("");

  const { categories = [], isLoading, error } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState([]);

  // Traemos las subcategorías de la categoría seleccionada, filtrando por `parentId`
  const {
    subcategories: currentSubcategories = [],
    isLoading: subcategoriesLoading,
    error: subcategoriesError,
  } = useSubcategories(selectedCategory?.id);

  console.log(states.categoryId);
  console.log(categoryTitle)

  useEffect(() => {
    if (
      states.categoryId &&
      categories && // Asegúrate de que categories esté definido
      categories.length > 0 &&
      currentSubcategories?.length > 0
    ) {
      const path = getCategoryPath(states.categoryId, categories, currentSubcategories);
      setCategoryTitle(path);
      
    }
  }, [
    states.categoryId,
    categories,
    currentSubcategories,
  ]);
  

  if (isLoading || subcategoriesLoading)
    return (
      <div className={styles.loading}>
        <HashLoader size={50} color="#5CA4A9" />
      </div>
    );

  const getCategoryPath = (categoryId, categories, allSubcategories) => {
    let path = [];
    let allItems = [...categories, ...allSubcategories]; // Unir categorías y subcategorías en un solo array
    let currentCategory = allItems.find((item) => item.id === categoryId);

    // Recorre la jerarquía hacia arriba
    while (currentCategory) {
      path.unshift(currentCategory.name); // Agrega al inicio
      currentCategory = allItems.find(
        (item) => item.id === currentCategory.parentId
      );
    }

    return path;
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCategoryTitle((prevTitle) => [...prevTitle, category.name]); // Actualiza el título de categorías
    setStates((prevState) => ({
      ...prevState,
      categoryId: category.id,
    }));
  };

  // Mostrar subcategorías solo si la categoría seleccionada tiene subcategorías que coinciden con `parentId`
  const filteredSubcategories = currentSubcategories?.filter(
    (subcat) => subcat.parentId === selectedCategory?.id
  );

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

  const handleBack = () => {
    if (categoryTitle.length === 0) {
      setStates((prevState) => ({ ...prevState, categoryId: null }));
      setSelectedCategory(null);
      setCategoryTitle([]);
      return;
    }
  
    const newCategoryTitle = [...categoryTitle];
    newCategoryTitle.pop(); // Elimina la última categoría
  
    setCategoryTitle(newCategoryTitle); // Actualiza el estado del título de categoría
  
    const newSelectedCategory =
      newCategoryTitle.length > 0
        ? findCategoryByName([...categories, ...currentSubcategories], newCategoryTitle[newCategoryTitle.length - 1])
        : null;
  
    setSelectedCategory(newSelectedCategory);
    setStates((prevState) => ({
      ...prevState,
      categoryId: newSelectedCategory ? newSelectedCategory.id : null,
    }));
  };
  
  

  const findCategoryByName = (categories, name) => {
    for (const category of categories) {
      if (category.name === name) {
        return category;
      }
      if (category.subcategories && category.subcategories.length > 0) {
        const found = findCategoryByName(category.subcategories, name);
        if (found) return found;
      }
    }
    return null;
  };

  const handleDeleteCategory = () => {
    setStates({ ...states, categoryId: null }); // Vaciamos el categoryId
    setSelectedCategory(null); // También vacía la categoría seleccionada
    setCategoryTitle([]); // Vacía el título de categoría
  };

  return (
    <div className={styles.publicationDSContainer}>
      <div className={styles.topDisplay}>
        <h2 className={lilita.className}>{isEditMode ? "Editar Información" : "Agregar Información"}</h2>
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
          {/* Mostrar el título de la categoría y el botón de borrar si hay un categoryId */}
          {states.categoryId ? (
            <section>
              <h2>{categoryTitle.join("/")}</h2>
              
              {/* Botón para borrar */}
            </section>
          ) : (
            !selectedCategory && (
              <section>

                {categories && categories.length > 0 ? (
                  <div className={styles.categoriesContainer}>
                    {categories.map((category) => (
                      <div
                        className={styles.categoryCard}
                        key={category.id}
                        onClick={() => handleSelectCategory(category)}
                      >
                        <h4
                          style={{ cursor: "pointer" }}
                        >{`${category.name}>`}</h4>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No hay categorías disponibles.</p>
                )}
              </section>
            )
          )}

          {/* Mostrar subcategorías si se ha seleccionado una categoría */}
          {selectedCategory && (
            <section>
              {/* <h2>{categoryTitle.join("/")}</h2> */}
              {filteredSubcategories && filteredSubcategories.length > 0 ? (
                <div className={styles.categoriesContainer}>
                  {filteredSubcategories.map((category) => (
                    <div
                      className={styles.categoryCard}
                      key={category.id}
                      onClick={() => handleSelectCategory(category)}
                    >
                      <h4
                        style={{ cursor: "pointer" }}
                      >{`${category.name}>`}</h4>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No hay subcategorías disponibles.</p>
              )}
            </section>
          )}

           {/* Mostrar botón "Volver" solo si hay una categoría seleccionada */}
           {categoryTitle.length > 0 && (
            <SimpleButton handler={handleBack} text="Volver" />
          )}
        </div>
      </div>
    </div>
  );
};
