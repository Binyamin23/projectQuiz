import React, { useContext, useEffect, useState } from 'react'
import { API_URL, doApiGet, doApiMethod } from '../../services/apiService';
import { Link, useNavigate } from 'react-router-dom';
import {Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './categoriesList.css'
import useWindowWidth from '../../comps_general/useWidth';
import { AuthContext, selectedEditCategory } from '../../context/createContext';
<<<<<<< HEAD
import Row from './Row';
=======
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
>>>>>>> 0975c0bd7e9fc34504ce30ee2f8f3faaf1678e83


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
<<<<<<< HEAD
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
=======
                  <tr key={item._id}>
                    <td>
                      {item.name}
                      {item._id == selectedCategory ?
                        <FontAwesomeIcon className='ms-3' icon={faCircleCheck} flip style={{ color: "#23d138", transition: 'background-color 3s' }} />
                        : ''
                      }
                    </td>
                    <td>{item.url_code}</td>
                    <td title={item.info}>{item.info.substring(0, 15)}...</td>
                    <td>
                      <Button variant='danger' className={isMobile ? 'w-100 mb-2' : 'm-2'} onClick={() => {
                        window.confirm("Delete item?") && onXClick(item._id)
                      }}>Delete</Button>
                      <Button variant='info' className={isMobile ? 'w-100 mb-2 text-light' : 'm-2 text-light'} onClick={() => {
                        setSelectedCategory(item._id);
                        nav("/admin/categories/edit/" + item._id);

                        // start a timer to reset both iconShown and selectedCategory after 5 seconds
                        const timerId = setTimeout(() => {
                          setSelectedCategory('');
                        }, 10000);

                        // clear the timer when the component unmounts
                        return () => {
                          clearTimeout(timerId);
                        }
                      }}>Edit</Button>
                      <Button style={isMobile ? { padding: "7.5%" } : {}} variant='secondary' className={isMobile ? 'w-100' : 'm-2'} onClick={() => {
                        if (selectedCategory != item._id) {
                          setSelectedCategory(item._id);
                          setShowPicture(true);
                        }
                        else {
                          if (selectedCategory === item._id) {
                            setShowPicture(true);
                          }
                          if (selectedCategory === item._id && showPicture) {
                            setShowPicture(false);

                          }

                        }
                      }}>Add Image</Button>
                      {showPicture && (selectedCategory === item._id) ? <AddPictureToCategory categoryId={item._id} setPictureComp={setSelectedCategory} /> : ''}
                    </td>
                  </tr>
                )
>>>>>>> 0975c0bd7e9fc34504ce30ee2f8f3faaf1678e83
              })}
            </tbody>
          </Table>
        </>
        : 'login...'
      }
    </div>
  )
}