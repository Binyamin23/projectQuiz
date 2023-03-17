import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? (
          <i className="fas fa-arrow-left"></i>
        ) : (
          <i className="fas fa-arrow-right"></i>
        )}
      </button>
      <ul className="sidebar-menu">
        <li>
          <select>
            <option>C</option>
            <option>Java</option>
            <option>Javascript</option>
          </select>
        </li>
        <br />
        <li className='li-level'>Level</li>
        <li className='li'>1</li>
        <li className='li'>2</li>
        <li className='li'>3</li>
      </ul>
    </div>
  );
};

export default Sidebar;
