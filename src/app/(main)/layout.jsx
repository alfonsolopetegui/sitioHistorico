import Nav from "../components/nav/Nav";
import styles from "./layout.module.css"



const layout = ({children}) => {


  return (
    <div className={styles.layoutContainer}>
      <Nav />
      {children}
    </div>
  );
};

export default layout;
