"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "../categories.module.css";
import SmallCard from "@/app/components/atoms/smallCard/SmallCard";
import SimpleButton from "@/app/components/atoms/simpleButton/SimpleButton";
import ImageViewer from "@/app/components/imageViewer/ImageViewer";
import { useCategories } from "../../../../../hooks/useCategories";

const Page = () => {
  const { slug } = useParams(); // Obtiene los parámetros de la URL
  const { categories, isLoading, error } = useCategories();

  if (isLoading) return <p>Cargando categorías...</p>;
  if (error) return <p>Error al cargar categorías</p>;
  if (!categories || categories.length === 0) return <p>No hay categorías disponibles.</p>;

  const slugArray = Array.isArray(slug) ? slug : [slug]; // Asegura que sea un array

  // Lógica para encontrar la categoría en la jerarquía
  const findCategory = (slugArray, categories) => {
    return slugArray.reduce((currentCategories, slug) => {
      const category = currentCategories.find((cat) => cat.slug === slug);
      return category ? category.subcategories : [];
    }, categories) || [];
  };

  const subcategories = findCategory(slugArray, categories);
  const currentCategorySlug = slugArray[slugArray.length - 1];
  const currentCategories =
    categories.find((cat) => cat.slug === currentCategorySlug)?.subcategories || [];

  return (
    <div className={styles.categoryPageContainer}>
      <div className={styles.leftMenuContainer}>
        <h1>{currentCategorySlug}</h1>
        <div className={styles.btnContainer}>
          <SimpleButton text={"Inicio"} href={"/archivo"} />
          <SimpleButton text={"Volver"} handler={() => window.history.back()} />
        </div>
      </div>
      <div className={styles.displayRight}>
        {subcategories.length > 0 ? (
          <section className={styles.imagesContainer}>
            {subcategories.map((subCat) => (
              <h4 key={subCat.id}>
                <Link href={`/categories/${slugArray.join("/")}/${subCat.slug}`}>
                  <SmallCard data={subCat} />
                </Link>
              </h4>
            ))}
          </section>
        ) : (
          <ImageViewer categories={slugArray} />
        )}
      </div>
    </div>
  );
};

export default Page;
