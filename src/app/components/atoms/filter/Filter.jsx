"use client";
import { useState } from "react";
import styles from "./filter.module.css";

const tags = [
  "tradiciones",
  "arquitectura",
  "personajes",
  "eventos",
  "paisajes",
  "animales",
  "familia",
  "musica",
  "arte",
  "doma",
  "escuela",
];

const Filter = () => {
  const [startYear, setStartYear] = useState(1900);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes manejar la lógica de filtrado
    console.log({ startYear, endYear, eventType, location, selectedTags });
  };

  return (
    <div className={styles.filterContainer}>
      <h1>Filtrar imágenes por</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.startYear}>
          <label>
            Año de inicio
            <input
              type="text"
              placeholder="1900"
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value.length <= 4 &&
                  /^[0-9]*$/.test(value) &&
                  value >= 1900 &&
                  value <= endYear
                ) {
                  setStartYear(value);
                }
              }}
              maxLength={"4"}
            />
          </label>
        </div>

        <div className={styles.endYear}>
          <label>
            Año de fin
            <input
              type="text"
              placeholder="2024"
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value.length <= 4 &&
                  /^[0-9]*$/.test(value) &&
                  value >= 1900 &&
                  value <= endYear
                ) {
                  setEndYear(value);
                }
              }}
              maxLength={"4"}
            />
          </label>
        </div>

        <div className={styles.eventType}>
          <label>
            Tipo de Evento
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="celebracion">Celebración</option>
              <option value="desastre">Desastre</option>
              <option value="visita">Visita</option>
              {/* Agrega más opciones según sea necesario */}
            </select>
          </label>
        </div>

        <div className={styles.location}>
          <label>
            Ubicación
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej. Plaza Mayor"
            />
          </label>
        </div>

        <div className={styles.tagsWrapper}>
          <h3>Etiquetas</h3>
          <div className={styles.tags}>
            {tags.map((tag, index) => (
              <div key={tag} className={styles.tagContainer}>
                <label>
                  {tag}
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagChange(tag)}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit">Filtrar</button>
      </form>
    </div>
  );
};

export default Filter;
