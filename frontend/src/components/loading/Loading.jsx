import React from 'react';
import './loading.scss';

// import loaderGif from '../../assets/images/load.gif';
import Loader_3 from '../loader/Loader_3';


const Loading = () => {
    return (
        <>
        <div className="loading__container">
            {/* <img src={loaderGif} alt="Loading" className="loader" /> */}
            <Loader_3 />
        </div>
        </>
    );
};

export default Loading;