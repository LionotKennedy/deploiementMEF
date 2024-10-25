
import React, { useEffect, useState } from 'react';
import "./profilecard.scss";
import { getProfile } from '../../services/authServices'; 
import FullScreenDialog from '../MUI/ProfileModal'; 
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ProfileCard = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [imageOpen, setImageOpen] = useState(false);
    const [closing, setClosing] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (token && userId) {
            fetchProfileData(userId, token);
        } else {
            setError("Utilisateur non trouvé. Veuillez vous reconnecter.");
        }
        
        AOS.init();
    }, []);

    const fetchProfileData = async (userId, token) => {
        try {
            const profileData = await getProfile(userId, token);
            // console.log('Données du profil:', profileData);
            setUserData(profileData);  
        } catch (error) {
            setError(error.message);
        }
    };

    const handleOpenDialog = (userId) => {
        setSelectedFolderId(userId);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setImageOpen(true);
    };

    const handleCloseImage = () => {
        setClosing(true);
        setTimeout(() => {
            setImageOpen(false);
            setClosing(false);
            setSelectedImage('');
        }, 300);
    };

    const handleSubscribeClick = () => {
        if (userData) {
            const userId = userData.data._id; 
            navigate('/profile/profile_page', { state: { userId } });
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        return <div>Chargement...</div>;
    }

    const { name, email, image } = userData.data;

    return (
        <div className="container__profile">
            <div className="profile__card" data-aos="flip-right">
                <div className="image__profile">
                    <img
                        src={getImageUrl(image)}
                        alt="Profile Image"
                        className="profile__img"
                        onClick={() => handleImageClick(getImageUrl(image))}
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                <div className="text__data">
                    <span className="name">{name}</span>
                    <span className="job">{email}</span>
                </div>

                <div className="media__buttons">
                    <a href="#" className="link facebook"></a>
                    <a href="#" className="link twitter"></a>
                    <a href="#" className="link instagram"></a>
                    <a href="#" className="link youtube"></a>
                </div>

                <div className="buttons">
                    <button className="button__btn" onClick={handleSubscribeClick}>
                    Modification du profil
                    </button>
                    <button className="button__btn" onClick={() => handleOpenDialog(userData.data._id)}>
                    Modifier mot de passe
                    </button>
                </div>

                <div className="analytics">
                    <div className="data">
                        <i className="bx bx-heart"></i>
                        <span className="number"></span>
                    </div>
                    <div className="data">
                        <i className="bx bx-message-rounded"></i>
                        <span className="number"></span>
                    </div>
                    <div className="data">
                        <i className="bx bx-share"></i>
                        <span className="number"></span>
                    </div>
                </div>
            </div>
            
            <FullScreenDialog open={dialogOpen} handleClose={handleCloseDialog} userId={selectedFolderId} />
            
            {imageOpen && (
                <div 
                    className={`image-modal ${closing ? 'closing' : ''}`} 
                    onClick={handleCloseImage} 
                    data-aos="flip-up" 
                    data-aos-duration="400"
                >
                    <img src={selectedImage} alt="Agrandir" className="modal-image" />
                </div>
            )}
        </div>
    );
};

const getImageUrl = (image) => {
    if (image.startsWith('uploads_default')) {
        return `http://127.0.0.1:9876/uploads/${image}`;
    } else {
        return `http://127.0.0.1:9876${image}`;
    }
};

export default ProfileCard;
