import React, { useContext, useEffect, useState } from 'react'
import { API_URL, doApiGet, doApiMethod } from '../../services/apiService';
import { Link, useNavigate } from 'react-router-dom';
import {Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './categoriesList.css'
import useWindowWidth from '../../comps_general/useWidth';
import { AuthContext, selectedEditCategory } from '../../context/createContext';
import Row from './Row';


export default function CategoriesList() {

  const [ar, setAr] = useState([]);
  const { selectedCategory, setSelectedCategory } = useContext(selectedEditCategory);

  const [showPicture, setShowPicture] = useState(false);
  const nav = useNavigate();
  const { user, admin, setUser, setAdmin } = useContext(AuthContext);

  let width = useWindowWidth();
  const [isMobile, setIsMobile] = useState(width < 500);

  useEffect(() => {
    setIsMobile(width < 500);
  }, [width])

  useEffect(() => {
    console.log(selectedCategory)

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
    let url = API_URL + "/categories/delete/" + _delId;
    try {
      let data = await doApiMethod(url, "DELETE");
      if (data.deletedCount == 1) {
        toast.success("Category deleted");
        doApi();
      }
    }
    catch (err) {
      console.log(err)
      toast.error("There problem , come back later");
    }

  }



  return (
    <div className='container' style={{ maxWidth: "100%", overflowX: "hidden" }}>

      {admin ?
        <>
          <h1 className='m-3'>List of Categories</h1>

          <Link className="btn btn-outline-dark"
            to="/admin/categories/new">Add new category</Link>
          <Table className='table-cat' striped bordered hover variant="dark" style={{ borderRadius: '30px', marginTop: '20px' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>url_code</th>
                <th>info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ar.map((item) => {
                return (
                  <Row
                  key={item._id}
                    item={item}
                    onXClick={() => onXClick(item._id)}
                    setSelectedCategory={() => setSelectedCategory(item._id)}
                    setShowPicture={() => setShowPicture(true)}
                    selectedCategory={selectedCategory}
                    showPicture={showPicture}
                    isMobile={isMobile}
                  />)
              })}
            </tbody>
          </Table>
        </>
        : 'login...'
      }
    </div>
  )
}
