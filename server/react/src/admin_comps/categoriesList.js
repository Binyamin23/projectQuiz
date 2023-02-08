import React, { useEffect, useState } from 'react'
import { API_URL, doApiGet } from '../services/apiService';
import AuthAdmin from './authAdmin';


// TODO: check that the user is admin

// TODO: delete option

// TODO:Add new categories

// TODO:Edit categories


export default function CategoriesList() {
  // TODO: show categories in tables
  const [ar, setAr] = useState([]);

  useEffect(() => {
    doApi();
  }, [])

  const doApi = async () => {
    try {
      let url = API_URL + "/categories";
      let data = await doApiGet(url);
      console.log(data);
      setAr(data)
    }
    catch (err) {
      console.log(err)
      alert("There problem , come back late")
    }

  }

  return (
    <div className='container'>
      <AuthAdmin />
      <h1>List of categories in system:</h1>
      <table className='table table-striped table-hover'>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>url_code</th>
            <th>info</th>
            <th>del/edit</th>
          </tr>
        </thead>
        <tbody>
          {ar.map((item,i) => {
            return (
              <tr key={item._id}>
                <td>{i+1}</td>
                <td>{item.name}</td>
                <td>{item.url_code}</td>
                <td>{item.info.substring(0,15)}...</td>
                <td>
                  <button className='bg-danger'>X</button>
                  <button className='bg-info ms-2'>Edit</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
