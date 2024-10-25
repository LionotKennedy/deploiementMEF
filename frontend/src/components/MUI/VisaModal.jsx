
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide, TextField, Grid, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAddVisa, useGetVisaById, useUpdateVisa } from '../../services/serviceVisa';
import { useSnackbar } from 'notistack';
import { AiOutlineClose } from 'react-icons/ai';
import IconButton from '@mui/material/IconButton'; // Assure-toi d'importer IconButton
import "./style/visaModal.scss";
import "../../assets/style/index.css"

const modalVariants = {
  hidden: { opacity: 0, scale: 0.1 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.1 }
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VisaModal({ open, handleClose, folderId, mode, onSuccess }) {
  const [fields, setFields] = useState({
    numero_visa: '',
    nom_depose_visa: '',
    prenom_depose_visa: '',
    reference: '',
  });

  const [error, setError] = useState('');
  const addVisaMutation = useAddVisa();
  const [fieldErrors, setFieldErrors] = useState({}); // Gérer les erreurs spécifiques des champs
  const { data: folderData } = useGetVisaById(folderId);
  const updateVisaMutation = useUpdateVisa();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (folderData && folderData.data) {
      //   const formattedDateDepart = new Date(folderData.data.date_depart).toISOString().split('T')[0];
      setFields(prevFields => ({
        ...prevFields,
        numero_visa: folderData.data.numero_visa || '',
        nom_depose_visa: folderData.data.nom_depose_visa || '',
        prenom_depose_visa: folderData.data.prenom_depose_visa || '',
        reference: folderData.data.reference || '',
      }));
    }

    // console.log(folderData);
  }, [folderData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields(prevFields => ({ ...prevFields, [name]: value }));
  };

  const handleSubmit = async () => {

    let hasError = false;
    let errors = {};

    if (!fields.numero_visa) {
      errors.numero_visa = true;
      hasError = true;
    }
    if (!fields.nom_depose_visa) {
      errors.nom_depose_visa = true;
      hasError = true;
    }
    if (!fields.prenom_depose_visa) {
      errors.prenom_depose_visa = true;
      hasError = true;
    }
    if (!fields.reference) {
      errors.reference = true;
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(errors); // Définir les erreurs dans l'état
      setError('Veuillez remplir tous les champs requis.');
      enqueueSnackbar('Veuillez remplir tous les champs requis.', { variant: 'error' });
      return;
    }

    // Vous pouvez formater à nouveau la date ici si nécessaire
    const formattedFields = {
      ...fields,
      //   date_depart: new Date(fields.date_depart).toISOString(), // Par exemple, si le backend attend un format ISO
    };
    // console.log(formattedFields)
    try {
      if (mode === 'edit') {
        await updateVisaMutation.mutateAsync({ folderId, data: formattedFields }); // Utiliser la mutation pour mettre à jour
        // console.log('Dossier mis à jour avec succès');
        // console.log('Modification d\'un dossier');
        enqueueSnackbar('Le visa a été modifié avec succès', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          autoHideDuration: 5000,
          action: (
            <IconButton size="small" onClick={() => { }}>
              <AiOutlineClose fontSize="small" />  {/* Utilisation de AiOutlineClose ici */}
            </IconButton>
          ),
          style: {
            backgroundColor: '#4caf50',
            color: '#ffffff',
          },
        });
      } else {
        await addVisaMutation.mutateAsync(formattedFields);
        enqueueSnackbar('Le visa a été ajouté avec succès', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          autoHideDuration: 5000,
          action: (
            <IconButton size="small" onClick={() => { }}>
              <AiOutlineClose fontSize="small" />  {/* Utilisation de AiOutlineClose ici */}
            </IconButton>
          ),
          style: {
            backgroundColor: '#4caf50',
            color: '#ffffff',
          },
        });
      }
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      setError('Une erreur est survenue lors de l\'ajout/modification du dossier.');
    }


  };



  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="custom-modal-slide-reference"
      maxWidth="sm"
      fullWidth
    >
      <AnimatePresence>
        {open && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            {/* <DialogTitle>Formulaire Ajout Dossier</DialogTitle> */}
            <DialogTitle>
              <Typography variant="p" component="div" color="primary.main" className='header__text'>
                {mode === 'add' ? 'Formulaire Ajout Visa' : 'Modifier Visa'}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <form>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="numero_visa"
                      label="Numéro visa"
                      variant="standard"
                      fullWidth
                      value={fields.numero_visa}
                      onChange={handleChange}
                      type='number'
                      error={!!fieldErrors.numero_visa || !!error}
                      helperText={fieldErrors.numero_visa ? 'Ce champ est requis' : error ? 'Le numéro est existe déjà' : ''}
                      InputProps={{
                        style: fieldErrors.numero_visa ? { borderColor: 'red' } : error ? { borderColor: 'red' } : {},
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="nom_depose_visa"
                      label="Nom"
                      variant="standard"
                      fullWidth
                      value={fields.nom_depose_visa}
                      onChange={handleChange}
                      error={!!fieldErrors.nom_depose_visa}
                      helperText={fieldErrors.nom_depose_visa ? 'Ce champ est requis' : ''}
                      InputProps={{
                        style: fieldErrors.nom_depose_visa ? { borderColor: 'red' } : {},
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="prenom_depose_visa"
                      label="Prenom"
                      variant="standard"
                      fullWidth
                      value={fields.prenom_depose_visa}
                      onChange={handleChange}
                      error={!!fieldErrors.prenom_depose_visa}
                      helperText={fieldErrors.prenom_depose_visa ? 'Ce champ est requis' : ''}
                      InputProps={{
                        style: fieldErrors.prenom_depose_visa ? { borderColor: 'red' } : {},
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="reference"
                      label="Reference"
                      variant="standard"
                      fullWidth
                      value={fields.reference}
                      onChange={handleChange}
                      error={!!fieldErrors.reference}
                      helperText={fieldErrors.reference ? 'Ce champ est requis' : ''}
                      InputProps={{
                        style: fieldErrors.reference ? { borderColor: 'red' } : {},
                      }}
                    />
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                size="medium"
                fullWidth
                className='btn__modal__visa__fermer'
              >
                Fermer
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                // color="primary"
                size="medium"
                fullWidth
                className='btn__modal__visa'
              >
                {mode === 'add' ? 'Confirmer' : 'Modifier'}
              </Button>
            </DialogActions>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
