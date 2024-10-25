
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
import { useGetArchiveById } from '../../services/serviceArchive';
import { motion } from 'framer-motion';
import { Fade } from 'react-reveal';
import imageLogo from "../../assets/images/ministere.png";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(4), // Augmentation du padding pour plus d'espace
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(2),
    },
    '& .MuiPaper-root': {
        minWidth: '600px',
        minHeight: '400px',
    },

    '& .custom-text': {
        textAlign: 'center',
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


export default function ArchiveDialogs({ open, setOpen, folderId }) {
    const handleClose = () => {
        setOpen(false);
    };

    // Récupération des données du dossier par ID
    const { data: folderData, isLoading, error } = useGetArchiveById(folderId);

    // Gestion des états de chargement et des erreurs
    if (isLoading) {
        return <div className='visibleNo'>Chargement...</div>;
    }

    if (error) {
        return <div className='visibleNo'>Erreur lors de la récupération des données.</div>;
    }

    // Récupération des données du dossier
    const folder = folderData?.data;

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
                                <Typography variant="h6">Informations du archive</Typography>
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
                                <strong>Numéro de bordereau:</strong> {folder?.numero_bordereaux}
                            </Typography>
                            <Typography className="custom-text" gutterBottom>
                                <strong>Date de départ: </strong>
                                {/* {new Date(folder?.date_depart).toLocaleDateString()} */}
                                {(() => {
                                    const date = new Date(folder.date_depart);
                                    const year = date.getFullYear();
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const day = String(date.getDate() + 1).padStart(2, '0');
                                    return `${day}/${month}/${year}`;
                                })()}
                            </Typography>
                            <Typography className="custom-text" gutterBottom>
                                <strong>Expéditeur:</strong> {folder?.expiditeur}
                            </Typography>
                            <Typography className="custom-text" gutterBottom>
                                <strong>Destination:</strong> {folder?.destination}
                            </Typography>
                            <Typography className="custom-text" gutterBottom>
                                <strong>Description:</strong> {folder?.description}
                            </Typography>
                            <Typography className="custom-text" gutterBottom>
                                <strong>Nom déposé:</strong> {folder?.nom_depose}
                            </Typography>
                            <Typography className="custom-text" gutterBottom>
                                <strong>Prénom déposé:</strong> {folder?.prenom_depose}
                            </Typography>
                            <Typography className="custom-text" gutterBottom>
                                <strong>Matricule:</strong> {folder?.matricule}
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
