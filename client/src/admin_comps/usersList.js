import React, { useEffect, useState } from 'react';
import { API_URL, doApiGet, doApiMethod } from '../services/apiService';
import AuthAdmin from './authAdmin';
import Table from 'react-bootstrap/Table';
import './userList.css'
import { toast } from 'react-toastify';
import useWindowWidth from '../comps_general/useWidth';
import { Button, Modal } from 'react-bootstrap';

export default function UsersList() {
  const [ar, setAr] = useState([]);
  let width = useWindowWidth();
  const [isMobile, setIsMobile] = useState(width < 500);
  const [showModal, setShowModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

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

  const onXClick = async (_delId) => {
   
    let url = API_URL + '/users/' + _delId;
    try {
      let data = await doApiMethod(url, 'DELETE');
      if (data.deletedCount) {
        toast.success('User deleted!');
        doApi();
      }
    } catch (err) {
      console.log(err);
      toast.error('You cant delete yourself or the super-admin');
    }
  };

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
      toast.error("You cant change yourself or the super-admin")
    }
  }

    const openModal = (_id) => {
    setQuestionToDelete(_id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const deleteQuestion = (_id) => {
    onXClick(_id);
    setShowModal(false);
  };

  return (
    <div className='container' style={{ maxWidth: "100%", overflowX: "hidden" }}>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Remove Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user from your database?
        </Modal.Body>
        <Modal.Footer>
          <Button className='text-light' variant="" onClick={closeModal} style={{ backgroundColor: 'rgba(60, 126, 250, 0.483)' }}>
            Cancel
          </Button>
          <Button className='text-light' variant="" onClick={() => deleteQuestion(questionToDelete)} style={{ backgroundColor: 'rgba(60, 126, 250, 0.483)' }}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>

      <AuthAdmin />
      <h1 className='m-3'>List of Users in the system</h1>
      <h2 className='text-dark m-3'>Total: {ar.length}</h2>

      <div className="table-responsive">
        <Table striped bordered hover variant="dark" style={{ borderRadius: '30px', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {ar.map((item, i) => {
              let myDate = item.date_created.substring(0, 10);
              return (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <button className={`btn ${item.role == "admin" ? "btn-warning" : "btn-light"}`} onClick={() => { onChangeRole(item._id, item.role) }}>
                      {item.role}
                    </button>
                    <button
                      onClick={() => {
                        openModal(item._id)
                      }}
                      className={isMobile ? 'w-100 mt-2 btn btn-danger' : 'm-2 btn btn-danger'}                     >
                      Delete
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
