import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { TOKEN_KEY } from '../../services/apiService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie } from '@fortawesome/free-solid-svg-icons'
import './HeaderClient.css'
import logo from '../../images/logo.png'
import { useContext, useState } from 'react';
import useWindowWidth from '../../comps_general/useWidth';
import { AuthContext } from '../../context/createContext';


export default function HeaderClient() {
  const { user, setUser } = useContext(AuthContext);

  let width = useWindowWidth();

  const nav = useNavigate();
  const [isMobile, setIsMobile] = useState(width < 500);
  const [showDropdown, setShowDropdown] = useState(false);
  //const [isLoggedIn, setIsLoggedIn] = useState(localStorage["apps_tok"] != null);

  const onLogOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(false)
    toast.info("You logged out, see you soon!");
    nav("/")
  }

  

  return (
    <header className="container-fluid bg-dark-subtle p-2 shadow ">
      <div className="container">
        <div className="row align-items-center">
          <div className='col-auto'>
            <Link className='li' to="/">
              <img className='logo' src={logo} />
            </Link>
          </div>
          <div className='col row align-items-center justify-content-between'>
            <ul className='col-auto menu'>
              <li><Link className='li p-2' to="/userGameList">Scores</Link></li>
              <li><Link className='li p-2' to="/favs">Favs</Link></li>
              {/* <li><Link to="/">Apps</Link></li>
              <li><Link to="/">Users</Link></li> */}
            </ul>

            {!isMobile ?
              !user ?
                <ul className='col-auto '>
                  <li><Link className='li' to="/login">Log in</Link></li>
                  <li><Link className='li' to="/signup">Sign up</Link></li>
                </ul> :
                ''

              : ''
            }

          </div>
          <ul className='col-auto fixed-end user-icon'>
            {user ?
              <button onClick={onLogOut} className='btn btn-logout m-0' >Log out</button>
              : ''
            }
            <FontAwesomeIcon icon={faUserTie} className='fa-duo' onClick={() => setShowDropdown(!showDropdown)} />
            {isMobile && showDropdown && (
              <div className="dropdown border rounded-2">
                <ul>
                  <li>
                   <Link onClick={()=>setShowDropdown(!showDropdown)}  to="/login">Log in</Link>
                   |
                    <Link onClick={()=>setShowDropdown(!showDropdown)}  to="/signup">Sign up</Link>
                  </li>
                </ul>
              </div>
            )}


          </ul>
        </div>
      </div>
    </header>
  )
}