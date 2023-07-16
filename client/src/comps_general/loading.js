
import React, { useEffect, useState } from 'react';
import './loadingButton.css'; // import any required CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Loading = () => {

  return (
    <>
      <div className='w-100 justify-content-center text-center'>
        <button className="submit-button border-0 bg-white p-5">
          <FontAwesomeIcon icon={faSpinner} className="spin" />
        </button>
      </div>
    </>
  );
};

export default Loading;