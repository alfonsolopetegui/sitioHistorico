import styles from "./selectedCard.module.css";
import Image from "next/image";
import { useState, useCallback } from "react";
import Pagination from "../pagination/Pagination";

const SelectedCard = ({ data, handler }) => {
  const [isAnimateIn, setisAnimateIn] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleAnimation = () => {
    setisAnimateIn(false);
    setTimeout(handler, 500); // Esperar a que termine la animación de salida
  };

  const handleClose = () => {
    handleAnimation();
  };

  //Paginación

  const pageCount = data.url.length;
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleFullscreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <>
      <div
        className={`${styles.selectedCardContainer}  ${
          isAnimateIn ? styles.enter : styles.exit
        }`}
      >
        <div
          className={`${styles.cardWrapper} ${
            data.orientation === "vertical"
              ? styles.verticalWrapper
              : styles.horizontalWrapper
          }`}
        >
          <div
            className={`${styles.imageContainer} ${
              data.orientation === "vertical"
                ? styles.verticalImage
                : styles.horizontalImage
            }`}
            onClick={handleFullscreen}
          >
            <Image
              src={data.url[currentPage]}
              alt="Descripción de la imagen"
              width={250}
              height={250}
            />
          </div>
          {data.url.length > 1 && (
            <div className={styles.paginationContainer}>
              <Pagination
                handlePageChange={handlePageChange}
                pageCount={pageCount}
              />
            </div>
          )}
        </div>

        <div
          className={`${styles.textContainer} ${
            data.orientation === "vertical"
              ? styles.verticalText
              : styles.horizontalText
          }`}
        >
          <h1>{data.title}</h1>
          <h4>{data.date.slice(0, 4)}</h4>
          <p className={styles.description}>{data.description}</p>
          <div className={styles.optionalText}>
            {data.date && (
              <p>
                <span>Fecha: </span>
                {data.date.slice(8, 10)}-{data.date.slice(5, 7)}-
                {data.date.slice(0, 4)}
              </p>
            )}
            {data.photographer && (
              <p>
                <span>Fotógrafo: </span>
                {data.photographer}
              </p>
            )}
            {data.credits && (
              <p>
                <span>Créditos: </span>
                {data.credits}
              </p>
            )}
          </div>
          <div className={styles.closeBtn} onClick={handleClose}>
            cerrar
          </div>
        </div>
      </div>
      {/* Fullscreen image */}
      <div
        className={`${styles.fullScreenImageContainer} ${
          isFullScreen ? styles.isFullScreen : ""
        }`}
        onClick={handleFullscreen}
      >
        <Image
          src={data.url[currentPage]}
          alt="Descripción de la imagen"
          width={250}
          height={250}
        />
      </div>
    </>
  );
};

export default SelectedCard;
