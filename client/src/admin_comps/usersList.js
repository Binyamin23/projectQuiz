import React, { useEffect, useState } from 'react';
import { API_URL, doApiGet, doApiMethod } from '../services/apiService';
import AuthAdmin from './authAdmin';
import Table from 'react-bootstrap/Table';
import './userList.css'

export default function UsersList() {
  const [ar, setAr] = useState([]);

  useEffect(() => {
    doApi();
  }, [])

  const doApi = async () => {
    let url = API_URL + "/users/allUsers";
    try {
      let data = await doApiGet(url);
      console.log(data);
      setAr(data)
    }
    catch (err) {
      console.log(err)
      alert("There problem , come back late")
    }
  }

  const onChangeRole = async (_id, _role) => {
    let newRole = _role == "admin" ? "user" : "admin";
    let url = `${API_URL}/users/role/?user_id=${_id}&role=${newRole}`;
    try {
      let data = await doApiMethod(url, "PATCH");
      console.log(data);

      if (data.modifiedCount == 1) {
        doApi();
      }
    }
    catch (err) {
      console.log(err)
      alert("You cant change yourself or the admin")
    }
  }

  return (
    <div className='container' style={{ maxWidth: "100%", overflowX: "hidden" }}>
      <AuthAdmin />
      <h1 className='m-3'>List of Users in the system</h1>

      <div className="table-responsive">
        <Table striped bordered hover variant="dark" style={{ borderRadius: '30px', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {ar.map((item, i) => {
              let myDate = item.date_created.substring(0, 10);
              return (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <button className={`btn ${item.role == "admin" ? "btn-warning" : "btn-light"}`} onClick={() => { onChangeRole(item._id, item.role) }}>
                      {item.role}
                    </button>
                  </td>
                  <td>{myDate}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    </div>
  )
}
