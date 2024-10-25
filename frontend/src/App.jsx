
import "./App.scss";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/login/Login';
import Layout from './layout/Layout';
import Dossier from './pages/dossier/Dossier';
import Home from './pages/home/Home';
import Visa from './pages/visa/Visa';
import Archive from './pages/archive/Archive';
import Journal from './pages/journal/Journal';
import User from './pages/user/User';
import Profile from './pages/profile/Profile';
import ArchiveMore from "./pages/archivemore/ArchiveMore";
import { getProfile } from './services/authServices';
import UserPage from "./pages/userpage/UserPage";
import ShowUser from "./pages/showuser/ShowUser";
import { SnackbarProvider } from 'notistack';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  // const [userRole, setUserRole] = useState(null); // Add state for user role



  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
  };

  // Fonction pour gérer l'expiration du token
  const handleTokenExpiration = () => {
    handleLogout(); // Appeler handleLogout pour supprimer les données et déconnecter l'utilisateur
    alert('Votre session a expiré, veuillez vous reconnecter.'); // Optionnel: afficher un message d'alerte
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const userId = localStorage.getItem('userId');
          await getProfile(userId, storedToken); // Essayez de récupérer le profil
          // console.log("Token valide");
        } catch (error) {
          // Vérifiez si l'erreur est liée à l'expiration du token
          if (error.message.includes('Token a expiré')) {
            // console.log("Token a expiré");
            handleTokenExpiration(); // Gérer l'expiration du token
          } else {
            console.error("Erreur lors de la récupération du profil:", error);
            handleLogout(); // Déconnexion en cas d'autres erreurs
          }
        }
      }
    }, 60000); // Vérifier toutes les 1 minute

    return () => clearInterval(intervalId);
  }, []);

  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/accueil" /> : <Login onLogin={() => setIsAuthenticated(true)} />}
          />
          {isAuthenticated && (
            <Route element={<Layout onLogout={handleLogout} />}>
              <Route path="/accueil" element={<Home />} />
              <Route path="/courrier" element={<Dossier />} />
              <Route path="/visa" element={<Visa />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/utilisateur" element={<User />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/archive/details" element={<ArchiveMore />} />
              <Route path="/profile/profile_page" element={<UserPage />} />
              <Route path="/utilisateur/show_user" element={<ShowUser />} />
            </Route>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
