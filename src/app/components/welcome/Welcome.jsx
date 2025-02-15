import Link from "next/link";
import styles from "./welcome.module.css";
import Image from "next/image";

const Welcome = () => {
  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.leftDiv}>
        <div className={styles.imageContainer}>
          <Image src={"/alvear.jpg"} fill></Image>
        </div>
      </div>
      <div className={styles.rightDiv}>
        <div className={styles.textContainer}>
          <h1>General Alvear</h1>
          <Link href={"/archivo"}>
            <button>Comenzar</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
