import styles from "./cardSimple.module.css";
import Image from "next/image";

const CardSimple = ({ data, handler }) => {
  return (
    <div className={styles.cardContainer} onClick={handler}>
      <div className={styles.upperContainer}>
        <div className={styles.imageContainer}>
          <Image
            src={data.urls[0]}
            layout={"fill"}
            objectFit="cover"
            placeholder="blur"
            blurDataURL="https://via.placeholder.com/10"
          />
        </div>
      </div>

      <div className={styles.overlay}>
        <h1>{data.title}</h1>
        <h4>{data.date.slice(0, 4)}</h4>
      </div>
    </div>
  );
};

export default CardSimple;
