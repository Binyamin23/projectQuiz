import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext, FavoritesUpdateContext, LevelContext } from '../context/createContext';
import { API_URL, doApiGet } from '../services/apiService';


const UpdateLevel = ({ children }) => {
    const location = useLocation();
    const [cat, setCat] = useState('c');
    const [level, setLevel] = useState(1);

    const [favoritesUpdateFlag, setFavoritesUpdateFlag] = useState(false);

  
    useEffect(() => {
      const pathParts = location.pathname.split('/');
      const catFromUrl = pathParts[2];
      const levelFromUrl = pathParts[4];
    
      if (location.pathname === '/') {
        setCat('c');
        setLevel(1);
      } else if (!location.pathname.startsWith('/admin') && catFromUrl) {
        setCat(catFromUrl);
        if (levelFromUrl) {
          setLevel(levelFromUrl);
        }
      }
    }, [location]);
    
      
    return (
      <FavoritesUpdateContext.Provider value={{ favoritesUpdateFlag, setFavoritesUpdateFlag }}>
        <LevelContext.Provider value={{ cat, level, setCat, setLevel }}>
          {children}
        </LevelContext.Provider>
      </FavoritesUpdateContext.Provider>
    );
  };

export default UpdateLevel