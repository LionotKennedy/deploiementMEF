

// import * as React from 'react';
import React, { useEffect } from 'react';
import "./style/about.scss";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { FaTimes, FaFacebook, FaGithub, FaInstagram, FaEnvelope } from 'react-icons/fa';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { motion } from 'framer-motion'; // Importer motion
import { Fade } from 'react-reveal';
import AOS from 'aos';
import 'aos/dist/aos.css';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

// Définir les animations
const variants = {
    hidden: { opacity: 0, y: -100 }, // État caché
    visible: { opacity: 1, y: 0 },    // État visible
    exit: { opacity: 0, y: 100 },       // État de sortie
};

export default function AboutDialogs({ open, onClose }) {
    const handleClickOpen = () => {
        onClose(false);
    };

    const handleClose = () => {
        onClose(true);
    };

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    return (
        <motion.div initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}>
            <React.Fragment>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title" data-aos="flip-down" data-aos-easing="ease-out-cubic-bezier"
           data-aos-duration="1500" data-aos-delay="300">
                        À propos de l'application
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={(theme) => ({
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: theme.palette.grey[500],
                        })}
                    >
                        <FaTimes />
                    </IconButton>
                    <DialogContent dividers>
                        <Fade top>
                            <Typography gutterBottom>
                                Cette application est un système de gestion des départs de courriers et des archives, spécifiquement conçu pour le ministère de l'Économie et des Finances.
                            </Typography>
                            <Typography gutterBottom>
                                Elle permet de suivre efficacement l'acheminement des courriers, garantissant que chaque document est traité de manière rapide et transparente. Les utilisateurs peuvent enregistrer, classer et archiver les courriers afin d'assurer un accès facile aux informations historiques.
                            </Typography>
                            <Typography gutterBottom>
                                L'application vise à optimiser les processus de gestion des courriers, réduisant ainsi le temps de traitement et augmentant la productivité. Grâce à une interface conviviale, les employés peuvent naviguer facilement dans les différentes fonctionnalités, qu'il s'agisse de créer de nouveaux enregistrements ou de rechercher des archives existantes.
                            </Typography>
                            <Typography gutterBottom>
                                En intégrant des fonctionnalités avancées de recherche et de filtrage, cette application aide les utilisateurs à retrouver rapidement les informations dont ils ont besoin, ce qui est essentiel dans un environnement gouvernemental où la précision et l'efficacité sont primordiales.
                            </Typography>

                        </Fade>
                        <Divider sx={{ my: 2, bgcolor: 'gray' }} />
                        <Box textAlign="center" sx={{ my: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Contact
                            </Typography>
                        </Box>
                        <Fade bottom>

                            <Box display="flex" justifyContent="space-around" sx={{ my: 2 }}>
                                <a href="https://www.facebook.com/kennedy.rog.5" target="_blank" rel="noopener noreferrer" className='scale__facebook'>
                                    <FaFacebook size={24} />
                                </a>
                                <a href="https://github.com/LionotKennedy" target="_blank" rel="noopener noreferrer" className='scale__github'>
                                    <FaGithub size={24} />
                                </a>
                                <a href="mailto:razafimandimbylionotkennedy@gmail.com" target="_blank" rel="noopener noreferrer" className='scale__email'>
                                    <FaEnvelope size={24} />
                                </a>
                                <a href="https://www.instagram.com/kennedyroyrog/" target="_blank" rel="noopener noreferrer" className='scale__instagram'>
                                    <FaInstagram size={24} />
                                </a>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box textAlign="center" sx={{ my: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Développé par : Lionot RAZAFIMANDIMBY
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Année de création : 2024
                                </Typography>
                            </Box>
                        </Fade>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose}>
                            Fermer
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
            </React.Fragment>
        </motion.div>
    );
}
