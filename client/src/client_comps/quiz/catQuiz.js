import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL, doApiGet } from '../../services/apiService';
import Quiz from './mainQuiz';

import './catQuiz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function CatQuiz() {
  const [cat, setCat] = useState('c');
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState({});

  const params = useParams();

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setCat(params['catName'] || 'c');
  }, [params['catName']]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchCats();
      await fetchQuestions();
    };
    fetchData();
  }, [cat]);

  const fetchCats = async () => {
    try {
      const data = await doApiGet(API_URL + `/categories/byCode/${cat}`);
      setCategory(data);
    } catch (err) {
      console.log(err);
      setCategory({ img_url: '../../images/logo.png' }); // set default image URL or null
    }
  };

  const fetchQuestions = async () => {
    try {
      const data = await doApiGet(API_URL + `/questions/?cat=${cat}`);
      setQuestions(data);
      setLoading(false);
      console.log("quizCat - questions", data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleArrowClick = () => {
    const welcomeElement = document.querySelector('.welcome-container');
    const rect = welcomeElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const top = rect.bottom + scrollTop -140;
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
          <Quiz questions={questions} />
        ) : (
          'loading...'
        )}
      </div>
    </div>
  );
}
