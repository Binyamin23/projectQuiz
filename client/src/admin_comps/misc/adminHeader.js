import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function AdminHeader() {
  const nav = useNavigate();

  return (
    <header className="container-fluid bg-info p-2">
      <div className="container">
        <div className="align-items-center">
          <div className='logo'>
            <h2 className='h2-no-margin'>Admin</h2>
          </div>
          <h2  style={{cursor:"pointer"}} className='h2-no-margin text-dark' onClick={() => nav('/')}>Quiz</h2>



          <div className='col-auto'>
            <ul>
              <li><Link to="/admin/categories">Categories</Link></li>
              <li><Link to="/admin/questions">Questions</Link></li>
              <li><Link to="/admin/users">Users</Link></li>
              <li><Link to="/admin/test">Tests</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </header >
  )
}
