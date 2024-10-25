
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Slide, TextField, Grid, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAddArchive, useGetArchiveById, useUpdateArchive } from '../../services/serviceArchive';
import { useSnackbar } from 'notistack';
import { AiOutlineClose } from 'react-icons/ai';
import IconButton from '@mui/material/IconButton'; // Assure-toi d'importer IconButton

const modalVariants = {
  hidden: { opacity: 0, scale: 0.1 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.1 }
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ArchiveModal({ open, handleClose, folderId, mode, onSuccess }) {
  const [fields, setFields] = useState({
    numero_bordereaux: '',
    date_depart: '',
    expiditeur: '',
    destination: '',
    description: '',
    nom_depose: '',
    prenom_depose: '',
    matricule: '',
  });

  const [error, setError] = useState('');
  const addArchiveMutation = useAddArchive();
  const [fieldErrors, setFieldErrors] = useState({}); // Gérer les erreurs spécifiques des champs
  const { data: folderData } = useGetArchiveById(folderId);
  const updateArchiveMutation = useUpdateArchive(); // Hook pour mettre à jour un dossier
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {

    if (folderData && folderData.data) {
      const formattedDateDepart = new Date(folderData.data.date_depart).toISOString().split('T')[0];
      setFields(prevFields => ({
        ...prevFields,
        numero_bordereaux: folderData.data.numero_bordereaux || '',
        // date_depart: folderData.data.date_depart || '',
        date_depart: formattedDateDepart || '', // Formater ici
        expiditeur: folderData.data.expiditeur || '',
        destination: folderData.data.destination || '',
        description: folderData.data.description || '',
        nom_depose: folderData.data.nom_depose || '',
        prenom_depose: folderData.data.prenom_depose || '',
        matricule: folderData.data.matricule || '',
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

    // Validation des champs requis
    if (!fields.numero_bordereaux) {
      errors.numero_bordereaux = true;
      hasError = true;
      // enqueueSnackbar(error, { variant: 'error' });
    }
    if (!fields.date_depart) {
      errors.date_depart = true;
      hasError = true;
    }
    if (!fields.expiditeur) {
      errors.expiditeur = true;
      hasError = true;
    }
    if (!fields.destination) {
      errors.destination = true;
      hasError = true;
    }
    if (!fields.description) {
      errors.description = true;
      hasError = true;
    }
    if (!fields.nom_depose) {
      errors.nom_depose = true;
      hasError = true;
    }
    if (!fields.prenom_depose) {
      errors.prenom_depose = true;
      hasError = true;
    }
    if (!fields.matricule) {
      errors.matricule = true;
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
      date_depart: new Date(fields.date_depart).toISOString(), // Par exemple, si le backend attend un format ISO
    };

    try {
      if (mode === 'edit') {
        await updateArchiveMutation.mutateAsync({ folderId, data: formattedFields }); // Utiliser la mutation pour mettre à jour
        // console.log('Archive mis à jour avec succès');
        // console.log('Modification d\'un archive');
        enqueueSnackbar(' Le archive a été modifié avec succès', {
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
        await addArchiveMutation.mutateAsync(formattedFields);
        enqueueSnackbar('Le archive a été ajouté avec succès', {
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
      // onSuccess();
      onSuccess();
      handleClose();
      // console.log(onSuccess);
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
      aria-labelledby="custom-modal-slide-description"
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
            <DialogTitle>
              <Typography variant="p" component="div" color="primary.main" className='header__text'>
                {mode === 'add' ? 'Formulaire Ajout Archive' : 'Modifier archive'}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <form>
                {error && (
                  <Typography color="error" variant="body2" gutterBottom>
                    {error}
                  </Typography>
                )}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="numero_bordereaux"
                      label="Numéro Bordereaux"
                      variant="standard"
                      fullWidth
                      value={fields.numero_bordereaux}
                      onChange={handleChange}
                      error={!!fieldErrors.numero_bordereaux || !!error}
                      helperText={fieldErrors.numero_bordereaux ? 'Ce champ est requis' : error ? 'Le numéro de bordereaux existe déjà' : ''}
                      InputProps={{
                        style: fieldErrors.numero_bordereaux ? { borderColor: 'red' } : error ? { borderColor: 'red' } : {},
                      }}
                    />
                  </Grid>

                  {/* <Grid item xs={12} sm={12}>
                    <TextField
                    type="number"
                      name="numero_bordereaux"
                      label="Numéro Bordereaux"
                      variant="standard"
                      fullWidth
                      value={fields.numero_bordereaux}
                      onChange={handleChange}
                      error={!!fieldErrors.numero_bordereaux || !!error}
                      helperText={fieldErrors.numero_bordereaux
                        ? 'Ce champ est requis'
                        : error
                          ? 'Le numéro de bordereaux existe déjà'
                          : ''
                      }
                      InputProps={{
                        style: fieldErrors.numero_bordereaux || error
                          ? { borderColor: 'red' }
                          : {},
                      }}
                      InputLabelProps={{
                        style: {
                          color: fieldErrors.numero_bordereaux || error ? 'red' : '#2196F3', // Change label color
                        },
                      }}
                      sx={{
                        '& .MuiInput-underline:after': {
                          borderBottomColor: '#4CAF50', // Green border on focus
                        },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                          borderBottomColor: '#4CAF50', // Green border on hover
                        },
                      }}
                    />
                  </Grid> */}


                  {/* <Grid item xs={12} sm={12}>
                    <TextField
                      type="date"
                      name="date_depart"
                      label="Date Départ"
                      variant="standard"
                      fullWidth
                      value={fields.date_depart}
                      onChange={handleChange}
                      error={!!fieldErrors.date_depart}
                      helperText={fieldErrors.date_depart ? 'Ce champ est requis' : ''}
                      InputProps={{
                        style: fieldErrors.date_depart ? { borderColor: 'red' } : {},
                      }}
                    />
                  </Grid> */}

                  <Grid item xs={12} sm={12}>
                    <TextField
                      type={fields.date_depart ? "date" : "text"} // Change the type based on value
                      name="date_depart"
                      label="Date Départ"
                      variant="standard"
                      fullWidth
                      value={fields.date_depart}
                      onChange={handleChange}
                      error={!!fieldErrors.date_depart}
                      helperText={fieldErrors.date_depart ? 'Ce champ est requis' : ''}
                      InputProps={{
                        style: fieldErrors.date_depart ? { borderColor: 'red' } : {},
                        placeholder: !fields.date_depart ? "jj/mm/aaaa" : "", // Show placeholder if no value
                      }}
                      onFocus={(e) => e.target.type = "date"} // Change to date picker on focus
                      onBlur={(e) => {
                        if (!fields.date_depart) e.target.type = "text"; // Revert to text if no value on blur
                      }}
                    />
                  </Grid>


                  {/* <Grid item xs={12} sm={12}>
                    <TextField
                      type={fields.date_depart ? "date" : "text"} // Change the type based on value
                      name="date_depart"
                      label="Date Départ"
                      variant="standard"
                      fullWidth
                      value={fields.date_depart}
                      onChange={handleChange}
                      error={!!fieldErrors.date_depart}
                      helperText={fieldErrors.date_depart ? 'Ce champ est requis' : ''}
                      InputProps={{
                        style: {
                          color: fieldErrors.date_depart ? 'red' : '#4CAF50', // Change text color
                          borderColor: fieldErrors.date_depart ? 'red' : '#4CAF50', // Change border color
                        },
                      }}
                      InputLabelProps={{
                        style: {
                          color: fieldErrors.date_depart ? 'red' : '#2196F3', // Change label color
                        },
                      }}
                      FormHelperTextProps={{
                        style: {
                          color: 'red', // Always red for error message
                        },
                      }}
                      onFocus={(e) => e.target.type = "date"} // Change to date picker on focus
                      onBlur={(e) => {
                        if (!fields.date_depart) e.target.type = "text"; // Revert to text if no value on blur
                      }}
                    />
                  </Grid> */}


                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="expiditeur"
                      label="Expediteur"
                      variant="standard"
                      fullWidth
                      value={fields.expiditeur}
                      onChange={handleChange}
                      error={!!fieldErrors.expiditeur}
                      helperText={fieldErrors.expiditeur ? 'Ce champ est requis' : ''}
                      InputProps={{
                        style: fieldErrors.expiditeur ? { borderColor: 'red' } : {},
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="destination"
                      label="Destination"
                      variant="standard"
                      fullWidth
                      value={fields.destination}
                      onChange={handleChange}
                      error={!!fieldErrors.destination}
                      helperText={fieldErrors.destination ? 'Ce champ est requis' : ''}
                      InputProps={{
                        style: fieldErrors.destination ? { borderColor: 'red' } : {},
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="description"
                      label="Description"
                      variant="standard"
                      fullWidth
                      value={fields.description}
                      onChange={handleChange}
                      error={!!fieldErrors.description}
                      helperText={fieldErrors.description ? 'Ce champ est requis' : ''}
                      InputProps={{
                        style: fieldErrors.description ? { borderColor: 'red' } : {},
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="nom_depose"
                      label="Nom Déposé"
                      variant="standard"
                      fullWidth
                      value={fields.nom_depose}
                      onChange={handleChange}
                      error={!!fieldErrors.nom_depose}
                      helperText={fieldErrors.nom_depose ? 'Ce champ est requis' : ''}
                      InputProps={{
                        style: fieldErrors.nom_depose ? { borderColor: 'red' } : {},
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="prenom_depose"
                      label="Prénom Déposé"
                      variant="standard"
                      fullWidth
                      value={fields.prenom_depose}
                      onChange={handleChange}
                      error={!!fieldErrors.prenom_depose}
                      helperText={fieldErrors.prenom_depose ? 'Ce champ est requis' : ''}
                      InputProps={{
                        style: fieldErrors.prenom_depose ? { borderColor: 'red' } : {},
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="matricule"
                      label="Matricule"
                      variant="standard"
                      fullWidth
                      value={fields.matricule}
                      onChange={handleChange}
                      error={!!fieldErrors.matricule}
                      helperText={fieldErrors.matricule ? 'Ce champ est requis' : ''}
                      InputProps={{
                        style: fieldErrors.matricule ? { borderColor: 'red' } : {},
                      }}
                    />
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                fullWidth
                className='btn__modal__visa__fermer'
              >Fermer</Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                // size="medium"
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
