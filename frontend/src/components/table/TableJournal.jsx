import React, { useEffect, useRef, useState } from 'react';
import "./tableResponsive.scss";
import "./tablejournal.scss"
import { MdDelete, MdVisibility, MdRefresh } from 'react-icons/md';
import { useGetJournals } from '../../services/serviceJournal';
import JournalDialogs from '../../components/MUI_read/readJournal';
import AlertJournalDialogSlide from '../../components/MUI_alert/deleteJournal';
import ReactPaginate from 'react-paginate';
import { FaSearch } from 'react-icons/fa';
import { useSnackbar } from 'notistack';


const TableJournal = () => {
    const { data: journals, refetch, isLoading, isError } = useGetJournals();
    const [deleteFolderId, setDeleteFolderId] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertOpenRead, setAlertOpenRead] = useState(false);
    const [readFolderId, setReadFolderId] = useState(null);
    const tableRef = useRef(null);
    const [startDateValue, setStartDateValue] = useState('');
    const [endDateValue, setEndDateValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [foldersPerPage] = useState(20); // Nombre d'éléments par page
    const { enqueueSnackbar } = useSnackbar();
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = journals && Array.isArray(journals.data) ? Math.ceil(journals.data.length / foldersPerPage) : 1;
    // Dossiers pour la page actuelle
    const currentFolders = journals && Array.isArray(journals.data)
        ? journals.data.slice((currentPage - 1) * foldersPerPage, currentPage * foldersPerPage)
        : [];

    useEffect(() => {
        refetch();
    }, [refetch]);

    const handleDeleteClick = (folderId) => {
        setDeleteFolderId(folderId);
        setAlertOpen(true);
    };

    const handleReadClick = (folderId) => {
        setReadFolderId(folderId);
        setAlertOpenRead(true);
    };

    const displayData = () => {
        if (isLoading) {
            return (
                <tr>
                    <td colSpan="9">Chargement...</td>
                </tr>
            );
        }

        if (isError) {
            return (
                <tr>
                    <td colSpan="9">Une erreur s'est produite.</td>
                </tr>
            );
        }

        // Si les dossiers ne sont pas un tableau ou s'ils sont vides
        if (!journals || !Array.isArray(journals.data) || journals.data.length === 0) {
            return (
                <tr>
                    <td colSpan="9">Aucune donnée disponible</td>
                </tr>
            );
        }

        return currentFolders.map((folder, index) => (
            <tr key={index}>
                {/* <td className="td">{new Date(folder.date).toLocaleDateString()}</td> */}
                <td className="td">{folder.userName}</td>
                <td className="td">{folder.adressEmail}</td>
                <td className="td">{folder.action}</td>
                <td className="td">{folder.details}</td>
                <td className="td">
                    {(() => {
                        const date = new Date(folder.date);
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois de 0 à 11, donc on ajoute 1
                        const day = String(date.getDate()).padStart(2, '0'); // Ajouter un zéro devant si nécessaire
                        return `${year}-${month}-${day}`;
                    })()}
                </td>
                <td className="td">
                    <MdDelete className="action-icon icon color__icon-delete" title="Delete" onClick={() => handleDeleteClick(folder._id)} />
                    <MdVisibility className="action-icon icon color__icon-visible" title="Read" onClick={() => handleReadClick(folder._id)} />
                </td>
            </tr>
        ));
    };

    const SearchByTowDate = () => {
        const table = tableRef.current;
        const tableRows = table.querySelectorAll('tbody tr');

        const startDateInput = new Date(startDateRef.current.value);
        const endDateInput = new Date(endDateRef.current.value);

        // const startDateInput = formatDate(new Date(startDateRef.current.value));
        // const endDateInput = formatDate(new Date(endDateRef.current.value));

        // Vérification des dates
        if (isNaN(startDateInput.getTime()) || isNaN(endDateInput.getTime())) {
            enqueueSnackbar('Les dates entrées sont invalides.', { variant: 'error' });
            return;
        }

        // Vérification que la date de début n'est pas après la date de fin
        if (startDateInput > endDateInput) {
            enqueueSnackbar('La date de début ne peut pas être postérieure à la date de fin.', { variant: 'error' });
            return;
        }

        tableRows.forEach((row, i) => {
            // On récupère la date à comparer dans la colonne spécifique (par exemple la 8ème colonne).
            let tableDateText = row.querySelectorAll('td')[4].textContent; // Suppose que la date est dans la 8ème colonne (index 7)
            let tableDate = new Date(tableDateText);

            // Vérifie si la date est entre les deux dates sélectionnées
            let isInDateRange = tableDate >= startDateInput && tableDate <= endDateInput;

            // Masque ou affiche la ligne en fonction de la condition
            row.classList.toggle('hide', !isInDateRange);
            row.style.setProperty('--delay', i / 25 + 's');
        });

        // Applique les animations aux lignes visibles
        document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
            visible_row.style.backgroundColor = (i % 2 === 0) ? '--second-bg' : '--second-bg';
            visible_row.style.animationDelay = `${i * 0.1}s`;
        });
    };

    const handleSearch = () => {
        const startDateInput = startDateRef.current.value;
        const endDateInput = endDateRef.current.value;

        // console.log('Date de début:', startDateInput);
        // console.log('Date de fin:', endDateInput);

        // Appel de la fonction de recherche entre deux dates
        SearchByTowDate();
    };


    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    const totalItems = journals && Array.isArray(journals.data) ? journals.data.length : 0;

    const displayTotalItems = () => {
        if (totalItems > 0) {
            return (
                <div className='total__courrier'>
                    <span>Nombre total de journaux : {totalItems}</span>
                </div>
            );
        }
        return null;
    };


    const refreshTable = () => {
        setStartDateValue('');
        setEndDateValue('');
        const table = tableRef.current;
        const tableRows = table.querySelectorAll('tbody tr');
        tableRows.forEach((row) => {
            row.classList.remove('hide'); // Affiche toutes les lignes
        });
    };


    return (
        <>
            <div className='container__table'>
                <main className="table" ref={tableRef} id="customers_table">
                    <section className="table__header cont">
                        <div className='container__search__journal'>
                            <div className='contents__search__journal'>
                                <input
                                    type="date"
                                    ref={startDateRef}
                                    onChange={(e) => setStartDateValue(e.target.value)}
                                    placeholder="Start Date..."
                                />
                            </div>
                            <div className='contents__search__journal'>
                                <input
                                    type="date"
                                    ref={endDateRef}
                                    onChange={(e) => setEndDateValue(e.target.value)}
                                    placeholder="End Date..."
                                />
                            </div>
                            {/* <div className='search__btn__journal'>
                            </div> */}

                            {/* <FaSearch className='search__icon__journal' onClick={handleSearch} /> */}
                        </div>
                        {/* style={{ marginLeft: '15px', fontSize: '10px' }}  */}
                        <div className='search__btn__journal'>
                            <FaSearch onClick={handleSearch} className='search__icon__j '  style={{ fontSize: '20px' }} />
                        </div>
                        <MdRefresh onClick={refreshTable} className="icon_refech" style={{ marginLeft: '15px', fontSize: '24px' }} />

                    </section>

                    <section className="table__body">
                        <table className='table' id="my-table">
                            <thead className='thead'>
                                <tr>
                                    <th className='th'>Nom d’utilisateur </th>
                                    <th className='th'>Email </th>
                                    <th className='th'>Action </th>
                                    <th className='th'>Détails </th>
                                    <th className='th'>Date </th>
                                    <th className='th'>Actions </th>
                                </tr>
                            </thead>
                            <tbody className='tbody'>
                                {displayData()}
                            </tbody>
                        </table>
                    </section>
                    <AlertJournalDialogSlide open={alertOpen} setOpen={setAlertOpen} id={deleteFolderId} />
                    <JournalDialogs open={alertOpenRead} setOpen={setAlertOpenRead} id={readFolderId} />
                </main>
            </div>
            <div>
                {/* Pagination controls */}
                <ReactPaginate
                    previousLabel={'Précédent'}
                    nextLabel={'Suivant'}
                    pageCount={totalPages}
                    onPageChange={({ selected }) => paginate(selected + 1)}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />
                {displayTotalItems()}
            </div>
        </>
    )
}

export default TableJournal