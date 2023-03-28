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
  const [cat, setCat] = useState(params['catName'] || 'c');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const changeCategory = (e) => {
    const selectedCat = e.target.value;
    nav(`/category/${selectedCat}/level/1`);
    setCat(selectedCat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }, [location]);



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
          <select key={cat} onChange={changeCategory}>
            <option value="c" selected={cat === "c"}>C</option>
            <option value="java" selected={cat === "java"}>Java</option>
            <option value="js" selected={cat === "js"}>Javascript</option>
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
