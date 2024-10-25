import React, { useEffect } from 'react';
import "./layout.scss";
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SideBar from '../components/sidebar/SideBar';
import TopNav from '../components/topnav/TopNav';
import ThemeAction from '../redux/actions/ThemeAction';

const Layout = ({ onLogout }) => {

  const themeReducer = useSelector(state => state.ThemeReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    const themeClass = localStorage.getItem('themeMode', 'theme-mode-light');
    const colorClass = localStorage.getItem('colorMode', 'theme-mode-light');

    dispatch(ThemeAction.setMode(themeClass));
    dispatch(ThemeAction.setColor(colorClass));
  }, [dispatch]);
  return (
    <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
      <SideBar />
      <div className="layout__content">
        <TopNav onLogout={onLogout} />
        <div className="layout__content-main centered-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
