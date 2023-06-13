// Importing required dependencies and components
import { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { AuthContext } from '../../context/createContext';
import { doApiMethod, API_URL } from '../../services/apiService';

// Import CSS
import './favsCss.css'

// Main Favorites Page Function
function FavoritesPage() {

  // State variables
  const [starredQuestions, setStarredQuestions] = useState([]); // holds starred questions
  const { user, admin } = useContext(AuthContext); // user and admin context
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(null); // holds id of question to show answer for
  const [showModal, setShowModal] = useState(false); // controls modal visibility
  const [questionToDelete, setQuestionToDelete] = useState(null); // holds id of question to delete

  // Function to get user's favorite questions from API
  const getFavorites = async () => {
    if (user) {
      try {
        const data = await doApiMethod(`${API_URL}/users/favorites`, "GET");
        setStarredQuestions(data);
      } catch (error) {
        console.error("Error fetching user's favorites:", error);
      }
    }
  };

  // Function to delete a favorite question
  const deleteFavorite = async (questionId) => {
    if (user) {
      try {
        const data = await doApiMethod(`${API_URL}/users/removeFavorite`, "DELETE", {
          questionId: questionId
        });
        if (data.success) {
          getFavorites();
        }
      } catch (error) {
        console.error("Error deleting favorite:", error);
      }
    }
    setShowModal(false);
  };

  // Function to open the delete modal and set the question to be deleted
  const openModal = (questionId) => {
    setQuestionToDelete(questionId);
    setShowModal(true);
  };

  // Function to close the delete modal
  const closeModal = () => {
    setShowModal(false);
  };

  // UseEffect to get favorites when the component is mounted
  useEffect(() => {
    getFavorites();
  }, []);

  // If not a user or an admin, display only the message
  if (!user && !admin) {
    return (
      <div className="container my-4">
        <h2>My Starred Questions</h2>
        <p className="empty-message" style={{ fontSize: '24px' }}>
          Only signed up members can use this feature
        </p>
      </div>
    );
  }

  // Main return statement that renders the component
  return (
    <div className="container mt-0 p-5">
      {/* The delete modal */}
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
          <Button className='text-light' variant="" onClick={() => deleteFavorite(questionToDelete)} style={{ backgroundColor: 'rgba(60, 126, 250, 0.483)' }}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>

      <h2>My Starred Questions</h2>
      {starredQuestions.length > 0 ? (
        <div className="starred-questions-list mt-4">
          {starredQuestions.map((question, index) => (
            <div key={index} className="starred-question-item">
              <h5>
                {question.question} 
                <div className="btn-container p-2 mt-2">
                  <button onClick={() => openModal(question._id)}>Remove</button>
            
          
                  {showCorrectAnswer === question._id 
                    ? <button className='btn-answer' onClick={() => setShowCorrectAnswer(null)}>Hide Answer</button> 
                    : <button className='btn-answer' onClick={() => setShowCorrectAnswer(question._id)}>Show Answer</button>}

                </div>
              </h5>
              {showCorrectAnswer === question._id && <p>{question.answers[0]}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-message">No starred questions yet. You can star a question by clicking the star icon next to it.</p>
      )}
    </div>
  );
}

export default FavoritesPage;
