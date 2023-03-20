import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/createContext';
import { API_URL, doApiGet } from '../services/apiService';


const UserAuth = ({children}) => {

    const [user, setUser] = useState(false);

    useEffect(() => {
        doApi();
    }, [user])

    const doApi = async () => {
        let url = API_URL + "/users/checkToken"
        try {
            let data = await doApiGet(url);
            if (data.role === "admin" || data.role === "user") {
                setUser(true)
            }
            else setUser(false)
        }
        catch (err) {
            setUser(false)
           
        }
    }

    return(
    <AuthContext.Provider value={{user, setUser}}>
        {children}
    </AuthContext.Provider>
    )
}

export default UserAuth