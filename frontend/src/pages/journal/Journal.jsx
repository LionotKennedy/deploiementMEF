
import React from 'react';
import "./journal.scss";
import TableJournal from '../../components/table/TableJournal';

const Journal = () => {

  return (
    <div>
      <h2 className="page-header">
      </h2>
      <div className='title__journal' data-aos="slide-down">
        <span>
        Journal des utilisateurs
        </span>
      </div>
      <div className="row" data-aos="fade-right">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <TableJournal />
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default Journal;
