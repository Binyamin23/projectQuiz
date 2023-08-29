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

  //TODO:
  //Add option to decide how many questions to present

  const nav = useNavigate();

  // State initialization
  const [loading, setLoading] = useState(true); // Loading state for showing loading indicator
  const [category, setCategory] = useState({}); // State for storing category data
  const [categories, setCategories] = useState([]); // State for storing categories data
  const { cat, setCat, level, setLevel } = useContext(LevelContext); // Accessing and updating category and level context values
  const { user, admin, userObj, setUser, setAdmin } = useContext(AuthContext); // Accessing and updating user authentication context values

  const [questions, setQuestions] = useState([]); // State for storing quiz questions

  // Function for fetching category data
  const fetchCats = async () => {
    try {
      const data = await doApiGet(API_URL + `/categories/byCode/${cat}`);
      setCategory(data); // Update the category state with fetched data
    } catch (err) {
      console.log(err);
      setCategory({ img_url: '../../images/logo.png' }); // Set default image URL or null if an error occurs
    }
  };

  // Function for fetching categories data
  const fetchCategories = async () => {
    try {
      let url = API_URL + "/categories/all";
      let data = await doApiGet(url);
      setCategories(data); // Update the categories state with fetched data
    }
    catch (err) {
      console.log(err);
      alert("There's a problem, please try again later.");
    }
  };

  // Function for fetching quiz questions data
  const fetchQuestions = async () => {
    let data;
    try {
      if (!user && !admin) {
        data = await doApiGet(API_URL + `/questions/levelOne/category/${cat}`);
      } else {
        if (userObj.wrong_ids > 0) {
          // Extract wrong_ids from the user object in AuthContext and join them with a comma
          const wrongIds = userObj.wrong_ids.join(",");
          data = await doApiGet(API_URL + `/questions/?cat=${cat}&level=${level}&wrongIds=${wrongIds}&limit=10`);
        }
        else {
          data = await doApiGet(API_URL + `/questions/?cat=${cat}&level=${level}&limit=10`);
        }
      }
      if (data && data.length > 0) {
        setQuestions(data); // Update the questions state with fetched data
        setLoading(false); // Set loading state to false to indicate that the data has been fetched
      } else {
        setLoading(true); // Set loading state to true if no questions are available
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch category data when the 'cat' dependency changes
  useEffect(() => {
    fetchCats();
  }, [cat]);

  // Fetch categories data once when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch questions data when the 'cat', 'level', or 'userObj' dependency changes
  useEffect(() => {
    fetchQuestions();
  }, [cat, level, userObj, user, admin]);

  // Function for handling click on the arrow icon
  const handleArrowClick = (componentId) => {
    const componentElement = document.querySelector(componentId);
    const top = componentElement.offsetTop;
    const componentHeight = componentElement.offsetHeight;
    const viewportHeight = window.innerHeight;

    const scrollPosition = top - viewportHeight + componentHeight + 80;
    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
  };

  // Function for handling category change
  const changeCategory = (e) => {
    const selectedCat = e.target.value;
    nav(`/category/${selectedCat}/level/1`); // Navigate to the selected category and level using React Router
    setCat(selectedCat); // Update the category context value
    setLevel(1); // Update the level context value
  };

  // Render the component JSX
  return (
    <div className="container-fluid container-quiz justify-content-center" style={{ backgroundImage: `url(${category?.img_url || '../../images/logo.png'})` }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
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
          <Quiz key={questions[0]._id} questions={questions} />
        ) : (
          'loading...'
        )}
      </div>
    </div>
  );
}
