import React, { useContext } from "react"
import { Route } from "react-router-dom"
import UsersList from "../admin_comps/users/usersList"
import CatQuiz from "../client_comps/quiz/catQuiz"
import Login from "../client_comps/userPages/login"
import FavoritesPage from "../client_comps/quiz/favsGamesList"
import PrivacyPolicy from "../client_comps/userPages/privacyPolicy"
import Signup from "../client_comps/userPages/signup"
import ScoresOverview from "../client_comps/quiz/scores"
import CategoriesList from "../admin_comps/categories/categoriesList"
import QuestionsList from "../admin_comps/questions/questions"
import AddCategory from "../admin_comps/categories/addCategory"
import EditCategory from "../admin_comps/categories/editCategory"
import ForgotPassword from "../client_comps/userPages/forgotPassword.js"
import ResetPassword from "../client_comps/userPages/resetPassword"
import { AuthContext } from "../context/createContext"
import Loading from "../comps_general/loading"

export const clientRoutes = () => {
  return (
    <React.Fragment>
      <Route path="/" element={<CatQuiz />} />
      <Route path="/category/:catName/level/:level" element={<CatQuiz />} />
      <Route path="/favs" element={<FavoritesPage />} />
      <Route path="/scores" element={<ScoresOverview />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path='/forgotPassword' element={<ForgotPassword />} />
      <Route path='/resetPassword' element={<ResetPassword />} />

    </React.Fragment>
  )
}

export const adminRoutes = () => {

  return (

    <React.Fragment>
      <Route path="/admin/categories" element={<CategoriesList />} />
      <Route path="/admin/categories/new" element={<AddCategory />} />
      <Route path="/admin/categories/edit/:id" element={<EditCategory />} />
      <Route path="/admin/questions" element={<QuestionsList />} />
      <Route path="/admin/users" element={<UsersList />} />
    </React.Fragment>

  )
}