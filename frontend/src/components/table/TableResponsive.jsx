
import React, { useEffect, useRef, useState } from 'react';
import search from "../../assets/image/search.png";
import { MdEdit, MdDelete, MdVisibility, MdAdd, MdRefresh } from 'react-icons/md';
import { FaArrowDown, FaSearch } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';
import { useGetFolders } from '../../services/serviceFolder';
import AlertDialogSlide from '../MUI_alert/deleteFolder';
import CustomizedDialogs from '../MUI_read/readFolder';
import "./tableResponsive.scss";
import CustomModal from '../MUI/CustomModal';
import ContentToPrint from '../printer/ContentToPrint';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import imageData from "../../assets/images/logo.png";
import imageLogo from "../../assets/images/ministere.png";
import imageLogo2 from "../../assets/images/image3.png";
import pdf from "../../assets/image/pdf.png";
import excel from "../../assets/image/excel.png";
import word from "../../assets/image/docx2.png";
import ReactPaginate from 'react-paginate';
import { useSnackbar } from 'notistack';


const TableResponsive = () => {
    const tableRef = useRef(null);
    const searchRef = useRef(null);
    const [searchType, setSearchType] = useState('numero');
    const [searchValue, setSearchValue] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [deleteFolderId, setDeleteFolderId] = useState(null);
    const [alertOpenRead, setAlertOpenRead] = useState(false);
    const [readFolderId, setReadFolderId] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const { data: folders, refetch, isLoading, isError } = useGetFolders();
    const [mode, setMode] = useState('add');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const contentRef = useRef();
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [foldersPerPage] = useState(20); // Nombre d'éléments par page
    // Changer de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const [startDateValue, setStartDateValue] = useState('');
    const [endDateValue, setEndDateValue] = useState('');
    const { enqueueSnackbar } = useSnackbar();


    const totalPages = folders && Array.isArray(folders.data) ? Math.ceil(folders.data.length / foldersPerPage) : 1;

    // Dossiers pour la page actuelle
    const currentFolders = folders && Array.isArray(folders.data)
        ? folders.data.slice((currentPage - 1) * foldersPerPage, currentPage * foldersPerPage)
        : [];

    const exportPdf = async () => {
        const doc = new jsPDF({ orientation: "landscape" });

        // Variables pour centrer et ajuster la position des images
        const pageWidth = doc.internal.pageSize.getWidth();
        const imageWidth = 45; // Largeur de l'image principale (imageLogo)
        const imageWidth2 = 100; // Largeur ajustée de la deuxième image (imageLogo2) - élargir
        const imageHeight2 = 40; // Hauteur ajustée de la deuxième image (imageLogo2) - réduire
        const imageDataWidth = 18; // Largeur de l'imageData
        const topMargin = 5; // Marges supérieures pour le décalage (réduite pour remonter l'imageLogo)


        // Centrer uniquement imageLogo
        const centeredX1 = (pageWidth - imageWidth) / 2; // Centrer imageLogo
        const centeredY1 = topMargin; // Réduire topMargin pour placer imageLogo plus haut

        // Ajout de l'image centrée (imageLogo)
        doc.addImage(imageLogo, 'JPEG', centeredX1, centeredY1, imageWidth, imageWidth);

        // Ajouter une ligne couleur d'or juste en dessous de l'imageLogo
        const lineYPosition = centeredY1 + imageWidth + 2; // Positionner la ligne juste en dessous de l'imageLogo
        doc.setDrawColor(255, 128, 0); // Couleur de la ligne (orange)
        doc.setLineWidth(0.3); // Largeur de la ligne
        doc.line(10, lineYPosition, pageWidth - 10, lineYPosition); // Ligne sur presque toute la largeur de la page

        // Positionner imageLogo2 à gauche (X = 10)
        const leftX = 10; // Positionnement à gauche pour imageLogo2
        const imageLogo2Y = centeredY1 + imageWidth + 25; // Position Y pour imageLogo2, sous imageLogo
        doc.addImage(imageLogo2, 'JPEG', leftX, imageLogo2Y, imageWidth2, imageHeight2); // Image à gauche (imageLogo2) - Largeur plus grande et hauteur plus petite

        // Centrer imageData par rapport à imageLogo2
        const centeredXImageData = leftX + (imageWidth2 - imageDataWidth) / 2; // Centrer imageData par rapport à imageLogo2
        const imageDataY = imageLogo2Y - imageDataWidth - 2; // Positionner imageData juste au-dessus de imageLogo2

        doc.addImage(imageData, 'JPEG', centeredXImageData, imageDataY, imageDataWidth, imageDataWidth); // Image centrée par rapport à imageLogo2

        // Démarrer la table après les images, avec un espace suffisant
        doc.autoTable({
            html: "#teste",
            startY: imageLogo2Y + imageHeight2 + 20, // Démarrer la table après imageLogo2 avec un décalage
            headStyles: {
                fillColor: [200, 200, 200],
                textColor: [0, 0, 0],
            },
            styles: {
                cellPadding: 4,
                fontSize: 10,
            }
        });

        // Sauvegarder le fichier PDF
        doc.save("courrier-srsp.pdf");
    };


    const exportExcel = () => {
        const table = document.getElementById('teste');

        const wb = XLSX.utils.table_to_book(table);

        XLSX.writeFile(wb, 'courrier-srsp.xlsx');
    };

    const exportWord = () => {
        const doc = new jsPDF();

        doc.autoTable({
            html: "#teste",
            styles: { cellPadding: 6 }
        });

        doc.save('courrier-srsp.docx');
    };

    const handleOpenModal = (folderId, mode) => {
        setSelectedFolderId(folderId);
        setMode(mode);
        setModalOpen(true);
    };

    const handleCloseModal = () => setModalOpen(false);

    const handleDeleteClick = (folderId) => {
        setDeleteFolderId(folderId);
        setAlertOpen(true);
        // console.log(folderId);
    };

    const handleReadClick = (folderId) => {
        setReadFolderId(folderId);
        setAlertOpenRead(true);
        // console.log(folderId);
    };

    useEffect(() => {
        refetch();
    }, [refetch]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleOptionClick = async (option) => {
        setSelectedOption(option);

        switch (option) {
            case 'option1':
                await exportPdf();
                enqueueSnackbar('PDF généré avec succès.', { variant: 'success' });
                break;
            case 'option2':
                await exportWord();
                enqueueSnackbar('Fichier Word généré avec succès.', { variant: 'success' });
                break;
            case 'option3':
                await exportExcel();
                enqueueSnackbar('Fichier excel généré avec succès.', { variant: 'success' });
                break;
        }

        setDropdownOpen(false);
    };

    // useEffect(() => {
    //     const searchInput = searchRef.current;
    //     const table = tableRef.current;
    //     const tableRows = table.querySelectorAll('tbody tr');

    //     const searchTable = () => {
    //         tableRows.forEach((row, i) => {
    //             let search_data = searchValue.toLowerCase();
    //             let table_data = '';

    //             if (searchType === 'numero') {
    //                 table_data = row.querySelectorAll('td')[0].textContent.toLowerCase();
    //             } else if (searchType === 'nom') {
    //                 table_data = row.querySelectorAll('td')[4].textContent.toLowerCase();
    //             } else if (searchType === 'matricule') {
    //                 table_data = row.querySelectorAll('td')[6].textContent.toLowerCase();
    //             }

    //             row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
    //             row.style.setProperty('--delay', i / 25 + 's');
    //         });

    //         document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
    //             visible_row.style.backgroundColor = (i % 2 === 0) ? '--second-bg' : '--second-bg';
    //             visible_row.style.animationDelay = `${i * 0.1}s`;
    //         });
    //     };

    //     searchTable();
    // }, [searchType, searchValue]);

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
        if (!folders || !Array.isArray(folders.data) || folders.data.length === 0) {
            return (
                <tr>
                    <td colSpan="9">Aucune donnée disponible</td>
                </tr>
            );
        }
        return currentFolders.map((folder, index) => {
            // console.log('Date depart:', folder.date_depart); // Debugging

            return (
                <tr key={index}>
                    {/* <td className="td">{new Date(folder.date_depart).toLocaleDateString('fr-FR')}</td> */}
                    {/* <td className="td">{folder.date_depart}</td> */}
                    {/* <td className="td">{new Date(folder.date_depart).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' })}</td> */}
                    <td className="td">{folder.numero_bordereaux}</td>
                    <td className="td">
                        {(() => {
                            const date = new Date(folder.date_depart);
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois de 0 à 11, donc on ajoute 1
                            const day = String(date.getDate() + 1).padStart(2, '0'); // Ajouter un zéro devant si nécessaire
                            return `${year}-${month}-${day}`;
                            // return `${day}/${month}/${year}`;
                        })()}
                    </td>

                    <td className="td">{folder.expiditeur}</td>
                    <td className="td">{folder.destination}</td>
                    <td className="td">{folder.id_nature.nom_depose}</td>
                    <td className="td">{folder.id_nature.prenom_depose}</td>
                    <td className="td">{folder.id_nature.matricule}</td>
                    <td className="td">{folder.id_nature.description}</td>
                    <td className="td">
                        <MdEdit className="action-icon icon color__icon-edit" title="Modifier" onClick={() => handleOpenModal(folder._id, 'edit')} />
                        <MdDelete className="action-icon icon color__icon-delete" title="Delete" onClick={() => handleDeleteClick(folder._id)} />
                        <MdVisibility className="action-icon icon color__icon-visible" title="Read" onClick={() => handleReadClick(folder._id)} />
                    </td>
                </tr>
            );
        });

    };

    const SearchByTowDate = () => {
        const table = tableRef.current;
        const tableRows = table.querySelectorAll('tbody tr');
        const startDateInput = new Date(startDateRef.current.value);
        const endDateInput = new Date(endDateRef.current.value);

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
            let tableDateText = row.querySelectorAll('td')[1].textContent; // Suppose que la date est dans la 8ème colonne (index 7)
            let tableDate = new Date(tableDateText);

            // Vérifie si la date est entre les deux dates sélectionnées
            let isInDateRange = tableDate >= startDateInput && tableDate <= endDateInput;
            // let isInDateRange = tableDate >= startDate && tableDate <= endDate;

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

        // console.log('Date de début:', startDateInput);
        // console.log('Date de fin:', endDateInput);

        // Supposons que les dates d'entrée sont des chaînes au format 'YYYY-MM-DD'
        const startDateInput = startDateRef.current.value; // '2024-10-17'
        const endDateInput = endDateRef.current.value; // '2024-10-18'

        // Convertir en objets Date
        const startDate = new Date(startDateInput);
        const endDate = new Date(endDateInput);

        // Formater les dates
        const formattedStartDate = startDate.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });
        const formattedEndDate = endDate.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });

        // Maintenant vous pouvez utiliser ces valeurs formatées
        // console.log("Date de début:", formattedStartDate); // Affiche: Date de début: 17/10/2024
        // console.log("Date de fin:", formattedEndDate); // Affiche: Date de fin: 18/10/2024


        // Appel de la fonction de recherche entre deux dates
        SearchByTowDate();
    };

    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    const totalItems = folders && Array.isArray(folders.data) ? folders.data.length : 0;

    const displayTotalItems = () => {
        if (totalItems > 0) {
            return (
                <div className='total__courrier'>
                    <span>Total des courriers : {totalItems}</span>
                </div>
            );
        }
        return null;
    };

    const searchTable = () => {
        const tableRows = tableRef.current.querySelectorAll('tbody tr');
        tableRows.forEach((row, i) => {
            let search_data = searchValue.toLowerCase();
            let table_data = '';

            if (searchType === 'numero') {
                table_data = row.querySelectorAll('td')[0].textContent.toLowerCase();
            } else if (searchType === 'nom') {
                table_data = row.querySelectorAll('td')[4].textContent.toLowerCase();
            } else if (searchType === 'matricule') {
                table_data = row.querySelectorAll('td')[6].textContent.toLowerCase();
            }

            row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
            row.style.setProperty('--delay', i / 25 + 's');
        });

        document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
            visible_row.style.backgroundColor = (i % 2 === 0) ? 'var(--second-bg)' : 'var(--second-bg)';
            visible_row.style.animationDelay = `${i * 0.1}s`;
        });
    };


    useEffect(() => {
        searchTable();
    }, [searchType, searchValue]);

    const refreshTable = () => {
        setSearchValue('');
        searchTable();
    };

    return (
        <>
            <div className='container__table'>
                <main className="table" ref={tableRef} id="customers_table">

                    <div ref={contentRef} className="content-to-print">
                        <div className="hidden-contents">
                            <ContentToPrint folders={folders?.data} />
                        </div>
                    </div>

                    <section className="table__header">
                        <select className='searchByeverything' value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                            <option value="numero">Recherche par numéro</option>
                            <option value="nom">Recherche par nom</option>
                            <option value="matricule">Recherche par matricule</option>
                            <option value="date">Recherche par date</option>
                        </select>
                        {searchType === 'date' ? (

                            <div className='container__search'>
                                <div className='contents__search'>
                                    <input
                                        type="date"
                                        ref={startDateRef}
                                        onChange={(e) => setStartDateValue(e.target.value)}
                                        placeholder="Date debut..."
                                    />
                                </div>
                                <div className='contents__search'>
                                    <input
                                        type="date"
                                        ref={endDateRef}
                                        onChange={(e) => setEndDateValue(e.target.value)}
                                        placeholder="Date fin..."
                                    />
                                </div>
                                <div className='search__btn'>
                                    <FaSearch className='search__icon' onClick={handleSearch} />
                                </div>
                            </div>
                        ) : (
                            <div className="input-group">
                                <input
                                    type="search"
                                    placeholder="Recherche donnée..."
                                    ref={searchRef}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                                <img src={search} alt="Search Icon" />
                            </div>
                        )}

                        <div className='option_right'>
                            <MdAdd onClick={() => handleOpenModal(null, 'add')} className="icon_add" style={{ marginLeft: '10px', fontSize: '24px' }} />
                            <MdRefresh onClick={refreshTable} className="icon_refech" style={{ marginLeft: '15px', fontSize: '24px' }} />

                            <div className="dropdown-container">
                                <div onClick={toggleDropdown} className='background_download'>
                                    <FaArrowDown className="icon_download" style={{ marginLeft: '0px', fontSize: '20px' }} />
                                </div>
                                {dropdownOpen && (
                                    <div className="dropdown-menu">
                                        <button onClick={() => handleOptionClick('option1')} className="dropdown-item"><img src={pdf} alt="Search Icon" />PDF</button>
                                        <button onClick={() => handleOptionClick('option2')} className="dropdown-item"><img src={word} alt="Search Icon" />DOCX</button>
                                        <button onClick={() => handleOptionClick('option3')} className="dropdown-item"><img src={excel} alt="Search Icon" />EXCEL</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="table__body">
                        <table className='table' id="my-table">
                            <thead className='thead'>
                                <tr>
                                    <th className='th'>Numéro </th>
                                    <th className='th'>Date Départ </th>
                                    <th className='th'>Expéditeur </th>
                                    <th className='th'>Destination </th>
                                    <th className='th'>Nom </th>
                                    <th className='th'>Prénom </th>
                                    <th className='th'>Matricule </th>
                                    <th className='th'>Description </th>
                                    <th className='th'>Actions </th>
                                </tr>
                            </thead>
                            <tbody className='tbody'>
                                {displayData()}
                            </tbody>
                        </table>
                    </section>
                    <AnimatePresence>
                        {modalOpen && (
                            <CustomModal
                                open={modalOpen}
                                handleClose={handleCloseModal}
                                folderId={selectedFolderId}
                                mode={mode}
                                onSuccess={refetch}
                            />
                        )}
                    </AnimatePresence>
                    {/* Inclusion du modal d'alerte */}
                    <AlertDialogSlide open={alertOpen} setOpen={setAlertOpen} folderId={deleteFolderId} onSuccess={refetch} />
                    <CustomizedDialogs open={alertOpenRead} setOpen={setAlertOpenRead} folderId={readFolderId} />
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
    );
}

export default TableResponsive;
