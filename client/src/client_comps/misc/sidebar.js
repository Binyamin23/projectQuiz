import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cat, setCat] = useState("");
  const nav = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const changeCategory = (e) => {
    nav(`category/${e.target.value}/level/1`);
    setCat(e.target.value);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Add this line
  };
  
  useEffect(() => {
    if (location.pathname === "/") {
      setCat("c");
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Add this line
    }
  }, [location]);

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
          <select onChange={changeCategory} value={cat}>
            <option value={"c"}>C</option>
            <option value={"java"}>Java</option>
            <option value={"js"}>Javascript</option>
          </select>
        </li>
        <br />
        <li className='li-level'>Level</li>
        <Link onClick={toggleSidebar} to={`/category/${cat}/level/1`} className='li'>1</Link>
        <Link onClick={toggleSidebar} to={`/category/${cat}/level/2`} className='li'>2</Link>
        <Link onClick={toggleSidebar} to={`/category/${cat}/level/3`} className='li'>3</Link>
      </ul>
    </div>
  );
};

export default Sidebar;
