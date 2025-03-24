import { useState, useEffect } from "react";
import styles from "./editComponent.module.css";

import { PublicationDataSetter } from "../atoms/publicationDataSetter/PublicationDataSetter";
import { DescriptionSetter } from "../atoms/descriptionSetter/DescriptionSetter";
import { ImageUploader } from "../atoms/imageUploader/ImageUploader";
import {
  ref,
  deleteObject,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../../../utils/firebase";
import { usePublications } from "../../../../hooks/usePublications";
import Image from "next/image";
import Pagination from "../atoms/pagination/Pagination";

import Swal from "sweetalert2";
import { HashLoader } from "react-spinners";

const EditComponent = ({ active, setActive }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [noMatch, setNoMatch] = useState(false);
  const [selectedPub, setSelectedPub] = useState(null); // Estado para la publicación seleccionada
  const [isSaving, setIsSaving] = useState(false);
  const [states, setStates] = useState({
    title: "",
    photographer: "",
    description: "",
    credits: "",
    date: "",
    tags: [],
    urls: [],
    categoryId: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  //Paginación
  // Lógica para calcular las imágenes que se mostrarán
  const startIndex = currentPage * itemsPerPage;
  const currentPublications = searchResult.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const pageCount = Math.ceil(searchResult.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  //SWR hook para obtener las publicaciones desde el servidor
  const { publications, isLoading, error } = usePublications();

  if (isLoading)
    return (
      <div className={styles.loading}>
        <HashLoader size={50} color="#5CA4A9" />
      </div>
    );
  if (error) return Swal.fire("Error al cargar las publicaciones");

  // Actualiza el estado cuando seleccionas una publicación directamente
  const handleSelectPub = (pub) => {
    setSelectedPub(pub); // Set the selected image when clicked
    setStates({
      title: pub.title,
      photographer: pub.photographer,
      description: pub.description,
      credits: pub.credits,
      date: pub.date,
      tags: pub.tags,
      urls: pub.urls,
      categoryId: pub.categoryId,
    });
  };

  //Buscador
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      // Filtra las imágenes cuyo título contiene la cadena de búsqueda
      const filteredPublications = publications.filter((pub) =>
        pub.title.toLowerCase().includes(search.toLowerCase())
      );
      if (filteredPublications.length > 0) {
        setSearchResult(filteredPublications);
        setNoMatch(false);
      } else {
        setSearchResult([]); // Si no hay resultados, limpiamos los resultados
        setNoMatch(true);
      }
    }
  };

  // Función para subir las imágenes a Firebase Storage
  const uploadImagesToStorage = async (files) => {
    const imageUrls = []; // Guardamos las URLs de las imágenes subidas
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `publications/${file.name}`); // Aquí se usa ref correctamente
        const uploadTask = uploadBytesResumable(storageRef, file); // Usamos uploadBytesResumable con la referencia

        uploadTask.on(
          "state_changed",
          null, // Puedes agregar el progreso de carga aquí si lo deseas
          (error) => reject(error), // En caso de error, lo rechazamos
          async () => {
            // Una vez que la imagen se haya subido correctamente
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref); // Obtener URL de descarga
            imageUrls.push(downloadURL);
            resolve();
          }
        );
      });
    });

    // Esperamos que todas las imágenes se suban
    await Promise.all(promises);

    return imageUrls; // Devolvemos las URLs de las imágenes
  };

  const deleteImagesFromStorage = async (urls) => {
    const promises = urls.map(async (url) => {
      const imageRef = ref(storage, url);
      await deleteObject(imageRef);
    });

    try {
      await Promise.all(promises);
      console.log("Todas las imágenes se han eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar las imágenes:", error);
      throw new Error("Hubo un error al eliminar las imágenes.");
    }
  };

  const handleSave = () => {
    Swal.fire({
      title: "Seguro que deseas guardar los cambios?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Ok",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        savePublication();
      } else if (result.isDenied) {
        return;
      }
    });
  };

  const savePublication = async () => {
    // Verifica que los datos esenciales estén presentes antes de hacer el PUT
    if (!states.title || !states.description || !states.photographer) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    setIsSaving(true);
    try {
      let imageUrls = [];

      // Si se han subido nuevas imágenes, las subimos y obtenemos sus URLs
      if (imageFiles.length > 0) {
        imageUrls = await uploadImagesToStorage(imageFiles); // Subir las imágenes nuevas
      } else {
        // Si no hay nuevas imágenes, mantenemos las URLs existentes
        imageUrls = states.urls;
      }

      // Datos que vamos a enviar, con las URLs actualizadas de las imágenes
      const updatedData = {
        title: states.title,
        description: states.description,
        photographer: states.photographer,
        credits: states.credits,
        date: states.date,
        tags: states.tags,
        urls: imageUrls, // Usamos las URLs obtenidas
        categoryId: states.categoryId,
      };

      // Hacemos la solicitud PUT para actualizar la publicación
      const response = await fetch(`/api/publications/${selectedPub.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setIsSaving(false);
        Swal.fire("Publicación guardada con éxito", "", "success");
        setStates({
          title: "",
          photographer: "",
          description: "",
          credits: "",
          date: "",
          tags: [],
          urls: [],
          categoryId: "",
        });
        setImageFiles([]); // Limpiar las imágenes después del éxito
        setSelectedPub(null); // Limpiar la publicación seleccionada
        setSearch(""); // Limpiar la búsqueda
        setSearchResult([]); // Limpiar los resultados de la búsqueda
      } else {
        setIsSaving(false);
        Swal.fire("Hubo un error al guardar la publicación", "", "error");
      }
    } catch (error) {
      setIsSaving(false);
      console.error("Error al actualizar la publicación:", error);
      Swal.fire("Hubo un error al guardar la publicación", "", "error");
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Seguro que deseas eliminar esta publicación?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Ok",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        deletePublication();
      } else if (result.isDenied) {
        return;
      }
    });
  };

  const deletePublication = async () => {
    if (!selectedPub) return;
    setIsSaving(true);
    try {
      // Eliminar las imágenes del almacenamiento
      await deleteImagesFromStorage(selectedPub.urls);

      // Eliminar la publicación de la base de datos
      const response = await fetch(`/api/publications/${selectedPub.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsSaving(false);
        Swal.fire(
          "La publicación se ha eliminado correctamente",
          "",
          "success"
        );
        setSelectedPub(null);
        setStates({
          title: "",
          photographer: "",
          description: "",
          credits: "",
          date: "",
          tags: [],
          urls: [],
          categoryId: "",
        });
        setImageFiles([]); // Limpiar las imágenes después del éxito
        setSearch(""); // Limpiar la búsqueda
        setSearchResult([]); // Limpiar los resultados de la búsqueda
      } else {
        setIsSaving(false);
        Swal.fire(
          "Hubo un error al eliminar la publicación. Intenta nuevamente",
          "",
          "error"
        );
      }
    } catch (error) {
      setIsSaving(false);
      console.error("Error al eliminar la publicación:", error);
      Swal.fire(
        "Hubo un error al eliminar la publicación. Intenta nuevamente",
        "",
        "error"
      );
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Seguro que deseas cancelar? Los cambios no guardados se perderán",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Ok",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        setActive("");
      } else if (result.isDenied) {
        return;
      }
    });
  };

  return (
    <div className={styles.editorWrapper}>
      {selectedPub ? (
        // Si seleccionaron una publicación, mostrar el data setter para edición
        <div className={styles.editCompContainer}>
          <div className={styles.leftDisplay}>
            <PublicationDataSetter
              isEditMode={true}
              states={states}
              setStates={setStates}
            />
          </div>
          <div className={styles.rightDisplay}>
            <ImageUploader
              imageFiles={imageFiles}
              setImageFiles={setImageFiles}
              isEditMode={true}
              states={states}
              setStates={setStates}
            />
            <div className={styles.rightBottom}>
              <DescriptionSetter
                isEditMode={true}
                states={states}
                setStates={setStates}
              />
              <div className={styles.btnContainer}>
                <article
                  className={styles.btn}
                  style={{ backgroundColor: "#ABE188", color: "white" }}
                  onClick={handleSave}
                >
                  <h5>Guardar</h5>
                </article>
                <article
                  className={styles.btn}
                  style={{ backgroundColor: "#B0A1BA", color: "white" }}
                  onClick={handleCancel}
                >
                  <h5>Cerrar</h5>
                </article>
                <article
                  className={styles.btn}
                  style={{ backgroundColor: "#43BCCD", color: "white" }}
                >
                  <h5>Borrador</h5>
                </article>
                <article
                  className={styles.btn}
                  style={{ backgroundColor: "#EA3546", color: "white" }}
                  onClick={handleDelete}
                >
                  <h5>Eliminar</h5>
                </article>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.searchContainer}>
         
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyUp={handleEnter}
            placeholder="Busca por título de publicación"
          />
          <div className={styles.searchResults}>
            {currentPublications.length > 0
              ? currentPublications.map((image, index) => (
                  <div
                    className={styles.tinyCard}
                    key={index}
                    onClick={() => handleSelectPub(image)}
                  >
                    <div className={styles.imageContainer}>
                      <Image src={image.urls[0]} width={250} height={250} />
                    </div>

                    <h3>{image.title}</h3>
                    <h3>{image.date.slice(0, 4)}</h3>
                  </div>
                ))
              : noMatch && <h3>No encontramos publicaciones con ese título</h3>}
          </div>
          {searchResult.length > 0 ? (
            <Pagination
              handlePageChange={handlePageChange}
              pageCount={pageCount}
            />
          ) : null}
        </div>
      )}

      {isSaving && (
        <div className={styles.loading}>
          <HashLoader size={50} color="#5CA4A9" />
        </div>
      )}
    </div>
  );
};

export default EditComponent;
