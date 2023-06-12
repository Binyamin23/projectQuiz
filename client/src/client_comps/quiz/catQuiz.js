import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { API_URL, TOKEN_KEY, doApiGet } from '../../services/apiService';
import Quiz from './mainQuiz';
import './catQuiz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowDown } from '@fortawesome/free-solid-svg-icons';
import { AuthContext, LevelContext } from '../../context/createContext';
import LevelSelect from './levelSelect';

export default function CatQuiz() {

  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const { cat, setCat, level, setLevel } = useContext(LevelContext);
  const { user, admin, userObj, setUser, setAdmin } = useContext(AuthContext);
  
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
  const fetchCategories = async () => {
    try {
      let url = API_URL + "/categories/all";
      let data = await doApiGet(url);
      console.log("cat quit fetch cats:", data);
      setCategories(data)
    }
    catch (err) {
      console.log(err)
      alert("There's a problem, please try again later.")
    }
  }

  const fetchQuestions = async () => {
    let data;
    console.log(userObj)
    console.log("check cat and level:", cat, level)
    try {
      if (!user && !admin) {
        data = await doApiGet(API_URL + `/questions/levelOne/category/${cat}`);
      } else {
        // Extract wrong_ids from the user object in AuthContext and join them with a comma
        const wrongIds = userObj.wrong_ids.join(",");
        data = await doApiGet(API_URL + `/questions/?cat=${cat}&level=${level}&wrongIds=${wrongIds}&limit=10`);
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
    fetchCategories();
  }, [])

  useEffect(() => {
    fetchQuestions();
  }, [cat, level, userObj]);

  const handleArrowClick = (componentId) => {
    const componentElement = document.querySelector(componentId);
    const top = componentElement.offsetTop;
    const componentHeight = componentElement.offsetHeight;
    const viewportHeight = window.innerHeight;

    const scrollPosition = top - viewportHeight + componentHeight + 100;
    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
  };


  const changeCategory = (e) => {
    const selectedCat = e.target.value;
    nav(`/category/${selectedCat}/level/1`);
    setCat(selectedCat);
    setLevel(1);
  };

  

  return (

    <div className="container-fluid container-quiz justify-content-center" style={{ backgroundImage: `url(${category?.img_url || '../../images/logo.png'})` }}>
      <div style={{display:"flex", justifyContent:"center"}} >
        <div className="welcome-container">
          <div className="inner-welcome">
            <select className='select-cat' onChange={changeCategory} value={cat}>
              {categories.map((category) => (
                <option key={category._id} value={category.url_code}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="welcome-info">{category.info}</p>
          </div>
          <div className="welcome-arrow-container" onClick={() => handleArrowClick('#level-select-container')}>
            <FontAwesomeIcon className='welcome-arrow' icon={faCircleArrowDown} />
          </div>
        </div>
      </div>


      <div id='level-select-container' className='level-select-container'>
        <LevelSelect />
        <div className="level-arrow-container" onClick={() => handleArrowClick('#quiz-component')}>
          <FontAwesomeIcon className='welcome-arrow' icon={faCircleArrowDown} />
        </div>
      </div>

      <div id="quiz-component" className="quiz-container">
        {!loading ? (
          < Quiz key={questions[0]._id} questions={questions} />
        ) : (
          'loading...'
        )}
      </div>
    </div>
  );
}
