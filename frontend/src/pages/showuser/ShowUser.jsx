
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetUserById } from '../../services/serviceUser';
import { FaArrowLeft } from 'react-icons/fa';
import './showuser.scss';

const ShowUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  const { data: userData, error, isLoading } = useGetUserById(userId);

  useEffect(() => {
    if (userData && userData.data) {
      // console.log('Données de l\'utilisateur:', userData);
    }
  }, [userData]);

  const handleBackClick = () => {
    navigate('/utilisateur');
  };

  return (
    <div className="container__users">
      <div className='content__header__show'>
        <div className="icon__back__show">
          <FaArrowLeft
            className="back__icon__show"
            onClick={handleBackClick}
            size={24}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className='title__show'>
          <span>Profile d'utilisateur</span>
        </div>
      </div>

      {userId ? (
        <div className='id__user__show'>
          <p>ID Utilisateur: {userId}</p>
        </div>
      ) : (
        <p>ID utilisateur non trouvé.</p>
      )}
      {isLoading && <p>Chargement des données...</p>}
      {error && <p>Erreur lors de la récupération des données utilisateur: {error.message}</p>}

      {/* Afficher les données de l'utilisateur si elles existent */}
      {userData && userData.data && (
        <div className="user__details">
          <div className='user__info' data-aos="slide-right">
            <h3>Nom: {userData.data.name}</h3>
            <p>Email: {userData.data.email}</p>
            <p>Rôle: {userData.data.role === 1 ? 'Admin' : 'Utilisateur'}</p>
            <p>Statut: {userData.data.status}</p>
          </div>
          <div className="imgs_show" data-aos="fade-up">
            <img className="img_show" src={userData.data.image} alt="User" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowUser;
