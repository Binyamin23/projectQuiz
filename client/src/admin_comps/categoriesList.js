import React, { useContext, useEffect, useState } from 'react'
import { API_URL, doApiGet, doApiMethod } from '../services/apiService';
import { Link, useNavigate } from 'react-router-dom';
import AddPictureToCategory from './addImageCategory';
import { AuthContext } from '../context/createContext';


// delete option

// new categories

// TODO:Edit categories


export default function CategoriesList() {
  const [ar, setAr] = useState([]);
  const [showPictureComp, setPictureComp] = useState(false);
  const nav = useNavigate();
  const { user, admin, setUser, setAdmin } = useContext(AuthContext);


  useEffect(() => {
    if (admin) {
      doApi();
    } else {
      nav('/login');
    }
  }, [admin, nav]);

  const doApi = async () => {
    try {
      let url = API_URL + "/categories/all";
      let data = await doApiGet(url);
      console.log(data);
      setAr(data)
    }
    catch (err) {
      console.log(err)
      alert("There problem , come back late")
    }

  }

  const onXClick = async (_delId) => {
    let url = API_URL + "/categories/" + _delId;
    try {
      let data = await doApiMethod(url, "DELETE");
      if (data.deletedCount) {
        alert("Category deleted");
        doApi();
      }
    }
    catch (err) {
      console.log(err)
      alert("There problem , come back late")
    }

  }

  return (
    <div className='container'>
      {admin ?
        <>
          <h1>List of categories in system:</h1>
          <Link className='btn btn-info' to="/admin/categories/new">Add new category</Link>
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
              {ar.map((item, i) => {
                return (
                  <tr key={item._id}>
                    <td>{i + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.url_code}</td>
                    <td title={item.info}>{item.info.substring(0, 15)}...</td>
                    <td>
                      <button onClick={() => {
                        window.confirm("Delete item?") && onXClick(item._id)
                      }} className='bg-danger'>X</button>
                      <button onClick={() => {
                        nav("/admin/categories/edit/" + item._id)
                      }} className='bg-info ms-2'>Edit</button>
                      <button onClick={() => setPictureComp(true)}>img</button>
                      {showPictureComp ? <AddPictureToCategory categoryId={item._id} setPictureComp={setPictureComp} /> : ''}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
        : 'login...'
        }
    </div>
  )
}
