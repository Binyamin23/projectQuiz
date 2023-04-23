import { useState, useEffect } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import axios from 'axios';
import { API_URL, doApiMethod } from '../../services/apiService';
import { FAVS_LOCAL_KEY, getLocal, removeIdFromLocal } from '../../services/localService';
import { useLocation, useHistory} from 'react-router-dom';


function FavoritesPage() {
  const [starredQuestions, setStarredQuestions] = useState([]);

  const [ar, setAr] = useState([]);
  const [favsLocal_ar, setFavsLocalAr] = useState(getLocal());

  const deleteQuestion = (_id)=> {
    removeIdFromLocal(_id);
    doApi();
  }
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen(() => {
      doApi();
    });

    return () => {
      unlisten();
    };
  }, [history]);

  const doApi = async () => {

    // מביא את רשימת המשחקים של אותה קטגוריה
    console.log(favsLocal_ar);
    let url = `${API_URL}/questions/favorites`;
    let data = await doApiMethod(url, "POST", { ids: favsLocal_ar });
    console.log(data);
    setAr(data);
  }

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-3">My Starred Questions</h2>
      {ar.length > 0 ? (
        <ListGroup>
          {ar.map((question, index) => (
            <ListGroupItem key={index} className="bg-light">
              <h5 className="w-100 d-flex justify-content-between">
                {question.question}
                <button style={{height:"max-content"}} onClick={()=>deleteQuestion(question._id)} className="btn btn-danger p-0">Remove</button>
              </h5>
              <p>{question.answers[0]}</p>
              <p>{question.answers[1]}</p>
              <p>{question.answers[2]}</p>
              <p>{question.answers[3]}</p>
            </ListGroupItem>
          ))}
        </ListGroup>
      ) : (
        <p>You haven't starred any questions yet.</p>
      )}
    </div>
  );
}

export default FavoritesPage;
