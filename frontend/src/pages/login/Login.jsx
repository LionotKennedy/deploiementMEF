
import React, { useState, useEffect } from 'react';
import { MdLock } from 'react-icons/md';
import { RiUserFill, RiLockFill } from 'react-icons/ri';
import { AiOutlineMail } from 'react-icons/ai';
import { FaCheckCircle } from 'react-icons/fa';
import "./login.scss";
import Loading from '../../components/Loading/Loading';
import { useLogin, usePasswordReset, useNewPasswordVerification } from '../../services/authServices'; // Importer la fonction de login
import { getProfile } from '../../services/authServices'; // Importez le service
import AOS from 'aos';
import 'aos/dist/aos.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState(''); // Changed setUsername to setEmail
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [emailError, setEmailError] = useState(false); // State to track email error
    const [passwordError, setPasswordError] = useState(false); // State to track password error
    const loginMutation = useLogin(email, password);
    const passwordResetMutation = usePasswordReset(); // Hook for password reset
    const newPasswordVerifyMutation = useNewPasswordVerification(); // Hook for password reset
    const [loadingReset, setLoadingReset] = useState(false); // État pour le chargement de la réinitialisation



    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        AOS.init({
            duration: 1000, 
        });
    }, []);


    // Reset password handler
    const handleLogin = async () => {
        setLoading(true);
        setMessage('');
        setEmailError(false);
        setPasswordError(false);

        if (!email) {
            setMessage('Veuillez entrer votre adresse email.');
            if (!email) setEmailError(true);
            setLoading(false);
            return;
        }
        else if (!password) {
            setMessage('Veuillez entrer votre mot de passe.');
            if (!password) setPasswordError(true);
            setLoading(false);
            return;
        };

        try {
            const result = await loginMutation.mutateAsync({ email, password });

            if (result.success) {
                const userStatus = result.data.status;
                const userRole = result.data.role; // Assurez-vous que le rôle est présent dans les données renvoyées
                // console.log('User status:', userStatus);
                // console.log('User role:', userRole); // Ajoutez ceci pour afficher le rôle dans la console
                const userId = result.data._id;

                // Affichez un message en fonction du rôle
                if (userRole === 1) {
                    // console.log('Bienvenue, administrateur !');
                } else if (userRole === 0) {
                    // console.log('Bienvenue, utilisateur !');
                } else {
                    // console.log('Rôle inconnu.');
                }

                // Vérifiez le statut de l'utilisateur
                if (userStatus === 'active') {
                    localStorage.setItem('token', result.accessToken);
                    localStorage.setItem('userId', userId);
                    localStorage.setItem('userRole', userRole);
                    const userData = await getProfile(userId, result.accessToken);
                    // console.log("Données utilisateur après connexion:", userData);
                    onLogin(userData, userRole);
                    // onLogin(result.data);
                    // console.log("Données utilisateur stockées :", result.data);
                    // console.log("Id :", userId);
                } else {
                    setMessage('Votre compte est désactivé. Veuillez contacter le support.');
                }
            } else {
                setMessage(result.message || 'Connexion échouée. Veuillez vérifier vos identifiants.');
            }
        } catch (error) {
            // console.error('Erreur lors de la connexion:', error);
            setMessage('Une erreur s\'est produite. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendResetCode = async () => {
        setMessage('');
        if (!email) {
            setMessage('Veuillez entrer votre adresse email.');
            return;
        }
        setLoadingReset(true); // Active le chargement
        try {
            const result = await passwordResetMutation.mutateAsync({ email });
            if (result.success) {
                setMessage('Un code de vérification a été envoyé à votre adresse email.');
                setForgotPassword('verify'); // Move to verification step
            } else {
                setMessage(result.message || 'Erreur lors de l\'envoi du code.');
            }
        } catch (error) {
            // console.error('Erreur lors de l\'envoi du code:', error);
            setMessage('Une erreur s\'est produite. Veuillez réessayer.');
        }
        finally {
            setLoadingReset(false); // Désactive le chargement
        }
    };

    const handleVerifyCode = async () => {
        setMessage('');
        if (!verificationCode || !newPassword) {
            setMessage('Veuillez remplir tous les champs.');
            return;
        }
        try {
            const result = await newPasswordVerifyMutation.mutateAsync({
                token: verificationCode,
                newPassword
            });
            if (result.success) {
                setMessage('Votre mot de passe a été mis à jour avec succès.');
                setForgotPasswordMode(false);
            } else {
                setMessage(result.message || 'Erreur lors de la mise à jour du mot de passe.');
            }
        } catch (error) {
            // console.error('Erreur lors de la mise à jour du mot de passe:', error);
            setMessage('Une erreur s\'est produite. Veuillez réessayer.');
        }
    };

    if (loading || loadingReset) {
        return <Loading />; // Affiche le composant de chargement
    }

    return (
        <div className='pages__login'>
            <div className="container animatex" data-aos="flip-up">
                <div className="design">
                    <div className="pill-1 rotate-45"></div>
                    <div className="pill-2 rotate-45"></div>
                    <div className="pill-3 rotate-45"></div>
                    <div className="pill-4 rotate-45"></div>
                </div>
                <div className="login">
                    {forgotPassword === 'verify' ? (
                        <>
                            <FaCheckCircle size={60} className='react__icons icon__header' data-aos="fade-down" />
                            <h3 className="title__auth">Vérifier le code</h3>
                            <div className="text-input">
                                <input
                                    type="text"
                                    placeholder="Entrez le code de vérification"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>
                            <div className="text-input">
                                <input
                                    type="password"
                                    placeholder="Entrez un nouveau mot de passe"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>
                            <button  data-aos="fade-up" className="login-btn" onClick={handleVerifyCode}>Valider</button>
                            {message && <p className="message">{message}</p>}
                            <a className="forgot text_login" onClick={() => { setForgotPasswordMode(false); setForgotPassword(''); }}>Back to Login</a>
                            {/* {message && <p className="error-message">{message}</p>} */}
                        </>
                    ) : forgotPassword ? (
                        <>

                            <AiOutlineMail size={60} className='react__icons icon__header' data-aos="fade-down" />
                            <h3 className="title__auth"><div data-aos="fade-up"> Mot de passe oublié</div></h3>
                            <div className="text-input">
                                <AiOutlineMail className='react__icons' data-aos="fade-right" />
                                <input
                                    type="text"
                                    placeholder="Entrez votre adresse e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>
                            <button  data-aos="fade-up" className="login-btn" onClick={handleSendResetCode}>Envoyer le lien de réinitialisation</button>
                            <a className="forgot text_login" onClick={() => setForgotPassword(false)}>Retour à la page de connexion</a>
                            {message && <p className="error-message">{message}</p>} {/* Error message display */}
                        </>
                    ) : (
                        <>
                            <MdLock size={60} className='react__icons icon__header' data-aos="fade-down" />
                            <h3 className="title__auth"><div data-aos="fade-up">Se connecter </div></h3>
                            <div className="text-input" style={{ border: emailError ? '2px solid red' : '' }}>
                                <RiUserFill className='react__icons' data-aos="fade-right" />
                                <input
                                    type="text"
                                    placeholder="Adresse mail"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailError(false); // Clear error on input change
                                    }}
                                    autoComplete="off"
                                />
                            </div>
                            <div className="text-input" style={{ border: passwordError ? '2px solid red' : '' }}>
                                <RiLockFill className='react__icons'data-aos="fade-left" />
                                <input
                                    type="password"
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setPasswordError(false); // Clear error on input change
                                    }}
                                    autoComplete="off"
                                />
                            </div>
                            <button  data-aos="fade-up" className="login-btn" onClick={handleLogin}>CONNEXION</button>
                            <a className="forgot text_login" onClick={() => setForgotPassword(true)}>Mot de passe oublié ?</a>
                            {message && <p className="error-message">{message}</p>} 
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
