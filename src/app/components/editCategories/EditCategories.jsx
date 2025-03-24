"use client";

import { useState } from "react";
import styles from "./editCategories.module.css";
import SmallCard from "@/app/components/atoms/smallCard/SmallCard";
import SimpleButton from "@/app/components/atoms/simpleButton/SimpleButton";
import { useCategories } from "../../../../hooks/useCategories";
import { useSubcategories } from "../../../../hooks/useSubcategories";
import { ImageUploader } from "../atoms/imageUploader/ImageUploader";

import { Lilita_One } from "next/font/google";


const lilita = Lilita_One({ subsets: ["latin"], weight: "400" });

import { storage } from "../../../../utils/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import imageCompression from "browser-image-compression";

import Swal from "sweetalert2";

import { mutate } from "swr";

import { HashLoader } from "react-spinners";

const EditCategories = () => {
  const { categories, isLoading, error } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState([]); // Restauramos el título de las categorías seleccionadas
  const [states, setStates] = useState({
    name: "",
    urls: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [creatorActive, setCreatorActive] = useState(false);
  const [loader, setLoader] = useState(false);

  // Traemos las subcategorías de la categoría seleccionada, filtrando por `parentId`
  const {
    subcategories: currentSubcategories,
    isLoading: subcategoriesLoading,
    error: subcategoriesError,
  } = useSubcategories(selectedCategory?.id);

  if (isLoading || subcategoriesLoading || loader)
    return (
      <div className={styles.loading}>
        <HashLoader size={50} color="#5CA4A9" />
      </div>
    );
  if (error || subcategoriesError)
    return Swal.fire("Error al cargar las publicaciones");
  if (!categories || categories.length === 0)
    return <p>No hay categorías disponibles.</p>;

  // Función para subir las imágenes a Firebase Storage
  const uploadImagesToStorage = async (files) => {
    const imageUrls = [];

    const promises = files.map(async (file) => {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        const storageRef = ref(storage, `categories/${compressedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, compressedFile);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
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

  const deleteImagesFromStorage = async (urls) => {
    const promises = urls.map(async (url) => {
      const imageRef = ref(storage, url);

      try {
        // Verifica si la imagen existe antes de eliminarla
        await getDownloadURL(imageRef); // Si existe, obtendrá la URL
        await deleteObject(imageRef); // Si no hay error, elimina el archivo
        console.log(`Imagen eliminada: ${url}`);
      } catch (error) {
        if (error.code === "storage/object-not-found") {
          console.warn(`La imagen no se encuentra: ${url}`);
        } else {
          console.error(`Error al eliminar la imagen ${url}:`, error);
          throw new Error(`Hubo un error al eliminar las imágenes.`);
        }
      }
    });

    try {
      await Promise.all(promises); // Espera a que todas las promesas se resuelvan
      console.log("Todas las imágenes se han eliminado correctamente.");
    } catch (error) {
      console.error("Error general al eliminar imágenes:", error);
    }
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
        saveCategory();
      } else if (result.isDenied) {
        return;
      }
    });
  };

  const saveCategory = async () => {
    if (!states.name) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    setLoader(true);

    try {
      const imageUrls = await uploadImagesToStorage(imageFiles);

      // Crear el objeto postData
      const postData = {
        name: states.name,
        slug: states.name.toLowerCase(),
        imageUrl: imageUrls[0],
      };

      let response;

      // Si hay una categoría seleccionada, estamos creando una subcategoría
      if (selectedCategory && selectedCategory.id) {
        // Asignamos el parentId para indicar que es una subcategoría
        postData.parentId = selectedCategory.id;

        // Enviar el postData a la colección de subcategorías
        response = await fetch("/api/subcategories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
      } else {
        // Si no hay categoría seleccionada, estamos creando una categoría
        response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
      }

      if (response.ok) {
        setLoader(false);
        Swal.fire("Guardado con éxito", "", "success");
        setStates({
          name: "",
          urls: [],
        });
        setImageFiles([]);
        setCreatorActive(false);

        // Fuerza la recarga de los datos
        mutate("/api/categories");
        if (selectedCategory && selectedCategory.id) {
          mutate("/api/subcategories");
        }
      } else {
        setLoader(false);

        Swal.fire("Hubo un error al guardar la publicación", "", "error");
      }
    } catch (error) {
      setLoader(false);

      console.error("Error al guardar la publicación:", error);
      Swal.fire("Hubo un error al guardar la publicación", "", "error");
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCategoryTitle((prevTitle) => [...prevTitle, category.name]); // Actualiza el título de categorías
  };

  const handleBack = () => {
    const newCategoryTitle = [...categoryTitle];
    newCategoryTitle.pop(); // Elimina la última categoría

    setCategoryTitle(newCategoryTitle); // Actualiza el estado del título de categoría

    const newSelectedCategory =
      newCategoryTitle.length > 0
        ? findCategoryByName(
            categories,
            newCategoryTitle[newCategoryTitle.length - 1]
          )
        : null;

    setSelectedCategory(newSelectedCategory);
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

  const handleChange = (field, value) => {
    setStates((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Mostrar subcategorías solo si la categoría seleccionada tiene subcategorías que coinciden con `parentId`
  const filteredSubcategories = currentSubcategories?.filter(
    (subcat) => subcat.parentId === selectedCategory?.id
  );

  const handleDeleteCategory = (e, category) => {
    console.log("Eliminar categoría:", category);
    e.stopPropagation();

    Swal.fire({
      title: "Seguro que deseas eliminar la categoría?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Ok",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCategory(category);
      } else if (result.isDenied) {
        return;
      }
    });
  };

  const deleteCategory = async (category) => {

    try {
      if (category.imageUrl) {
        await deleteImagesFromStorage(
          Array.isArray(category.imageUrl)
            ? category.imageUrl
            : [category.imageUrl]
        );
      }

      setLoader(true);

      let response;

      if (category.parentId) {
        console.log("Es una subcategoría");
        // Es una subcategoría
        response = await fetch(`/api/subcategories/${category.id}`, {
          method: "DELETE",
        });
      } else {
        // Es una categoría principal
        response = await fetch(`/api/categories/${category.id}`, {
          method: "DELETE",
        });
      }

      if (response.ok) {
        setLoader(false);
        Swal.fire("Eliminado con éxito", "", "success");

        // Actualizar las categorías o subcategorías
        mutate("/api/categories");
        if (category.parentId) {
          mutate("/api/subcategories");
        }
      } else {
        setLoader(false);
        Swal.fire("Hubo un error al eliminar la categoría", "", "error");
      }
    } catch (error) {
      setLoader(false);
      console.error("Error al eliminar la categoría:", error);
      Swal.fire("Hubo un error al eliminar la categoría", "", "error");
    }
  };

  return (
    <div className={styles.editCategoriesWrapper}>
      <div className={styles.displayRight}>
        <div className={styles.header}>
          <h1>Editor de categorías</h1>
          <h3 onClick={() => setCreatorActive(!creatorActive)}>{creatorActive ? "Ocultar" : "Agregar aquí"}</h3>
        </div>

        {/* Mostrar el categoryTitle como un "path" de categorías seleccionadas */}
        <div className={styles.categoryPath}>
          <span>{categoryTitle.join(" > ")}</span>{" "}
          {/* Muestra el path de categorías */}
        </div>

        {/* Mostrar categorías solo si no se ha seleccionado una subcategoría */}
        {!selectedCategory && (
          <section>
            {categories && categories.length > 0 ? (
              <div className={styles.categoriesContainer}>
                {categories.map((category) => (
                  <div
                    className={styles.categoryCard}
                    key={category.id}
                    onClick={() => handleSelectCategory(category)}
                  >
                    <SmallCard data={category} />
                    <div
                      className={styles.deleteButton}
                      onClick={(e) => {
                        handleDeleteCategory(e, category);
                      }}
                    >
                      X
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay categorías disponibles.</p>
            )}
          </section>
        )}

        {/* Mostrar subcategorías si se ha seleccionado una categoría */}
        {selectedCategory && (
          <section>
            {filteredSubcategories && filteredSubcategories.length > 0 ? (
              <div className={styles.categoriesContainer}>
                {filteredSubcategories.map((category) => (
                  <div
                    className={styles.categoryCard}
                    key={category.id}
                    onClick={() => handleSelectCategory(category)}
                  >
                    <SmallCard data={category} />
                    <div
                      className={styles.deleteButton}
                      onClick={(e) => {
                        handleDeleteCategory(e, category);
                      }}
                    >
                      x
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay subcategorías disponibles.</p>
            )}
          </section>
        )}

        {/* Botón Volver si hay más de una categoría en el path */}
        {categoryTitle.length > 0 && (
          <SimpleButton handler={handleBack} text="Volver" />
        )}

        {/* Mostrar el creador de categorías solo si está activo */}
        {creatorActive && (
          <div className={`${styles.categoryCreator} ${styles.active}`}>
            <h2 className={`${styles.creatorTitle} ${lilita.className}`}>Crear nueva categoría</h2>
            <div className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="categoryName"><h3>Nombre de la categoría:</h3></label>
                <input
                  id="categoryName"
                  type="text"
                  value={states.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  
                />
              </div>

              <div className={styles.imageUp}>
                <ImageUploader
                  states={states}
                  setStates={setStates}
                  imageFiles={imageFiles}
                  setImageFiles={setImageFiles}
                />
              </div>
              <div className={styles.buttonContainer}>
                <SimpleButton
                  handler={handleSave}
                  label="Guardar categoría"
                  text="Crear"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCategories;
