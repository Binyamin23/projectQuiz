import React, { useEffect, useState } from 'react';
import { Navbar, Button, Nav } from 'react-bootstrap';
import './Sidebar.css';

function Sidebar() {
  const [showNavbar, setShowNavbar] = useState(true);

  const handleToggleNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <div id='mainDiv'>
      {showNavbar ?
        <div className='bg-primary bg-opacity-75 h-100 rounded-end-2' style={{paddingTop:"70px"}}>
          <button className='btn p-2 border btn-primary m-1' style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: "0"}} onClick={handleToggleNavbar}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5ZM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5Z" />
            </svg>
          </button>
          <ul>
            <li>Menu 1</li>
            <li>Menu 2</li>
            <li>Menu 3</li>
          </ul>
        </div>
        : <button className='btn p-2 border btn-primary
          ' style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "0" }} onClick={handleToggleNavbar}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-bar-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8Zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5Z" />
          </svg>
        </button>

      }
    </div>
  );
}

export default Sidebar;