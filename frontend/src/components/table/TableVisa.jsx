import React, { useEffect, useRef, useState } from 'react';
import "./tableResponsive.scss"
import search from "../../assets/image/search.png"
import { MdEdit, MdDelete, MdVisibility, MdAdd, MdRefresh } from 'react-icons/md';
import { AnimatePresence } from 'framer-motion';
import { useGetVisa } from '../../services/serviceVisa';
import AlertDialogSlideVisa from '../MUI_alert/deleteVisa';
import CustomizedVisaDialogs from '../MUI_read/readVisa';
import VisaModal from '../MUI/VisaModal';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import { FaArrowDown } from 'react-icons/fa';
import imageData from "../../assets/images/logo.png";
import imageLogo from "../../assets/images/ministere.png";
import imageLogo2 from "../../assets/images/image3.png";
import pdf from "../../assets/image/pdf.png";
import excel from "../../assets/image/excel.png";
import word from "../../assets/image/docx2.png";
import ContentToPrintVisa from '../printer/ContentToPrintVisa';
import ReactPaginate from 'react-paginate';
import { useSnackbar } from 'notistack';

const TableVisa = () => {
    const tableRef = useRef(null);
    const searchRef = useRef(null);
    const [searchType, setSearchType] = useState('nom');
    const [searchValue, setSearchValue] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [deleteFolderId, setDeleteFolderId] = useState(null);
    const [alertOpenRead, setAlertOpenRead] = useState(false);
    const [readFolderId, setReadFolderId] = useState(null);
    const { data: folders, refetch, isLoading, isError } = useGetVisa();
    const [mode, setMode] = useState('add');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const contentRef = useRef();
    const { enqueueSnackbar } = useSnackbar();

    const [currentPage, setCurrentPage] = useState(0);
    const rowsPerPage = 20;

    // Calculate the number of total pages
    const totalPages = folders ? Math.ceil(folders.data.length / rowsPerPage) : 1;

    // Handle page click for pagination
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber - 1);
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
            html: "#table_visa",
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
        doc.save("visa-srsp.pdf");
    };

    const exportExcel = () => {
        // const table = document.getElementById('my-table');
        const table = document.getElementById('table_visa');
        const wb = XLSX.utils.table_to_book(table);
        XLSX.writeFile(wb, 'visa-srsp.xlsx');
    };


    const exportWord = () => {
        const doc = new jsPDF();
        doc.autoTable({
            html: "#table_visa",
            styles: { cellPadding: 6 }
        });
        doc.save('visa-srsp.docx');
    };

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


    const handleOpenModal = (folderId, mode) => {
        setSelectedFolderId(folderId);
        setMode(mode);
        setModalOpen(true);
    };

    const handleCloseModal = () => setModalOpen(false);

    const handleDeleteClick = (folderId) => {
        setDeleteFolderId(folderId);
        setAlertOpen(true);
    };

    const handleReadClick = (folderId) => {
        setReadFolderId(folderId);
        setAlertOpenRead(true);
    };

    useEffect(() => {
        if (folders && folders.data) {
            // folders.data.forEach((folder) => console.log('Folder data:', folder));
            folders.data.forEach((folder) => ('Folder data:', folder));
        }
    }, [folders])

    useEffect(() => {
        refetch();
    }, [refetch]);

    // useEffect(() => {
    //     const searchInput = searchRef.current;
    //     const table = tableRef.current;
    //     const tableRows = table.querySelectorAll('tbody tr');

    //     const searchTable = () => {
    //         tableRows.forEach((row, i) => {
    //             let search_data = searchValue.toLowerCase();
    //             let table_data = '';

    //             if (searchType === 'nom') {
    //                 table_data = row.querySelectorAll('td')[1].textContent.toLowerCase();
    //             } else if (searchType === 'prenom') {
    //                 table_data = row.querySelectorAll('td')[2].textContent.toLowerCase();
    //             } else if (searchType === 'numero') {
    //                 table_data = row.querySelectorAll('td')[0].textContent.toLowerCase();
    //             } else if (searchType === 'reference') {
    //                 table_data = row.querySelectorAll('td')[3].textContent.toLowerCase();
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


    const totalItems = folders && Array.isArray(folders.data) ? folders.data.length : 0;

    const displayTotalItems = () => {
        if (totalItems > 0) {
            return (
                <p>Nombre total de visas : {totalItems}</p>
            );
        }
        return null;
    };

    // Display data according to the current page
    const displayData = () => {
        if (!folders || !folders.data) return null;

        const startIndex = currentPage * rowsPerPage;
        const selectedFolders = folders.data.slice(startIndex, startIndex + rowsPerPage);

        return selectedFolders.map((folder, index) => (
            <tr key={index}>
                <td className="td">{folder.numero_visa}</td>
                <td className="td">{folder.nom_depose_visa}</td>
                <td className="td">{folder.prenom_depose_visa}</td>
                <td className="td">{folder.reference}</td>
                <td className="td">
                    <MdEdit className="action-icon icon color__icon-edit" title="Modifier" onClick={() => handleOpenModal(folder._id, 'edit')} />
                    <MdDelete className="action-icon icon color__icon-delete" title="Delete" onClick={() => handleDeleteClick(folder._id)} />
                    <MdVisibility className="action-icon icon color__icon-visible" title="Read" onClick={() => handleReadClick(folder._id)} />
                </td>
            </tr>
        ));
    };

    const searchTable = () => {
        const searchInput = searchRef.current;
        const table = tableRef.current;
        const tableRows = table.querySelectorAll('tbody tr');
        tableRows.forEach((row, i) => {
            let search_data = searchValue.toLowerCase();
            let table_data = '';

            if (searchType === 'nom') {
                table_data = row.querySelectorAll('td')[1].textContent.toLowerCase();
            } else if (searchType === 'prenom') {
                table_data = row.querySelectorAll('td')[2].textContent.toLowerCase();
            } else if (searchType === 'numero') {
                table_data = row.querySelectorAll('td')[0].textContent.toLowerCase();
            } else if (searchType === 'reference') {
                table_data = row.querySelectorAll('td')[3].textContent.toLowerCase();
            }

            row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
            row.style.setProperty('--delay', i / 25 + 's');
        });

        document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
            visible_row.style.backgroundColor = (i % 2 === 0) ? '--second-bg' : '--second-bg';
            visible_row.style.animationDelay = `${i * 0.1}s`;
        });
    }

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
                            <ContentToPrintVisa folders={folders?.data} />
                        </div>
                    </div>
                    <section className="table__header">
                        <select className='searchByeverything' value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                            <option value="nom">Recherche par nom</option>
                            <option value="prenom">Recherche par prénom</option>
                            <option value="numero">Recherche par numéro</option>
                            <option value="reference">Recherche par reference</option>
                        </select>
                        <div className="input-group">
                            <input type="search"
                                placeholder="Recherche donnée..."
                                ref={searchRef}
                                onChange={(e) => setSearchValue(e.target.value)} />
                            <img src={search} alt="Search Icon" />
                        </div>
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
                        <table className='table'>
                            <thead className='thead'>
                                <tr>
                                    <th className='th'>Numéro </th>
                                    <th className='th'>Nom </th>
                                    <th className='th'>Prénom </th>
                                    <th className='th'>Référence </th>
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
                            <VisaModal
                                open={modalOpen}
                                handleClose={handleCloseModal}
                                folderId={selectedFolderId} // Passer l'ID du courrier à la modale
                                mode={mode} // Passer le mode à la modale
                                onSuccess={refetch}
                            />
                        )}
                    </AnimatePresence>
                    <AlertDialogSlideVisa open={alertOpen} setOpen={setAlertOpen} folderId={deleteFolderId} onSuccess={refetch} />
                    <CustomizedVisaDialogs open={alertOpenRead} setOpen={setAlertOpenRead} folderId={readFolderId} />
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
                {/* Affichage du nombre total d'items */}
                {displayTotalItems()}

            </div>
        </>
    )
}

export default TableVisa

