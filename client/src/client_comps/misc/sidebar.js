import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const nav = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [cat, setCat] = useState(() => {
    return localStorage.getItem('selectedCat') || 'c';
  });
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const changeCategory = (e) => {
    const selectedCat = e.target.value;
    nav(`/category/${selectedCat}/level/1`);
    setCat(selectedCat);
    localStorage.setItem('selectedCat', selectedCat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  

  useEffect(() => {
    if (location.pathname === "/") {
      setCat("c")
    }
  }, [location, params['catName']]);


  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? (
          <FontAwesomeIcon className='arrows' size='lg' icon={faCircleArrowLeft} />)
          : (
            <FontAwesomeIcon className='arrows' size='lg' icon={faCircleArrowRight} />
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
        <li>value:{params['catName']}</li>
        <Link onClick={toggleSidebar} to={`/category/${localStorage.getItem('selectedCat')}/level/1`} className='li'>1</Link>
        <Link onClick={toggleSidebar} to={`/category/${localStorage.getItem('selectedCat') }/level/2`} className='li'>2</Link>
        <Link onClick={toggleSidebar} to={`/category/${cat}/level/3`} className='li'>3</Link>
      </ul>
    </div>
  );
};

export default Sidebar;
