import ReactPaginate from "react-paginate";
import styles from "./pagination.module.css"

const Pagination = ({handlePageChange, pageCount}) => {


  return (
    <>
       <ReactPaginate
          previousLabel={"< anterior"}
          nextLabel={"siguiente >"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={styles.pagination}
          pageClassName={styles.page} 
          activeClassName={styles.active}
          previousClassName={styles.previous}
          nextClassName={styles.next}
          renderOnZeroPageCount={null}
        />
    </>
  );
};

export default Pagination;
