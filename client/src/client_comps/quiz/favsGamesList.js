import { useState, useEffect, useContext } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import axios from 'axios';
import { API_URL, doApiMethod } from '../../services/apiService';
import { FAVS_LOCAL_KEY, getLocal, removeIdFromLocal } from '../../services/localService';
import { useLocation } from 'react-router-dom';
import { AuthContext, FavoritesUpdateContext } from '../../context/createContext';
import { Modal, Button } from 'react-bootstrap';

import './favsCss.css'


function FavoritesPage() {
  const [starredQuestions, setStarredQuestions] = useState([]);
  const { user, admin } = useContext(AuthContext);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);



  const { favoritesUpdateFlag, setFavoritesUpdateFlag } = useContext(FavoritesUpdateContext);


  const [ar, setAr] = useState([]);
  const [favsLocal_ar, setFavsLocalAr] = useState(getLocal());

  const deleteQuestion = (_id) => {
    removeIdFromLocal(_id);
    setShowModal(false);
  };

  const openModal = (_id) => {
    setQuestionToDelete(_id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };



  useEffect(() => {
    if (user || admin) {
      doApi();
    }
  }, [favoritesUpdateFlag]);

  useEffect(() => {
    if (user || admin) {
      doApi();
    }  }, [favsLocal_ar]);

  useEffect(() => {
    if (!showModal) {
      setFavsLocalAr(getLocal());
    }
  }, [showModal]);


  const doApi = async () => {
    console.log(favsLocal_ar);
    let url = `${API_URL}/questions/favorites`;
    let data = await doApiMethod(url, "POST", { ids: favsLocal_ar });
    console.log(data);

    // sort the data array by cat_url in ascending order
    data.sort((a, b) => (a.cat_url > b.cat_url) ? 1 : -1);

    setAr(data);
  }


  if (!user && !admin) {
    return (
      <div className="container my-4">
        <h2>My Starred Questions</h2>
        <p className="empty-message" style={{ fontSize: '24px' }}>
          Only signed up memebers can use this feature              </p>
      </div>
    );
  }


  return (
    <div className="container mt-0 p-5">
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Remove Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this question from favorites?
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

      <h2>My Starred Questions</h2>
      {ar.length > 0 ? (
        <div className="starred-questions-list mt-4">
          {ar.map((question, index) => (
            <div key={index} className="starred-question-item">
              <h5>
                {question.cat_url === 'js' && <span className="badge badge-warning">Javascript</span>}
                {question.cat_url === 'c' && <span className="badge badge-success">C</span>}
                {question.cat_url === 'java' && <span className="badge badge-info">Java</span>}
                {question.question}
              </h5>
              <div className='mt-2'>
                <button onClick={() => setShowCorrectAnswer(showCorrectAnswer === index ? null : index)}>
                  {showCorrectAnswer === index ? 'Hide Answer' : 'Show Answer'}
                </button>
                {showCorrectAnswer === index && (
                  <p className="mt-2">Correct Answer: {question.answers[0]}</p>
                )}
                <button className="ml-3 m-2" onClick={() => openModal(question._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-message">You haven't starred any questions yet.</p>
      )}
    </div>
  );
}

export default FavoritesPage;