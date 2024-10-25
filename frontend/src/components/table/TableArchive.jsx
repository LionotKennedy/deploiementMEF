
import React, { useEffect, useRef, useState } from 'react';
import "./tableResponsive.scss";
import search from "../../assets/image/search.png"
import { MdEdit, MdDelete, MdVisibility, MdAdd, MdRefresh } from 'react-icons/md';
import { AnimatePresence } from 'framer-motion';
import { useGetFolders } from '../../services/serviceFolder';
import AlertDialogArchiveSlide from '../MUI_alert/deleteArchive';
import ArchiveDialogs from '../MUI_read/readArchive';
import ArchiveModal from '../MUI/ArchiveModal';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import { FaArrowDown, FaSearch } from 'react-icons/fa';
import imageData from "../../assets/images/logo.png";
import imageLogo from "../../assets/images/ministere.png";
import imageLogo2 from "../../assets/images/image3.png";
import pdf from "../../assets/image/pdf.png";
import excel from "../../assets/image/excel.png";
import word from "../../assets/image/docx2.png";
import ContentToPrintArchive from '../printer/ContentToPrintArchive';
import { useSnackbar } from 'notistack';


const TableArchive = ({ archives, refetch, year }) => {
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
    const { data: folders, isLoading, isError } = useGetFolders();
    const [mode, setMode] = useState('add');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const contentRef = useRef();
    const [startDateValue, setStartDateValue] = useState('');
    const [endDateValue, setEndDateValue] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(20); // Customize number of rows per page
    // Calculate total pages
    const totalPages = Math.ceil(archives.length / rowsPerPage);
    // Paginate the archive data
    const paginateData = (data) => {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return data.slice(start, end);
    };
    // Navigate to the previous page
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    // Navigate to the next page
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

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
            html: "#table__archive",
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
        doc.save("archive-srsp.pdf");
    };

    const exportExcel = () => {
        // const table = document.getElementById('my-table');
        const table = document.getElementById('table__archive');
        const wb = XLSX.utils.table_to_book(table);
        XLSX.writeFile(wb, 'archive-srsp.xlsx');
    };

    const exportWord = () => {
        const doc = new jsPDF();
        doc.autoTable({
            html: "#table__archive",
            styles: { cellPadding: 6 }
        });
        doc.save('archive-srsp.docx');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
        // console.log('Dropdown toggled!');
    };

    const handleOptionClick = async (option) => {
        setSelectedOption(option);
        // console.log(`Option selected: ${option}`);
        switch (option) {
            case 'option1':
                await exportPdf();
                // console.log("PDF généré avec succès");
                enqueueSnackbar('PDF généré avec succès.', { variant: 'success' });
                break;
            case 'option2':
                await exportWord();
                // console.log("Fichier Word généré avec succès");
                enqueueSnackbar('Fichier Word généré avec succès.', { variant: 'success' });
                break;
            case 'option3':
                await exportExcel();
                // console.log("Fichier Word généré avec succès");
                enqueueSnackbar('Fichier excel généré avec succès.', { variant: 'success' });
                break;
        }
        setDropdownOpen(false);
    };


    const handleOpenModal = (folderId, mode) => {
        setSelectedFolderId(folderId);
        setMode(mode);
        setModalOpen(true);
    };

    const handleCloseModal = () => setModalOpen(false);

    // Ouvre le modal d'alerte avec l'ID du courrier à supprimer
    const handleDeleteClick = (folderId) => {
        setDeleteFolderId(folderId);
        setAlertOpen(true); // Ouvre l'alert modal
        // console.log(folderId)
    };

    // Ouvre le modal d'alerte avec l'ID du courrier à supprimer
    const handleReadClick = (folderId) => {
        setReadFolderId(folderId);
        setAlertOpenRead(true); // Ouvre l'alert modal
        // console.log(folderId)
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


    useEffect(() => {
        // if (folders && folders.data) {
        //     folders.data.forEach((folder) => console.log('Folder data:', folder));
        // }
        // folders?.data?.forEach((folder) => console.log('Folder data:', folder));
    }, [folders])


    useEffect(() => {
        // console.log("Valeur de recherche :", searchValue);
    }, [searchValue]);



    useEffect(() => {
        const searchInput = searchRef.current;
        const table = tableRef.current;

        if (!table) {
            // console.error('Table reference is null.');
            return;
        }

        const tableRows = table.querySelectorAll('tbody tr');

        const searchTable = () => {
            const search_data = searchValue.trim().toLowerCase();

            // Si le champ de recherche est vide, afficher toutes les lignes
            if (search_data === "") {
                tableRows.forEach((row, i) => {
                    row.classList.remove('hide');
                    row.style.setProperty('--delay', i / 25 + 's');
                });
                return; // Sortir de la fonction car aucun filtrage n'est nécessaire
            }

            tableRows.forEach((row, i) => {
                let table_data = '';

                if (searchType === 'nom') {
                    table_data = row.querySelectorAll('td')[4]?.textContent.toLowerCase();
                } else if (searchType === 'numero') {
                    table_data = row.querySelectorAll('td')[0]?.textContent.toLowerCase();
                } else if (searchType === 'matricule') {
                    table_data = row.querySelectorAll('td')[6]?.textContent.toLowerCase();
                }
                // Masquer la ligne si elle ne correspond pas à la recherche
                if (table_data && search_data) {
                    row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
                    row.style.setProperty('--delay', i / 25 + 's');
                }
            });

            // Appliquer des styles aux lignes visibles
            document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
                visible_row.style.backgroundColor = (i % 2 === 0) ? '--second-bg' : '--second-bg';
                visible_row.style.animationDelay = `${i * 0.1}s`;
            });
        };

        searchTable();
    }, [searchType, searchValue]);


    // Count total items
    const totalItems = archives.length;


    const displayTotalItems = () => {
        if (totalItems > 0) {
            return (
                <p>Nombre total d'archives : {totalItems}</p>
            );
        }
        return null;
    };

    const searchTable = () => {
        const searchInput = searchRef.current;
        const table = tableRef.current;
        const tableRows = table.querySelectorAll('tbody tr');
        const search_data = searchValue.trim().toLowerCase();
        // Si le champ de recherche est vide, afficher toutes les lignes
        if (search_data === "") {
            tableRows.forEach((row, i) => {
                row.classList.remove('hide');
                row.style.setProperty('--delay', i / 25 + 's');
            });
            return; // Sortir de la fonction car aucun filtrage n'est nécessaire
        }

        tableRows.forEach((row, i) => {
            let table_data = '';

            if (searchType === 'nom') {
                table_data = row.querySelectorAll('td')[4]?.textContent.toLowerCase();
            } else if (searchType === 'numero') {
                table_data = row.querySelectorAll('td')[0]?.textContent.toLowerCase();
            } else if (searchType === 'matricule') {
                table_data = row.querySelectorAll('td')[6]?.textContent.toLowerCase();
            }
            // Masquer la ligne si elle ne correspond pas à la recherche
            if (table_data && search_data) {
                row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
                row.style.setProperty('--delay', i / 25 + 's');
            }
        });

        // Appliquer des styles aux lignes visibles
        document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
            visible_row.style.backgroundColor = (i % 2 === 0) ? '--second-bg' : '--second-bg';
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
                <main className="table" id="archive_table">
                    <div ref={contentRef} className="content-to-print">
                        <div className="hidden-contents">
                            <ContentToPrintArchive archives={archives} />
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
                                        placeholder="Start Date..."
                                    />
                                </div>
                                <div className='contents__search'>
                                    <input
                                        type="date"
                                        ref={endDateRef}
                                        onChange={(e) => setEndDateValue(e.target.value)}
                                        placeholder="End Date..."
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
                            <MdAdd onClick={() => handleOpenModal(null, 'add')} className="icon_add" style={{ marginLeft: '10px', fontSize: '24px', display: 'none' }} />
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
                        <table className='table' ref={tableRef}>
                            <thead className='thead'>
                                <tr>
                                    <th className='th'>Numéro</th>
                                    <th className='th'>Date Départ</th>
                                    <th className='th'>Expéditeur</th>
                                    <th className='th'>Destination</th>
                                    <th className='th'>Nom</th>
                                    <th className='th'>Prénom</th>
                                    <th className='th'>Matricule</th>
                                    <th className='th'>Description</th>
                                    <th className='th'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='tbody'>
                                {archives.length > 0 ? (
                                    paginateData(archives).map((archive, index) => (
                                        <tr key={archive._id}>
                                            <td className="td">{archive.numero_bordereaux}</td>
                                            {/* <td className="td">{new Date(archive.date_depart).toLocaleDateString()}</td> */}
                                            <td className="td">
                                                {(() => {
                                                    const date = new Date(archive.date_depart);
                                                    const year = date.getFullYear();
                                                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois de 0 à 11, donc on ajoute 1
                                                    const day = String(date.getDate() + 1).padStart(2, '0'); // Ajouter un zéro devant si nécessaire
                                                    return `${year}-${month}-${day}`;
                                                })()}
                                            </td>
                                            <td className="td">{archive.expiditeur}</td>
                                            <td className="td">{archive.destination}</td>
                                            <td className="td">{archive.nom_depose}</td>
                                            <td className="td">{archive.prenom_depose}</td>
                                            <td className="td">{archive.matricule}</td>
                                            <td className="td">{archive.description}</td>
                                            <td className="td">
                                                <MdEdit className="action-icon icon color__icon-edit" title="Modifier" onClick={() => handleOpenModal(archive._id, 'edit')} />
                                                <MdDelete className="action-icon icon color__icon-delete" title="Delete" onClick={() => handleDeleteClick(archive._id)} />
                                                <MdVisibility className="action-icon icon color__icon-visible" title="Read" onClick={() => handleReadClick(archive._id)} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10">Aucune archive trouvée pour cette année.</td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </section>
                    <AnimatePresence>
                        {modalOpen && (
                            <ArchiveModal
                                open={modalOpen}
                                handleClose={handleCloseModal}
                                folderId={selectedFolderId}
                                mode={mode}
                                onSuccess={refetch} // On passe refetch ici
                            />
                        )}
                    </AnimatePresence>
                    <AlertDialogArchiveSlide open={alertOpen} setOpen={setAlertOpen} folderId={deleteFolderId} onSuccess={refetch} />
                    <ArchiveDialogs open={alertOpenRead} setOpen={setAlertOpenRead} folderId={readFolderId} />
                </main>
            </div>
            <div>
                {/* Pagination Controls */}
                <div className="pagination">
                    <button className="pagination-button" onClick={handlePrevPage} disabled={currentPage === 1}>
                        &#8249; Précédent
                    </button>
                    <span className="pagination-info">Page {currentPage} sur {totalPages}</span>
                    <button className="pagination-button" onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Suivant &#8250;
                    </button>
                </div>
                {displayTotalItems()}
            </div>
        </>
    );
};

export default TableArchive;

