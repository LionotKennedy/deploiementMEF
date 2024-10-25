
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './userpage.scss';
import { useGetUserById } from '../../services/serviceUser';
import { useUpdateUser, useUpdateUserEmailName } from '../../services/serviceUser';
import { FaArrowLeft } from 'react-icons/fa';
import { FaRegFileImage } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import { AiOutlineClose } from 'react-icons/ai';
import IconButton from '@mui/material/IconButton';
import 'aos/dist/aos.css';

const UserPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state?.userId;
    const { mutate: updateUser } = useUpdateUser();
    const { mutate: updateEmailName } = useUpdateUserEmailName();
    const { enqueueSnackbar } = useSnackbar();

    const { data: userData, error, isLoading } = useGetUserById(userId);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        image: null
    });

    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (userData && userData.data) {
            setFormData({
                name: userData.data.name || '',
                email: userData.data.email || '',
                image: userData.data.image || null // Conservez l'image si elle existe
            });

            setImagePreview(userData.data.image); // Prévisualisation de l'image actuelle
            // console.log("image from input", userData.data.image); // Prévisualisation de l'image actuelle
        
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData({ ...formData, image: files[0] });
            setImagePreview(URL.createObjectURL(files[0])); // Prévisualiser la nouvelle image
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let updateData = { ...formData };
    
        if (updateData.image == imagePreview) {
            // console.log("image old")
            const name = updateData.name
            const email = updateData.email
                try {
            // Lancer la mise à jour de l'utilisateur ici
            await updateEmailName({ userId, name: name, email: email  }, {
                onSuccess: () => {
                    setFormData({ name: '', email: '', image: null });
                    setImagePreview('');
                    navigate('/profile');
                    enqueueSnackbar('Utilisateur mis à jour avec succès', {
                        variant: 'success',
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'center',
                        },
                        autoHideDuration: 5000,
                        action: (
                            <IconButton size="small" onClick={() => { }}>
                                <AiOutlineClose fontSize="small" />
                            </IconButton>
                        ),
                        style: {
                            backgroundColor: '#4caf50',
                            color: '#ffffff',
                        },
                    });
                },
                onError: (error) => {
                    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error.message);
                    enqueueSnackbar('Erreur lors de la mise à jour du profil', {
                        variant: 'error',
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'center',
                        },
                        autoHideDuration: 5000,
                    });
                }
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
            enqueueSnackbar('Erreur lors de la mise à jour du profil', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 5000,
            });
        }
        }
        else {
            // console.log("update image")
            // console.log(updateData)
            try {
            // Lancer la mise à jour de l'utilisateur ici
            await updateUser({ userId, data: updateData }, {
                onSuccess: () => {
                    setFormData({ name: '', email: '', image: null });
                    setImagePreview('');
                    navigate('/profile');
                    enqueueSnackbar('Utilisateur mis à jour avec succès', {
                        variant: 'success',
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'center',
                        },
                        autoHideDuration: 5000,
                        action: (
                            <IconButton size="small" onClick={() => { }}>
                                <AiOutlineClose fontSize="small" />
                            </IconButton>
                        ),
                        style: {
                            backgroundColor: '#4caf50',
                            color: '#ffffff',
                        },
                    });
                },
                onError: (error) => {
                    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error.message);
                    enqueueSnackbar('Erreur lors de la mise à jour du profil', {
                        variant: 'error',
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'center',
                        },
                        autoHideDuration: 5000,
                    });
                }
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
            enqueueSnackbar('Erreur lors de la mise à jour du profil', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 5000,
            });
        }
        }  
    };

    const handleBackClick = () => {
        navigate('/profile');
    };

    return (
        <div className='container__users'>
            <div className='content__headers'>
                <div className='icon__back' data-aos="slide-right">
                    <FaArrowLeft
                        className='back__icon'
                        onClick={handleBackClick}
                        size={44}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <div className='title__profile' data-aos="fade-down">
                    <span>Modification du profile</span>
                </div>
                {userId ? (
                    <div className='id__import'>
                        <p>ID Utilisateur: {userId}</p>
                    </div>
                ) : (
                    <p>ID utilisateur non trouvé.</p>
                )}
                {isLoading && <p>Chargement des données...</p>}
                {error && <p>Erreur lors de la récupération des données utilisateur: {error.message}</p>}
            </div>

            <form onSubmit={handleSubmit} className="user-form" encType="multipart/form-data">
                <div className='container__form'>
                    <div className='image___recive' data-aos="slide-right">
                        {imagePreview && <img src={imagePreview} alt="Prévisualisation" className="image-preview" />} {/* Affiche l'image prévisualisée */}
                    </div>
                    <div className='content__form' data-aos="flip-up">
                        <div className="form-group">
                            <label htmlFor="name">Nom:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nom d'utilisateur"
                                required
                            />
                        </div>
                        <div className="form-group" data-aos="flip-up">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder='Adresse email'
                                required
                            />
                        </div>
                        <div className="form-group content__input" data-aos="flip-up">
                            <label htmlFor="image">
                                Image : <FaRegFileImage className="icon" />
                            </label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                onChange={handleChange}
                                style={{ display: "none" }}
                            />
                        </div>
                        <div className='btn__update__profile' data-aos="flip-up">
                            <button type="submit" className="submit-button">Enregistrer</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default UserPage;

