import Link from "next/link";
import styles from "./optionMenu.module.css";

const OptionMenu = ({ path, name, handler }) => {
  return (
    <div className={styles.optionContainer} onClick={handler}>
      <Link href={path}>{name}</Link>
    </div>
  );
};

export default OptionMenu;
