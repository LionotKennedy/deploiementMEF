
import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';  // Ajout de l'icône d'avertissement
import Slide from '@mui/material/Slide';
import { useUpdatePermissionUser, useGetUserById } from '../../services/serviceUser';
import { useSnackbar } from 'notistack';
import { AiOutlineClose } from 'react-icons/ai'
import './style/userUpdate.scss';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function UserUpdateScreenDialog({ open, handleClose, userId, onSuccess }) {
    const { mutate: updateUser } = useUpdatePermissionUser();
    const { data: userData } = useGetUserById(userId);
    const [imagePreview, setImagePreview] = useState('');
    const [fields, setFields] = useState({
        role: '',
        status: ''
    });
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // Action à confirmer
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (userData && userData.data) {
            setFields({
                role: userData.data.role === 1 ? 'chef' : 'personnel',
                status: userData.data.status === 'active' ? 'active' : 'desactive',
            });
            setImagePreview(`${userData.data.image}`);
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Si l'utilisateur choisit "désactivé" ou "chef", afficher la boîte de dialogue de confirmation
        if (value === 'chef' || value === 'desactive') {
            setPendingAction({ name, value }); // Sauvegarder l'action en attente
            setOpenConfirmationDialog(true);  // Ouvrir la boîte de dialogue de confirmation
        } else {
            setFields(prevFields => ({ ...prevFields, [name]: value }));
        }
    };

    const handleSubmit = async () => {
        const roleMapping = {
            chef: '1',
            personnel: '0'
        };

        const statusMapping = {
            active: 'active',
            desactive: 'desactive'
        };

        const formattedFields = {
            role: roleMapping[fields.role],
            status: statusMapping[fields.status]
        };

        try {
            updateUser({ userId, data: formattedFields }, {
                onSuccess: () => {
                    setFields({ role: '', status: '' });
                    setImagePreview('');
                    enqueueSnackbar('Le utilisateur a été modifié avec succès.', {
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
                },
                onError: (error) => {
                    console.error('Erreur lors de la mise à jour:', error.message);
                }
            });
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
        }
    };

    // Gestion de la confirmation
    const handleConfirm = () => {
        setFields(prevFields => ({ ...prevFields, [pendingAction.name]: pendingAction.value }));
        setOpenConfirmationDialog(false);
        setPendingAction(null);
    };

    // Annuler l'action
    const handleCancel = () => {
        setOpenConfirmationDialog(false);
        setPendingAction(null);
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                fullWidth
                maxWidth="sm"
            >
                <AppBar sx={{ position: 'relative' }} className='appBar'>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <FaTimes />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Compte
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleSubmit}>
                            Modification
                        </Button>
                    </Toolbar>
                </AppBar>
                <List>
                    <DialogTitle>Modification compte utilisateur</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Rôle de l'utilisateur</FormLabel>
                                    <RadioGroup
                                        name="role"
                                        value={fields.role}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel
                                            value="chef"
                                            control={<Radio />}
                                            label="Chef"
                                        />
                                        <FormControlLabel
                                            value="personnel"
                                            control={<Radio />}
                                            label="Personnel"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Statut de l'utilisateur</FormLabel>
                                    <RadioGroup
                                        name="status"
                                        value={fields.status}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel
                                            value="active"
                                            control={<Radio />}
                                            label="Activé"
                                        />
                                        <FormControlLabel
                                            value="desactive"
                                            control={<Radio />}
                                            label="Désactivé"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </List>
            </Dialog>

            {/* Boîte de dialogue de confirmation */}
            <Dialog
                open={openConfirmationDialog}
                onClose={handleCancel}
            >
                <DialogTitle>
                    <FaExclamationTriangle style={{ color: 'orange', marginRight: '10px' }} />
                    Confirmation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir {pendingAction?.value === 'desactive' ? 'désactiver' : 'attribuer le rôle de chef'} cet utilisateur ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">Annuler</Button>
                    <Button onClick={handleConfirm} color="primary">Confirmer</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
