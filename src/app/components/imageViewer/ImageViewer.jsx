"use client";
import styles from "./imageViewer.module.css";
import CardSimple from "../atoms/CardSimple/CardSimple";
import { useState } from "react";
import SelectedCard from "../atoms/selectedCard/SelectedCard";
import Pagination from "../atoms/pagination/Pagination";
// import { Images } from "@/app/fakeData/data";

import { usePublications } from "../../../../hooks/usePublications";

import Swal from "sweetalert2";
import { HashLoader } from "react-spinners";

const ImageViewer = ({ category }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  const { publications, isLoading, error } = usePublications();

  if (isLoading)
    return (
      <div className={styles.loaderContainer}>
        <HashLoader size={80} />
      </div>
    );
  if (error) return Swal.fire("Error", "Ha ocurrido un error", "error");

  const handleCards = (card) => {
    setSelectedCard(card);
  };

  const handleClose = () => {
    setSelectedCard(null);
  };

  
  // Filtrar imágenes según las categorías
  const filteredPublications = publications.filter(
    (publication) => publication.categoryId === category.id
  );

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
