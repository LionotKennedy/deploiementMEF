// Card.js
import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './card.scss'; // Importer le fichier CSS

const Card = ({ title, percentage }) => {
    return (
        <div className="card__proges">
            <h3 className="card-title__proges">{title}</h3>
            <div className="progress-container__proges">
                <CircularProgressbar
                    value={percentage}
                    text={`${percentage}%`}
                />
            </div>
            <p className="card-description__proges">
                Pourcentage d'achèvement.
            </p>
        </div>
    );
};

export default Card;
