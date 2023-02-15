import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import AdminHeader from "./admin_comps/adminHeader";
import HeaderClient from "./client_comps/misc/headerClient";

import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { adminRoutes, clientRoutes } from "./routesPath/routesPath";
import Page404 from "./comps_general/page404";
import Footer from "./client_comps/misc/footer";

function App() {
  return (
    <BrowserRouter>
      {/* Routes of header what to show client or admin header... */}
      <Routes>
        <Route path="/admin/*" element={<AdminHeader />} />
        <Route path="/*" element={<HeaderClient />} />
      </Routes>
      <main>
        <Routes>
          {/* client */}
          {/* לא יכלנו לזמן כקומפנינטה מכיוון שראוטס
        מצפה שבתוכו יגיע ישירות ריאקט פרגמט או ראוט
        אבל כן אפשר לעשות פונקציה שמחזיר קומפנינטות */}
          {clientRoutes()}
          {adminRoutes()}
          <Route path="/*" element={<Page404 />} />
        </Routes>
      </main>
      {/* The toast messages added here */}
      <ToastContainer position="top-left" theme="colored" />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
