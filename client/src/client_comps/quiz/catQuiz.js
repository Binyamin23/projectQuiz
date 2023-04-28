import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { API_URL, TOKEN_KEY, doApiGet } from '../../services/apiService';
import Quiz from './mainQuiz';
import './catQuiz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowDown } from '@fortawesome/free-solid-svg-icons';
import { AuthContext, LevelContext } from '../../context/createContext';

export default function CatQuiz() {
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState({});
  const { cat, level } = useContext(LevelContext);
    const { user, admin, setUser, setAdmin } = useContext(AuthContext);

  const location = useLocation();

  const [questions, setQuestions] = useState([]);

  const fetchCats = async () => {
    try {
      const data = await doApiGet(API_URL + `/categories/byCode/${cat}`);
      setCategory(data);
    } catch (err) {
      console.log(err);
      setCategory({ img_url: '../../images/logo.png' }); //set default image URL or null
    }
  };

  const fetchQuestions = async () => {
    let data;
    try {
      if (!user && !admin) {
        data = await doApiGet(API_URL + `/questions/levelOne/category/${cat}`);
      } else {
        data = await doApiGet(API_URL + `/questions/?cat=${cat}&level=${level}`);
      }
      console.log("quizCat - questions", data);
      if (data && data.length > 0) {
        setQuestions(data);
        setLoading(false);
      } else {
        setLoading(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  

  useEffect(() => {
    fetchCats();
  }, [cat]);

  useEffect(() => {
    console.log("Cat:", cat, "Level:", level);
    fetchQuestions();
  }, [cat, level]);
  

  const handleArrowClick = () => {
    const welcomeElement = document.querySelector('.welcome-container');
    const rect = welcomeElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const top = rect.bottom + scrollTop;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className="container-fluid container-quiz" style={{ backgroundImage: `url(${API_URL + (category?.img_url || '../../images/logo.png')})` }}>
      <div className="welcome-container">
        <div className="inner-welcome">
          <h1 className="welcome-title">{category.name}</h1>
          <p className="welcome-info">{category.info}</p>
        </div>
        <div className="welcome-arrow-container" onClick={handleArrowClick}>
          <FontAwesomeIcon className='welcome-arrow' icon={faCircleArrowDown} />
        </div>
      </div>
      <div id="quiz-component" className="quiz-container">
        {!loading ? (
          <Quiz key={questions[0]._id} questions={questions} />
        ) : (
          'loading...'
        )}
      </div>
    </div>
  );
}
