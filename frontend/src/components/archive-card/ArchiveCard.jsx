
import React from 'react';
import "./archivecard.scss";
import folder from "../../assets/images/folder.png";
import { useNavigate } from 'react-router-dom';

const ArchiveCard = ({ groups }) => {
  const navigate = useNavigate();

  // On ne passe que l'année (ou date) au lieu de toutes les archives
  const handleCardClick = (year) => {
    navigate(`/archive/details`, { state: { year } });
  };

  return (
    <div className='container__cards'> 
      {groups.map((group, index) => (
        <div key={index} className="content_card" onClick={() => handleCardClick(group._id)}>
          <div className="card_details">
            <div className="img_folder">
              <img className="imageFolder" src={folder} alt="image" />
            </div>
            <div className="text">
              <div className="date_archive">{group._id}</div>
              <span>Nombre: {group.archives.length}</span>
            </div>
          </div>
          <div className="job_salary">
            <div className="salaireP">Détails: {group.archives.length} archives</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ArchiveCard;
