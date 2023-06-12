import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import HeaderClient from "./client_comps/misc/headerClient";

import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Page404 from "./comps_general/page404";
import Footer from "./client_comps/misc/footer";
import Sidebar from "./client_comps/misc/sidebar";
import UserAuth from "./comps_general/authClient";
import UpdateLevel from "./comps_general/updateLevel";
import AdminHeader from "./admin_comps/misc/adminHeader";
import CategoryContext from "./comps_general/categoryContext";
import CategoryProvider from "./comps_general/categoryContext";
import { adminRoutes, clientRoutes } from "./routesPath/routesPath";
import { useContext } from "react";
import { AuthContext } from "./context/createContext";

function App() {

  const { user, admin } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <UserAuth>
        <CategoryProvider>
          <UpdateLevel>
            <Routes>
              {user && admin ?
                <Route path="/admin/*" element={<AdminHeader />} />
                : 
              <Route path="/*" element={
                <>
                  <HeaderClient />
                  {/* <Sidebar /> */}
                </>
              } />
            }
            </Routes>
            <main>
              <Routes>
                {clientRoutes()}
                {user && admin ?
                adminRoutes()
                :''
              }
                <Route path="/*" element={<Page404 />} />

              </Routes>
            </main>
            <Routes>
              <Route path="/*" element={<Footer />
              } />
            </Routes>

            {/* The toast messages added here */}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
          </UpdateLevel>
        </CategoryProvider>
      </UserAuth>
    </BrowserRouter>
  );
}

export default App;
