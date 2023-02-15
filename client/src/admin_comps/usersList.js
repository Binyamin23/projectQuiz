import React, { useEffect, useState } from 'react'
import { API_URL, doApiGet, doApiMethod } from '../services/apiService';
import AuthAdmin from './authAdmin'

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

  const onChangeRole = async(_id,_role) => {
    let newRole = _role == "admin" ? "user" : "admin";
    let url = `${API_URL}/users/role/?user_id=${_id}&role=${newRole}`;
    try{
      let data = await doApiMethod(url, "PATCH");
      console.log(data);
      
      if(data.modifiedCount == 1){
        // alert("app/game deleted");
        doApi();
      }
    }
    catch(err){
      console.log(err)
      alert("You cant change yourself or the admin")
    }
  }

  return (
    <div className='container'>
      <AuthAdmin />
      <h1>List of Users in the system</h1>
      <table className='table table-striped table-hover'>
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
          {ar.map((item,i) => {
            let myDate = item.date_created.substring(0,10);
            // myDate = myDate.replaceAll("T"," ")
            return (
              <tr key={item._id}>
                <td>{i+1}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                {/* דואג שאדמינים יהיו עם רקע צהוב בכפתורים */}
                <td><button className={item.role == "admin" ? "bg-warning" : ""} onClick={() => {onChangeRole(item._id,item.role)}}>{item.role}</button></td>
                <td>{myDate}</td>
              
              </tr>
            )
          })}
        </tbody>
      </table>
      
    </div>
  )
}
