import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/createContext';
import { API_URL, TOKEN_KEY, doApiGet } from '../services/apiService';

const UserAuth = ({ children }) => {

    const [user, setUser] = useState(localStorage.getItem(TOKEN_KEY) !== null);
    const [admin, setAdmin] = useState(false);
    const [userObj, setUserObj] = useState({}); // Add a new state variable for the user object

    const updateUserInfo = async () => {
        let url = API_URL + "/users/myInfo"
        try {
          let data = await doApiGet(url);
          setUserObj(data);
        
        }
        catch (err) {
          setUserObj(null);
        }
      }
      
      useEffect(() => { 
        updateUserInfo();     
        doApi();
            
      }, [user])

    

      
      const doApi = async () => {
        let url = API_URL + "/users/checkToken"
        try {
          let data = await doApiGet(url);
          if (data.role === "admin") {
            setAdmin(true)
           
          }
          else if (data.role === "user") {
            setUser(true)
            
          }
          else {
            setUser(false)
            setAdmin(false)
            setUserObj(null);
           
          }
        }
        catch (err) {
          setUser(false)
          setAdmin(false)
          setUserObj(null);
          
        }
      }

    return (
        <AuthContext.Provider value={{ user, admin, userObj, setUser, setAdmin, updateUserInfo   }}>
            {children}
        </AuthContext.Provider>
    )
}

export default UserAuth
