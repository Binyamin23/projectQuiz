import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { TOKEN_KEY } from '../../services/apiService'


export default function HeaderClient() {

  const nav = useNavigate();

  const onLogOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    toast.info("You logged out, see you soon!");
    nav("/")
  }

  return (
    <header className="container-fluid bg-warning p-2 shadow">
      <div className="container">
        <div className="row align-items-center">
          <div className='logo col-auto'>
            <h2>Logo</h2>
          </div>
          <div className='col row align-items-center justify-content-between'>
            <ul className='col-auto'>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/userGameList">My Apps</Link></li>
              <li><Link to="/favs">My Favs</Link></li>
              {/* <li><Link to="/">Apps</Link></li>
              <li><Link to="/">Users</Link></li> */}
            </ul>
            {!localStorage["apps_tok"] ?
              <ul className='col-auto'>
                <li><Link to="/login">Log in</Link></li>
                <li><Link to="/signup">Sign up</Link></li>
              </ul> :
              <ul className='col-auto'>
                <li>
                  <button onClick={onLogOut} className='btn btn-outline-dark' >Log out</button>
                </li>
                
              </ul>
            }
          </div>
        </div>
      </div>
    </header>
  )
}
