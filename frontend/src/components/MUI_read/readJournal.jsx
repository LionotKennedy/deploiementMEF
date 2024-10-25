
import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { FaTimes } from 'react-icons/fa';
import { useGetJournalById } from '../../services/serviceJournal';
import { motion } from 'framer-motion';
import { Fade } from 'react-reveal';
import imageLogo from "../../assets/images/ministere.png";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(3), // Augmentation du padding pour plus d'espace
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(2),
    },
    '& .MuiPaper-root': { // Customisation de la taille du modal
        minWidth: '600px', // Largeur minimale du modal
        minHeight: '400px', // Hauteur minimale du modal
    },
    '& .custom-text': {
        // textAlign: 'center', 
        fontSize: '1.2rem', 
        lineHeight: '1.6', 
    },
}));

const LogoHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(2), // Ajoute un espacement en bas
}));

export default function JournalDialogs({ open, setOpen, id }) {
    const handleClose = () => {
        setOpen(false);
    };

    // Récupération des données du dossier par ID
    const { data: folderData, isLoading, error } = useGetJournalById(id);

    // Gestion des états de chargement et des erreurs
    if (isLoading) {
        return <div className='visibleNo'>Chargement...</div>;
    }

    if (error) {
        return <div className='visibleNo'>Erreur lors de la récupération des données.</div>;
    }

    // Récupération des données du dossier
    const folder = folderData?.data;
    console.log(folder);

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
                    <DialogTitle sx={{ m: 0, p: 3 }} id="customized-dialog-title">
                        <LogoHeader>
                            <Fade top>
                                {/* Ajoutez votre logo ici */}
                                <img src={imageLogo} alt="Logo" style={{ width: '100px', height: 'auto' }} />
                                {/* <img src={imageData} alt="Logo" style={{ width: '100px', height: 'auto' }} /> */}
                                <Typography variant="h6">Informations du journeaux</Typography>
                            </Fade>
                        </LogoHeader>
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
                        {/* Affichage des données du dossier */}
                        <Fade bottom>
                            <Typography className="custom-text" gutterBottom>
                                <strong>Action : </strong> {folder?.action}
                            </Typography>
                            <Typography className="custom-text" gutterBottom>
                                <strong>Date de creation : </strong> {new Date(folder?.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography className="custom-text" gutterBottom>
                                <strong>Details : </strong> {folder?.details}
                            </Typography>
                            <Typography className="custom-text" gutterBottom>
                                <strong>Nom : </strong> {folder?.userName}
                            </Typography>
                            <Typography className="custom-text" gutterBottom>
                                <strong>Adresse Email : </strong> {folder?.adressEmail}
                            </Typography>
                            <Typography className="custom-text" gutterBottom>
                                {/* <strong>Phote de profile:</strong> <img className='imge' src={`http://127.0.0.1:9876${folder?.imageJournale}`} /> */}
                            </Typography>
                            <Typography className="custom-text" gutterBottom>
                                {/* <strong>Prénom déposé:</strong> {folder?.prenom_depose} */}
                            </Typography>
                            <Typography className="custom-text" gutterBottom>
                                {/* <strong>Matricule:</strong> {folder?.matricule} */}
                            </Typography>
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
