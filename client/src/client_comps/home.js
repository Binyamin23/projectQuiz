import React from 'react'
import CategoriesClientList from './home/categoriesClientList'
import NewGamesList from './home/newGamesList'
import Strip from './home/strip'
import "./home/home.css"
import Sidebar from './misc/sidebar'

export default function Home() {
  return (
    <div style={{position:"relative"}}>      
      <Sidebar />
    </div>
    )
}
