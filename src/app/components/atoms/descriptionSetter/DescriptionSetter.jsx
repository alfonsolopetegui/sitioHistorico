import styles from "./descriptionSetter.module.css";
import { lato } from "@/app/googleFonts/googleFonts";

export const DescriptionSetter = ({ states, setStates, isEditMode }) => {
  

  // Actualiza el estado del campo específico
  const handleChange = (field, value) => {
    setStates((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <div className={styles.descriptionContainer}>
      <div className={styles.topDisplay}>
        <h2>Crear Descripción</h2>
      </div>
      <div className={styles.bottomDisplay}>
        <textarea
          placeholder="Descripción de la publicación..."
          className={`${styles.description}`}
          id="description"
          value={states.description}
          onChange={(e) => handleChange("description", e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};
