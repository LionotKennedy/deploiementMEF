
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useDeleteJournal } from '../../services/serviceJournal';
import { useGetJournals } from '../../services/serviceJournal';
import { FaExclamationTriangle } from 'react-icons/fa';
import './styleglobale.scss'
import { useSnackbar } from 'notistack';
import { AiOutlineClose } from 'react-icons/ai';
import IconButton from '@mui/material/IconButton';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertJournalDialogSlide({ open, setOpen, id, onSuccess }) {

    const deleteJournalMutation = useDeleteJournal();
    const { data: journals, refetch, isLoading } = useGetJournals();
    const { enqueueSnackbar } = useSnackbar();

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteJournalMutation.mutateAsync({ id });
            enqueueSnackbar('Le journal a été supprimé avec succès', {
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
            refetch();
            setOpen(false);
            // onSuccess();
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
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FaExclamationTriangle style={{ color: 'orange', marginRight: '10px' }} />
                {"Confirmation de suppression"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Êtes-vous sûr de vouloir supprimer le journal ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Annuler</Button>
                <Button onClick={handleConfirmDelete} className='annuler__folder'>Confirmer</Button>
            </DialogActions>
        </Dialog>
    );
}

