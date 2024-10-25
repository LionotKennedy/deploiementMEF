import React from 'react'
import "./visa.scss"
import TableVisa from '../../components/table/TableVisa';
import 'aos/dist/aos.css';

const Visa = () => {
  return (
    <div className='rowc container__visa'>
      <div className='title_visa' data-aos="slide-down">
        <span>Visa</span>
      </div>
      <div className="row" data-aos="fade-down">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <TableVisa />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Visa
