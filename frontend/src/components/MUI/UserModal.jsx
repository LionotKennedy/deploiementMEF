
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { DialogTitle, DialogContent, TextField, Grid } from '@mui/material';
import { FaTimes } from 'react-icons/fa';
import Slide from '@mui/material/Slide';
import { useAddUser } from '../../services/serviceUser';
import { useSnackbar } from 'notistack';
import { AiOutlineClose } from 'react-icons/ai'


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function UserScreenDialog({ open, handleClose, onSuccess }) {

    const [fields, setFields] = useState({
        name: '',
        email: ''
    });

    const addUserMutation = useAddUser();
    const [fieldErrors, setFieldErrors] = useState({}); // Gérer les erreurs spécifiques des champs
    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields(prevFields => ({ ...prevFields, [name]: value }));
    };

    const handleSubmit = async () => {

        let hasError = false;
        let errors = {};

        if (!fields.name) {
            errors.name = true;
            hasError = true;
        }
        if (!fields.email) {
            errors.email = true;
            hasError = true;
        }


        if (hasError) {
            setFieldErrors(errors); // Définir les erreurs dans l'état
            // setError('Veuillez remplir tous les champs requis.');
            enqueueSnackbar('Veuillez remplir tous les champs requis.', { variant: 'error' });
            return;
        }

        const formattedFields = {
            ...fields,
        };


        try {
            const response = await addUserMutation.mutateAsync(formattedFields);
            if (response.success) {
                enqueueSnackbar('Le utilisateur a été ajouté avec succès.', {
                    variant: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    autoHideDuration: 5000,
                    action: (
                        <IconButton size="small" onClick={() => { }}>
                            <AiOutlineClose fontSize="small" />
                        </IconButton>
                    ),
                    style: { backgroundColor: '#4caf50', color: '#ffffff' },
                });
                onSuccess();
                handleClose();
            } else {
                // Si l'email existe déjà ou une autre erreur est survenue
                enqueueSnackbar(`Erreur: ${response.message}`, { variant: 'warning' });
            }
        } catch (error) {
            if (error.message.includes("Failed to fetch")) {
                // Erreur de connexion internet
                enqueueSnackbar("Erreur : Pas de connexion Internet. Veuillez réessayer.", { variant: 'error' });
            } else {
                enqueueSnackbar(`Erreur: ${error.message}`, { variant: 'error' });
            }
        }
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                fullWidth // Assure que le modal occupe toute la largeur disponible
                maxWidth="sm" // Choisissez une taille maximale : 'xs', 'sm', 'md', 'lg', 'xl'
            >
                <AppBar sx={{ position: 'relative' }} className='appBar'>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <FaTimes /> {/* Remplacement de CloseIcon par FaTimes */}
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Compte
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleSubmit}>
                            Creer
                        </Button>
                    </Toolbar>
                </AppBar>
                <List>
                    <DialogTitle> Creation compte utilisateur</DialogTitle>
                    <DialogContent>
                        <form>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        name="name"
                                        label="Nom du utilisateur"
                                        variant="standard"
                                        fullWidth
                                        onChange={handleChange}
                                        error={!!fieldErrors.name}
                                        helperText={fieldErrors.name ? 'Ce champ est requis' : ''}
                                        InputProps={{
                                            style: fieldErrors.name ? { borderColor: 'red' } : {},
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        type="email"
                                        name="email"
                                        label="Adresse email"
                                        variant="standard"
                                        fullWidth
                                        onChange={handleChange}
                                        error={!!fieldErrors.email}
                                        helperText={fieldErrors.email ? 'Ce champ est requis' : ''}
                                        InputProps={{
                                            style: fieldErrors.email ? { borderColor: 'red' } : {},
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </DialogContent>
                </List>
            </Dialog>
        </React.Fragment>
    );
}
