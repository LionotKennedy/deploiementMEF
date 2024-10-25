import React, { useState, useEffect } from 'react';
import "./user.scss";
import UserCard from '../../components/user-card/UserCard';
import { useGetUser } from '../../services/serviceUser';
import { MdAdd } from 'react-icons/md';
import UserScreenDialog from '../../components/MUI/UserModal';
import ReactPaginate from 'react-paginate';

const User = () => {
  const [modalOpen, setModalOpen] = useState(false); // État pour gérer l'ouverture/fermeture de la modale
  const { data: users, refetch, isLoading, isError } = useGetUser();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Nombre d'éléments par page

  // Calcule les éléments à afficher sur la page actuelle
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users?.data?.slice(indexOfFirstItem, indexOfLastItem) || [];

  // Fonction pour changer de page
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);

  // Fonction pour ouvrir le dialogue
  const handleOpenDialog = () => {
    setModalOpen(true);
  };

  // Fonction pour fermer le dialogue
  const handleCloseDialog = () => {
    setModalOpen(false);
  };

  if (isLoading) {
    return <p>Chargement des utilisateurs...</p>;
  }

  if (isError) {
    return <p>Erreur lors du chargement des utilisateurs.</p>;
  }

  // Count total items
  const totalItems = users?.data ? users.data.length : 0;

  const displayTotalItems = () => {
    if (totalItems > 0) {
      return (
        <p>Nombre d'utilisateurs : {totalItems}</p>
      );
    }
    return null;
  };

  return (
    <div className='container__archive'>
      <div className='content__users'>
        <div className='title__user' data-aos="slide-down">
          <span>Liste des utilisateurs</span>
        </div>
        <div className='add__users'>
          <MdAdd onClick={handleOpenDialog} className="icon_adds user__add" style={{ marginLeft: '10px', fontSize: '24px' }} />
        </div>
      </div>
      {users?.data && users.data.length > 0 ? (
        <>
          <div className="card-container" data-aos="fade-down">
            <UserCard users={currentItems} refetch={refetch} />
          </div>
          <div data-aos="fade-up">
            <ReactPaginate
              previousLabel={'Précédent'}
              nextLabel={'Suivant'}
              breakLabel={'...'}
              pageCount={Math.ceil(users.data.length / itemsPerPage)} // Nombre total de pages
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </div>
          <div data-aos="slide-up">
            {displayTotalItems()}
          </div>
        </>
      ) : (
        <p>Aucun utilisateur trouvé.</p>
      )}
      <UserScreenDialog open={modalOpen} handleClose={handleCloseDialog} onSuccess={refetch} />
    </div>
  );
};

export default User;

