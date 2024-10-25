
import React, { useEffect, useState } from 'react';
import "./archive.scss";
import ArchiveCard from '../../components/archive-card/ArchiveCard';
import { useGetGroupArchive } from '../../services/serviceArchive';
import ReactPaginate from 'react-paginate';

const Archive = () => {
  const { data: groups, refetch: refresh, isLoading, isError } = useGetGroupArchive();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Nombre d'éléments par page

  // Calcule les éléments à afficher sur la page actuelle
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = groups?.data?.slice(indexOfFirstItem, indexOfLastItem) || [];

  // Fonction pour changer de page
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  useEffect(() => {
    refresh();
  }, [currentPage]); // Rafraîchir lorsque la page change

  if (isLoading) {
    return <p>Chargement des archives...</p>;
  }

  if (isError) {
    return <p>Erreur lors du chargement des archives.</p>;
  }

  return (
    <div className='container__archive'>
      <div className='title_archive' data-aos="slide-down">
        <span>Archives</span>
      </div>
      {groups?.data && groups.data.length > 0 ? (
        <>
          <div className="card-container" data-aos="fade-up">
            {/* Pass only the current page items to ArchiveCard */}
            <ArchiveCard groups={currentItems} />
          </div>
          <div data-aos="fade-down">
            <ReactPaginate
              previousLabel={'Précédent'}
              nextLabel={'Suivant'}
              breakLabel={'...'}
              pageCount={Math.ceil(groups.data.length / itemsPerPage)} // Nombre total de pages
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </div>
        </>
      ) : (
        <p>Aucune archive trouvée.</p>
      )}
    </div>
  );
};

export default Archive;
