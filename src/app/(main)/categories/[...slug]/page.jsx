import ImageViewer from "@/app/components/imageViewer/ImageViewer";
import { categories } from "@/app/fakeData/data"; // Verifica la importación

import Link from "next/link";
import styles from "../categories.module.css";
import SmallCard from "@/app/components/atoms/smallCard/SmallCard";
import SimpleButton from "@/app/components/atoms/simpleButton/SimpleButton";

// Componente asincrónico
const Page = async ({ params }) => {
  const { slug } = params;

  // Obtener las publicaciones desde la API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/publications`);
  const publications = await res.json();

  console.log(publications)

  // Lógica para encontrar la categoría
  const findCategory = (slugArray, categories) => {
    return (
      slugArray.reduce((currentCategories, slug) => {
        const category = currentCategories.find((cat) => cat.slug === slug);
        return category ? category.subcategories : [];
      }, categories) || []
    );
  };

  const subcategories = findCategory(slug, categories);

  const currentCategorySlug = slug[slug.length - 1];
  const currentCategories =
    categories.find((cat) => cat.slug === currentCategorySlug)?.subcategories ||
    [];

  return (
    <div className={styles.categoryPageContainer}>
      <div className={styles.leftMenuContainer}>
        <h1>{currentCategorySlug}</h1>
        <div className={styles.btnContainer}>
          <SimpleButton text={"Inicio"} href={"/archivo"} />
          <SimpleButton text={"Volver"} handler={"back"} />
        </div>
      </div>
      <div className={styles.displayRight}>
        {subcategories.length > 0 ? (
          <section className={styles.imagesContainer}>
            {subcategories.map((subCat, index) => (
              <h4 key={index}>
                <Link href={`/categories/${slug.join("/")}/${subCat.slug}`}>
                  <SmallCard data={subCat} />
                </Link>
              </h4>
            ))}
          </section>
        ) : (
          <ImageViewer
            publications={publications} // Pasar las publicaciones obtenidas
            categories={slug}
          />
        )}
      </div>
    </div>
  );
};

// Esta función genera las rutas estáticas
export function generateStaticParams() {
  const allParams = [];

  const buildParams = (cats, parentSlug = "") => {
    cats.forEach((cat) => {
      const currentSlug = parentSlug ? `${parentSlug}/${cat.slug}` : cat.slug;
      allParams.push({ slug: currentSlug.split("/") });
      if (cat.subcategories && cat.subcategories.length > 0) {
        buildParams(cat.subcategories, currentSlug);
      }
    });
  };

  buildParams(categories);
  return allParams;
}

export default Page;
