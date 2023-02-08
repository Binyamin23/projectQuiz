import {BrowserRouter,Routes,Route} from "react-router-dom"
import CategoriesList from "./admin_comps/categoriesList";
import LoginAdmin from "./admin_comps/loginAdmin";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <header>
        header
      </header>
      <Routes>

        {/* admin */}
        <Route path="/admin" element={<LoginAdmin />} />
        <Route path="/admin/categories" element={<CategoriesList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
