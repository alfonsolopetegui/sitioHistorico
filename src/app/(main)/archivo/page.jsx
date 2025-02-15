import SmallCard from "@/app/components/atoms/smallCard/SmallCard";
import styles from "./archivo.module.css";
import { categories } from "@/app/fakeData/data";
import Link from "next/link";
import Login from "@/app/components/atoms/login/Login";

const Page = () => {
  return (
    <div className={styles.archivoContainer}>
      <div className={styles.menuContainer}>
        <h1>Inicio</h1>
        <div>
          <Login />
        </div>
      </div>
      <div className={styles.displayRight}>
        <section className={styles.imagesContainer}>
          {categories &&
            categories.map((cat, index) => (
              <Link key={index} href={`/categories/${cat.slug}`}>
                <SmallCard data={cat} />
              </Link>
            ))}
        </section>
      </div>
    </div>
  );
};

export default Page;
