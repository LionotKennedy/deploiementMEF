
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./sidebar.scss";
import sidebar_items from '../../Data/Sidebar__route.json';
import logo from '../../assets/images/logo.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SidebarItem = props => {
  const active = props.active ? 'active' : '';
  return (
    <div className="sidebar__item">
      <div className={`sidebar__item-inner ${active}`}>
        <i className={props.icon}></i>
        <span>{props.title}</span>
      </div>
    </div>
  );
};

const SideBar = () => {
  const location = useLocation();
  const userRole = parseInt(localStorage.getItem('userRole')) || 0;

  // Filtrer les items en fonction du userRole
  const filteredItems = sidebar_items.filter(item => {
    switch (userRole) {
      case 1: // Administrateur
        return true;
      case 0: // Utilisateur
        return item.route !== '/journal' && item.route !== '/utilisateur';
      default:
        return false;
    }
  });

  // Trouver l'élément actuel
  const activeItem = filteredItems.findIndex(item =>
    location.pathname.startsWith(item.route)
  );

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <div className='sidebar'>
      <div className="sidebar__logo" data-aos="slide-down">
        <div className='content_img'>
          <img className='logo_img' src={logo} alt="company logo" />
        </div>
        <div className='logo__sidebar'>
          <span>DEPART-SRSP</span>
        </div>
      </div>

      {/* Afficher les items filtrés en fonction du userRole */}
      {filteredItems.map((item, index) => (
        <Link to={item.route} key={index}>
          <SidebarItem
            title={item.display_name}
            icon={item.icon}
            active={index === activeItem}
          />
        </Link>
      ))}
    </div>
  );
};

export default SideBar;
