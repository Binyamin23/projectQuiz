import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/createContext';
import { API_URL, doApiGet } from '../services/apiService';


const UserAuth = ({ children }) => {

    const [user, setUser] = useState(false);
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
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
            }
        }
        catch (err) {
            setUser(false)
            setAdmin(false)


        }
    }

    return (
        <AuthContext.Provider value={{ user, admin, setUser, setAdmin }}>
            {children}
        </AuthContext.Provider>
    )
}

export default UserAuth