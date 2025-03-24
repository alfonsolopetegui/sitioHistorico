"use client"; // ✅ Necesario para usar `useCategories()`

import SmallCard from "@/app/components/atoms/smallCard/SmallCard";
import styles from "./archivo.module.css";
import { useState } from "react";

import { useCategories } from "../../../../hooks/useCategories";
import { useSubcategories } from "../../../../hooks/useSubcategories";
import SimpleButton from "@/app/components/atoms/simpleButton/SimpleButton";

import ImageViewer from "@/app/components/imageViewer/ImageViewer";
import LoginForm from "@/app/components/atoms/loginform/LoginForm";

import { SessionProvider } from "next-auth/react";
import AdminArchive from "@/app/components/atoms/adminArchive/AdminArchive";
import { HashLoader } from "react-spinners";

const Page = () => {
  const { categories, isLoading, error } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState([]);
  const [loginActive, setLoginActive] = useState(false);

  // Traemos las subcategorías de la categoría seleccionada, filtrando por `parentId`
  const {
    subcategories: currentSubcategories,
    isLoading: subcategoriesLoading,
    error: subcategoriesError,
  } = useSubcategories(selectedCategory?.id);

  if (isLoading)
    return (
      <div className={styles.loading}>
        <HashLoader size={50} color="#5CA4A9" />
      </div>
    );
  if (error) return <p>Error al cargar las categorías.</p>;

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

  // Mostrar subcategorías solo si la categoría seleccionada tiene subcategorías que coinciden con `parentId`
  const filteredSubcategories = currentSubcategories?.filter(
    (subcat) => subcat.parentId === selectedCategory?.id
  );

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

  return (
    <div className={styles.archivoContainer}>
      <SessionProvider>
        <div
          className={`${styles.loginContainer} ${
            loginActive ? styles.active : ""
          }`}
        >
          {loginActive && <LoginForm setLoginActive={setLoginActive} />}
          <h5 className={styles.close} onClick={() => setLoginActive(false)}>Cerrar</h5>
        </div>

        <div className={styles.menuContainer}>
          <h1>Bienvenid@</h1>
          {categoryTitle.length > 0 && (
            <SimpleButton handler={handleBack} text="Volver" />
          )}
          <div>
            <AdminArchive
              loginActive={loginActive}
              setLoginActive={setLoginActive}
            />
            {/* <h2 onClick={() => setLoginActive(true)}>Soy colaborador</h2> */}
          </div>
        </div>
      </SessionProvider>
      <div className={styles.displayRight}>
        {/* Mostrar el categoryTitle como un "path" de categorías seleccionadas */}
        <div className={styles.categoryPath}>
          <span>{categoryTitle.join(" > ")}</span>{" "}
          {/* Muestra el path de categorías */}
        </div>
        {/* Botón Volver si hay más de una categoría en el path */}

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
                  </div>
                ))}
              </div>
            ) : (
              <ImageViewer category={selectedCategory} />
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
                  </div>
                ))}
              </div>
            ) : (
              <ImageViewer category={selectedCategory} />
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Page;
