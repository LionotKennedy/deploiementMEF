
import React, { useEffect } from 'react';
import "./archivemore.scss";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import TableArchive from '../../components/table/TableArchive';
import { useGetArchiveByYear } from '../../services/serviceArchive';

const ArchiveMore = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { year } = location.state || {};

    const { data, isLoading, refetch, isError, error } = useGetArchiveByYear(year);

    const handleBackClick = () => {
        navigate('/archive');
    };

    useEffect(() => {
        if (refetch) refetch();
    }, [refetch]);

    if (isLoading) {
        return <p>Chargement des archives...</p>;
    }

    if (isError) {
        return <p>Erreur: {error.message}</p>;
    }

    return (
        <div className='container__archive-more' data-aos="slide-right">
            <div className='content__archive-more'>
                <div className='icon__back'>
                    <FaArrowLeft
                        className='back-icon'
                        onClick={handleBackClick}
                        size={24}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <div className='title__archive-more'>
                    <span>Détails de l'archive pour l'année {year}</span>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <TableArchive archives={data ? data.data : []} refetch={refetch} year={year} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArchiveMore;
