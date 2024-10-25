
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
import { useGetVisaById } from '../../services/serviceVisa';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
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
  // Ajoutez un style pour centrer le texte
  '& .custom-text': {
    textAlign: 'center', // Centre le texte
    fontSize: '1.2rem', // Augmente la taille de la police
    lineHeight: '1.6', // Augmente l'espace entre les lignes
  },
}));

const modalVariants = {
  hidden: { opacity: 0, y: "-100vh" },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: "100vh" },
};
// Ajout d'un style pour l'en-tête
const LogoHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(2), // Ajoute un espacement en bas
}));


export default function CustomizedVisaDialogs({ open, setOpen, folderId }) {
  const handleClose = () => {
    setOpen(false);
  };

  // Récupération des données du dossier par ID
  const { data: folderData, isLoading, error } = useGetVisaById(folderId);

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
                <img src={imageLogo} alt="Logo" style={{ width: '100px', height: 'auto' }} />
                {/* <img src={imageData} alt="Logo" style={{ width: '100px', height: 'auto' }} /> */}
                <Typography variant="h6">Informations du visa</Typography>
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
                <strong>Numéro de visa:</strong> {folder?.numero_visa || 'N/A'}
              </Typography>
              <Typography className="custom-text" gutterBottom>
                <strong>Nom:</strong> {folder?.nom_depose_visa || 'N/A'}
              </Typography>
              <Typography className="custom-text" gutterBottom>
                <strong>Prenom:</strong> {folder?.prenom_depose_visa || 'N/A'}
              </Typography>
              <Typography className="custom-text" gutterBottom>
                <strong>Reference:</strong> {folder?.reference || 'N/A'}
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
