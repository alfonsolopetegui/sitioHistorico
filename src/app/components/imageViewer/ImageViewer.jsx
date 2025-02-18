"use client";
import styles from "./imageViewer.module.css";
import CardSimple from "../atoms/CardSimple/CardSimple";
import { useState } from "react";
import SelectedCard from "../atoms/selectedCard/SelectedCard";
import Pagination from "../atoms/pagination/Pagination";
// import { Images } from "@/app/fakeData/data";

const ImageViewer = ({ categories, publications }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  const handleCards = (card) => {
    setSelectedCard(card);
  };

  const handleClose = () => {
    setSelectedCard(null);
  };

  console.log(publications);
// Filtrar imágenes según las categorías
const filteredPublications = publications.filter((pub) =>
  categories.every(category => pub.categories.includes(category))
);


  console.log("Categorías:", categories);
  console.log("Imágenes filtradas:", filteredPublications);

  // Lógica para calcular las imágenes que se mostrarán
  const startIndex = currentPage * itemsPerPage;
  const currentPublications = filteredPublications.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const pageCount = Math.ceil(filteredPublications.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className={styles.viewerContainer}>
      {selectedCard ? (
        <div className={styles.selectedCardContainer}>
          <SelectedCard data={selectedCard} handler={handleClose} />
        </div>
      ) : (
        <div className={styles.cardList}>
          {currentPublications.length > 0 ? (
            currentPublications.map((data, index) => (
              <CardSimple
                key={index}
                data={data}
                handler={() => handleCards(data)}
              />
            ))
          ) : (
            <p>No hay imágenes disponibles para esta categoría.</p>
          )}
        </div>
      )}

      {selectedCard ? null : (
        <Pagination handlePageChange={handlePageChange} pageCount={pageCount} />
      )}
    </div>
  );
};

export default ImageViewer;
