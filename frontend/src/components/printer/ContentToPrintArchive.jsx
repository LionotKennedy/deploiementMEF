import React from 'react'

const ContentToPrintArchive = ({ archives }) => {
    if (!archives || archives.length === 0) {
        return <div>No data available to print</div>;
    }
    // console.log(archives);
    return (
        <div>
            <h1>Folder Data Report</h1>
            <table id='table__archive' style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        <th style={styles.th}>Numéro</th>
                        <th style={styles.th}>Date Départ</th>
                        <th style={styles.th}>Expéditeur</th>
                        <th style={styles.th}>Destination</th>
                        <th style={styles.th}>Nom</th>
                        <th style={styles.th}>Prénom</th>
                        <th style={styles.th}>Matricule</th>
                        <th style={styles.th}>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {archives.map((archive, index) => (
                        <tr key={index}>
                            <td style={styles.td}>{archive.numero_bordereaux}</td>
                            {/* <td style={styles.td}>{new Date(archive.date_depart).toLocaleDateString()}</td> */}
                            <td className="td">
                                {(() => {
                                    const date = new Date(archive.date_depart);
                                    const year = date.getFullYear();
                                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois de 0 à 11, donc on ajoute 1
                                    const day = String(date.getDate() + 1).padStart(2, '0'); // Ajouter un zéro devant si nécessaire
                                    return `${day}/${month}/${year}`;
                                })()}
                            </td>
                            <td style={styles.td}>{archive.expiditeur}</td>
                            <td style={styles.td}>{archive.destination}</td>
                            <td style={styles.td}>{archive.nom_depose}</td>
                            <td style={styles.td}>{archive.prenom_depose}</td>
                            <td style={styles.td}>{archive.matricule}</td>
                            <td style={styles.td}>{archive.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={styles.pageBreak}></div>
        </div>
    )
};
const styles = {
    th: {
        border: '1px solid black',
        padding: '5px',
        textAlign: 'center',
        backgroundColor: '#f2f2f2',
        fontSize: '12px',
    },
    td: {
        border: '1px solid black',
        padding: '5px',
        textAlign: 'center',
        wordWrap: 'break-word',
    },
    pageBreak: {
        pageBreakAfter: 'always',
    },
};

export default ContentToPrintArchive