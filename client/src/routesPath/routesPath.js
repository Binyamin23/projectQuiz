import React from "react"
import { Route } from "react-router-dom"
import AddCategory from "../admin_comps/addCategory"
import AppListAdmin from "../admin_comps/appsListAdmin"
import CategoriesList from "../admin_comps/categoriesList"
import EditCategory from "../admin_comps/editCategory"
import LoginAdmin from "../admin_comps/loginAdmin"
import TestUpload from "../admin_comps/testUpload"
import UsersList from "../admin_comps/usersList"
import FavsGameList from "../client_comps/pageGamesList/favsGamesList"
import Login from "../client_comps/userPages/login"
import Signup from "../client_comps/userPages/signup"
import CatQuiz from "../client_comps/pageGamesList/catQuiz"

// פו
export const clientRoutes = () => {
  return(
    <React.Fragment>
       <Route path="/" element={<CatQuiz />} />
       <Route path="/test" element={<h2>Test 4444</h2>} />
       <Route path="/category/:catName/level/:level" element={<CatQuiz/>} />
        <Route path="/favs" element={<FavsGameList />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
  
    </React.Fragment>
  )
}

export const adminRoutes = () => {
  return(
    <React.Fragment>
      <Route path="/admin" element={<LoginAdmin />} />
        <Route path="/admin/categories" element={<CategoriesList />} />
        <Route path="/admin/categories/new" element={<AddCategory />} />
        <Route path="/admin/categories/edit/:id" element={<EditCategory />} />
        <Route path="/admin/apps" element={<AppListAdmin />} />
        <Route path="/admin/users" element={<UsersList />} />
        <Route path="/admin/test" element={<TestUpload />} />
    </React.Fragment>
  )
}