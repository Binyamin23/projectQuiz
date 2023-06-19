import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { TOKEN_KEY } from '../../services/apiService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie } from '@fortawesome/free-solid-svg-icons'
import './HeaderClient.css'
import { useContext, useEffect, useState } from 'react';
import useWindowWidth from '../../comps_general/useWidth';
import { AuthContext, LevelContext } from '../../context/createContext';


export default function HeaderClient() {

  const { user, admin, setUser, setAdmin, userObj } = useContext(AuthContext);
  const { cat, level, setCat, setLevel } = useContext(LevelContext);
  let width = useWindowWidth();

  const nav = useNavigate();
  const [toggle, setToggle] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileList, setIsMobileList] = useState(window.innerWidth <= 767)
  //const [isLoggedIn, setIsLoggedIn] = useState(localStorage["apps_tok"] != null);

  const handleResize = () => {
    setIsMobileList(window.innerWidth <= 767);
    if (window.innerWidth > 767) {
      setToggle(false);
      setShowDropdown(false);
    }
  };

  // Add event listener for window resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onLogOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(false)
    setAdmin(false)
    toast.info("You logged out, see you soon!");
    setCat("c")
    setLevel(1)
    nav("/")
  }

  return (
    <header className="container-fluid bg-dark-subtle p-2 shadow">
      <div className="container">
        <div className="row position-relative align-items-center">

          {/* Logo */}
          <div className='col-6 col-sm-9 col-md-2'>
            <Link to="/" onClick={() => {
              setCat("c");
              setLevel(1);
            }}>
              <img className='logo' src={'https://res.cloudinary.com/dg4sxlbfs/image/upload/v1684913391/logoQuiz_c88ool.png'} />
            </Link>
          </div>

          {/* Menu Icon */}
          <div className="toggle col-auto text-end d-md-none ms-auto">
            <svg onClick={() => setToggle(!toggle)} xmlns="http://www.w3.org/2000/svg" width="36px" height="36px" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
            </svg>
          </div>

          {/* Menu List */}
         
            <div className='menu col-md-6'  style={{ display: (isMobileList && !toggle) ? "none" : "block" }}>
              <ul className=''>
                <li className='me-2'><Link className='lli btn btn-outline-primary' to="/">Home</Link></li>
                <li className='me-2'><Link className='lli btn btn-outline-primary' to="/scores">Scores</Link></li>
                <li className='me-2'><Link className='lli btn btn-outline-primary' to="/favs">Favs</Link></li>
                <li className='me-2'><Link className='lli btn btn-outline-primary' to="/about">About</Link></li>
                {admin &&
                  <li className='me-2'><Link className='lli btn btn-outline-primary' to="/admin/categories">Admin</Link></li>}
              </ul>
            </div>

          {/* Log in/out and User Icon */}
          <div className='col-auto col-md-4 text-end d-flex align-items-center justify-content-end'>
            {!isMobileList && !user && !admin &&
              <ul className=' me-2'>
                <li className=' me-2'><Link className='lli btn btn-outline-primary' to="/login">Log in</Link></li>
                <li className=''><Link className='lli btn btn-outline-primary' to="/signup">Sign up</Link></li>
              </ul>
            }

            {(user || admin) &&
              <button onClick={onLogOut} className='btn btn-outline-primary' >Log out</button>
            }
            <ul className='col-auto fixed-end user-icon'>
              {userObj && userObj.img_url
                ? <img src={userObj.img_url} className='user-image' />
                : <FontAwesomeIcon icon={faUserTie} className='fa-duo' onClick={() => setShowDropdown(!showDropdown)} />}

              {isMobileList && showDropdown && !user && !admin ? (

                <div className="dropdown rounded-2">
                  <ul>
                    <li>
                      <Link onClick={() => setShowDropdown(!showDropdown)} to="/login">Log in</Link>
                      |
                      <Link onClick={() => setShowDropdown(!showDropdown)} to="/signup">Sign up</Link>
                    </li>
                  </ul>
                </div>
              )
                : isMobileList && showDropdown &&
                <div className="dropdown border rounded-2">
                  <ul>
                    <li>
                      <Link onClick={() => {
                        setShowDropdown(!showDropdown)
                        onLogOut()
                      }}>Log out</Link>
                    </li>

                  </ul>
                </div>
              }

            </ul>
          </div>
        </div>
      </div>
    </header >
  )
}