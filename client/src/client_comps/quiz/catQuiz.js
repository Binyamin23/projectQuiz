import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { API_URL, doApiGet } from '../../services/apiService';
import Quiz from './mainQuiz';

import './catQuiz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowDown } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/createContext';

export default function CatQuiz() {
  const params = useParams();

  const [cat, setCat] = useState(params['catName'] || 'c');
  const [level, setLevel] = useState(params['level'] || 1);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState({});
  const { user, setUser } = useContext(AuthContext);

  const location = useLocation();


  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setCat(params['catName'] || 'c');
  }, [params['catName']]);

  useEffect(() => {
    setLevel(params['level'] || 1);
  }, [params['level']]);


  useEffect(() => {
    fetchCats();
    fetchQuestions();
  }, [cat]);

  useEffect(() => {
    fetchQuestions();
  }, [level]);

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
      if (!user) {
        data = await doApiGet(API_URL + `/questions/levelOne/category/${cat}`);
        setQuestions(data);
        setLoading(false);
      }
      else {
        data = await doApiGet(API_URL + `/questions/?cat=${cat}&level=${level}`);
        setQuestions(data);
        setLoading(false);
      }
      console.log("quizCat - questions", data);
    } catch (err) {
      console.log(err);
    }
  };

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
