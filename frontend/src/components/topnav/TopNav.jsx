
import React, { useEffect, useState } from 'react';
import "./topnav.scss";
import { Link, useNavigate } from 'react-router-dom';
import Dropdown from '../dropdown/Dropdown';
import user_image from '../../assets/images/photo.jpg';
import user_menu from '../../Data/user_menus.json';
import Theme from '../theme/Theme';
import { logout, getProfile } from '../../services/authServices';
import AboutDialogs from '../MUI/AboutModal';
import { FaExclamationTriangle } from 'react-icons/fa';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
// CONFIGURATION
const curr_user = {
  display_name: 'Lionot',
  image: user_image
}

const TopNav = ({ onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openAboutDialog, setOpenAboutDialog] = useState(false); // État pour le dialogue About
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      fetchProfileData(userId, token);
    } else {
      setError("Utilisateur non trouvé. Veuillez vous reconnecter.");
    }
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  const fetchProfileData = async (userId, token) => {
    try {
      const profileData = await getProfile(userId, token);
      setUserData(profileData.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmLogout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const result = await logout(token);
      if (result.success) {
        onLogout();
        navigate('/', { replace: true });
      } else {
        console.error('Erreur de déconnexion:', result.message);
      }
    }
    handleCloseDialog();
  };

  const handleAboutClick = () => {
    setOpenAboutDialog(true); // Ouvre le dialogue About
  };

  const renderUserToggle = (user) => (
    <div className="topnav__right-user">
      <div className="topnav__right-user__image">
        <img src={user.image} alt="User" />
      </div>
      <div className="topnav__right-user__name">
        {user.display_name}
      </div>
    </div>
  );

  const getUserImageSrc = (image) => {
    if (image.startsWith('uploads_default')) {
      return `http://127.0.0.1:9876/uploads/${image}`;
    } else {
      return `http://127.0.0.1:9876${image}`;
    }
  };

  const userToggleContent = userData
    ? { display_name: userData.name, image: getUserImageSrc(userData.image) }
    : { display_name: 'Chargement...', image: user_image };

  const renderUserMenu = (item, index) => {
    if (item.content === "Sortie") {
      return (
        <div className="notification-item" key={index} onClick={handleOpenDialog}>
          <i className={item.icon}></i>
          <span>{item.content}</span>
        </div>
      );
    }
    if (item.content === "À propos") {
      return (
        <div className="notification-item" key={index} onClick={handleAboutClick}>
          <i className={item.icon}></i>
          <span>{item.content}</span>
        </div>
      );
    }

    return (
      <Link to={item.route || '#'} key={index}>
        <div className="notification-item">
          <i className={item.icon}></i>
          <span>{item.content}</span>
        </div>
      </Link>
    );
  };
  const [sidebarActive, setSidebarActive] = useState(false);
  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
    document.querySelector('.sidebar').classList.toggle('actif');
    document.querySelector('.topnav').classList.toggle('actif');
    document.querySelector('.layout__content').classList.toggle('actif');
  };

  return (
    <div className='topnav'>
      <div className='content__name__app' data-aos="fade-right">
        {/* <span>D</span>
        <span>E</span>
        <span>P</span>
        <span>A</span>
        <span>R</span>
        <span>T</span>
        <span>-</span>
        <span>S</span>
        <span>R</span>
        <span>S</span>
        <span>P</span> */}
        <span>Ministère de l'Économie et des Finances</span>
      </div>
      {/* Dialog About */}
      <AboutDialogs open={openAboutDialog} onClose={() => setOpenAboutDialog(false)} />
      <div className="topnav__right">
        <div className="topnav__right-item">
          <Dropdown
            customToggle={() => renderUserToggle(userToggleContent)}
            contentData={user_menu}
            renderItems={(item, index) => renderUserMenu(item, index)}
          />
        </div>

        <div className="topnav__right-item">
          <Theme />
        </div>
        <div className="topnav__right-item mobile-hamburger" onClick={toggleSidebar}>
          <i className={sidebarActive ? 'bx bx-x' : 'bx bx-menu'}></i>
        </div>
      </div>

      {/* Dialog de confirmation */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle style={{ display: 'flex', alignItems: 'center' }}>
          <FaExclamationTriangle style={{ color: 'orange', marginRight: '10px' }} />
          {"Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir vous déconnecter ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirmLogout} style={{ color: 'red' }}>
            Déconnexion
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}

export default TopNav;
