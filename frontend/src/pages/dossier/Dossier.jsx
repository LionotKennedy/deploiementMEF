import React, { useEffect } from 'react'
import TableResponsive from '../../components/table/TableResponsive'
import "./dossier.scss"
import AOS from 'aos';
import 'aos/dist/aos.css';


const Dossier = () => {

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  return (
    <div className="container__dossier">
      <div className='title_corrier' data-aos="slide-down">
        <span>Courrier</span>
      </div>
      <div className="row" data-aos="slide-down">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <TableResponsive />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dossier
