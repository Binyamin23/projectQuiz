import React from 'react'
import CategoriesClientList from './home/categoriesClientList'
import NewGamesList from './home/newGamesList'
import Strip from './home/strip'
import "./home/home.css"
import { Navbar } from 'react-bootstrap'
import MyNavbar from './misc/navbar'

export default function Home() {
  return (
    <React.Fragment>
      <main className='container'>
        <MyNavbar/>
      </main>
    </React.Fragment>
  )
}
