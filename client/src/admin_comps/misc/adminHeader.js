import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/createContext';
import Loading from '../../comps_general/loading';

export default function AdminHeader() {

  const { user, admin } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    if (user && admin) {
      setLoading(false);
    }
    else {
      nav("/")
    }
  }, [])

  return (
    <>
      {!loading ?
        <header className="container-fluid bg-info p-2">
          <div className="container">
            <div className="align-items-center">
              <div className='logo'>
                <h2 className='text-dark'>Admin</h2>
              </div>
              <div className='logo m-0 p-0'>
                <h2 style={{ cursor: "pointer" }} className='text-dark' onClick={() => nav('/')}>Quiz</h2>
              </div>
              <div className='col-auto'>
                <ul>
                  <li><Link to="/admin/categories">Categories</Link></li>
                  <li><Link to="/admin/questions">Questions</Link></li>
                  <li><Link to="/admin/users">Users</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </header >
        : ''
      }
    </>
  )
}
