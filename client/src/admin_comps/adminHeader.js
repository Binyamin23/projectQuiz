import React from 'react'
import { Link } from 'react-router-dom'

export default function AdminHeader() {
  return (
    <header className="container-fluid bg-info p-2">
      <div className="container">
        <div className="row align-items-center">
          <div className='logo col-auto'>
            <h2>Admin</h2>
          </div>
          <div className='col-auto'>
            <ul>
              <li><Link to="/admin/categories">Categories</Link></li>
              <li><Link to="/admin/apps">Apps</Link></li>
              <li><Link to="/admin/users">Users</Link></li>
              <li><Link to="/admin/test">Tests</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}
