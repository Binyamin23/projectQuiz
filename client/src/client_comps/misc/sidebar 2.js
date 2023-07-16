import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import './Sidebar.css';
import { AuthContext, LevelContext } from '../../context/createContext';
import { toast } from 'react-toastify';
import { API_URL, doApiGet } from '../../services/apiService';

const Sidebar = () => {
  
  const [isOpen, setIsOpen] = useState(false);
  const nav = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { user, admin, setUser, setAdmin } = useContext(AuthContext);
  const { cat, setCat, level, setLevel } = useContext(LevelContext);
  const [categories, setCategories] = useState([]);

  const toggleSidebarClose = (newLevel) => {
    if (user || admin || newLevel == 1) {
      nav(`/category/${cat}/level/${newLevel}`);
    } else {
      toast.info('Please log in or sign up to access this level.');
      nav('/signup')
    };
    setIsOpen(!isOpen)
  };


  const toggleSidebarOpen = () => {
    setIsOpen(!isOpen)
  }

  const changeCategory = (e) => {
    const selectedCat = e.target.value;
    nav(`/category/${selectedCat}/level/1`);
    setCat(selectedCat);
    setLevel(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  useEffect(() => {
    doApi();
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      setCat('c');
    }
  }, [location, setCat]);


  const handleLevelClick = async (newLevel) => {
    await setLevel(newLevel);
    nav(`/category/${cat}/level/${newLevel}`);
    toggleSidebarClose(newLevel);
  }

  const doApi = async () => {
    try {
      let url = API_URL + "/categories/all";
      let data = await doApiGet(url);
      console.log("cats sidebar:", data);
      setCategories(data)
    }
    catch (err) {
      console.log(err)
      alert("There's a problem, please try again later.")
    }
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="sidebar-toggle" onClick={toggleSidebarOpen}>
        {isOpen ? (
          <FontAwesomeIcon className='arrows' size='lg' icon={faCircleArrowLeft} />)
          : (
            <FontAwesomeIcon className='arrows' size='lg' icon={faCircleArrowRight} />
          )}
      </button>
      <ul className="sidebar-menu">
        <li>
          <select onChange={changeCategory} value={cat}>
            {categories.map((category) => (
              <option key={category._id} value={category.url_code} >{category.name}
              </option>
            ))}
          </select>
        </li>
        <br />
        <li className='li-level'>Level</li>
        <Link onClick={() => handleLevelClick(1)} className='li'>1</Link>
        <Link onClick={() => handleLevelClick(2)} className='li'>2</Link>
        <Link onClick={() => handleLevelClick(3)} className='li'>3</Link>
      </ul>
    </div>
  );
};

export default Sidebar;
