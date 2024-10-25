import React from 'react'

const ContentToPrintVisa = ({ folders }) => {
    if (!folders || folders.length === 0) {
        return <div>No data available to print</div>;
    }
    return (
        <div>
            <h1>Folder Data Report</h1>
            <table id='table_visa' style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        <th style={styles.th}>Numéro</th>
                        <th style={styles.th}>Nom</th>
                        <th style={styles.th}>Prénom</th>
                        <th style={styles.th}>Reference</th>
                    </tr>
                </thead>
                <tbody>
                    {folders.map((folder, index) => (
                        <tr key={index}>
                            <td style={styles.td}>{folder.numero_visa}</td>
                            <td style={styles.td}>{folder.nom_depose_visa}</td>
                            <td style={styles.td}>{folder.prenom_depose_visa}</td>
                            <td style={styles.td}>{folder.reference}</td>
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


export default ContentToPrintVisa