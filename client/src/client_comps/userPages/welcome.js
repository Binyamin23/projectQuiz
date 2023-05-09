import React, { useContext, useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { API_URL, doApiMethod, TOKEN_KEY, doApiGet } from '../../services/apiService';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/createContext';
import gsap from 'gsap';

export  const WelcomeMessage = ({ categories, userObj }) => {
  const [showMessage, setShowMessage] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getCategoryGreeting = (category) => {
    const catScore = userObj.scores_array_byCat.find((score) => score.cat_url === category.url_code);
    if (catScore) {
      const totalAnswers = catScore.right_answers + catScore.wrong_answers;
      const rightPercentage = totalAnswers ? (catScore.right_answers / totalAnswers) * 100 : 0;

      if (rightPercentage >= 80) {
        return "Excellent work with " + category.name;
      } else if (rightPercentage >= 50) {
        return "Good job with " + category.name;
      } else {
        return "You can improve your skills in " + category.name;
      }
    } else {
      return "You can improve your skills in " + category.name;
    }
  }

  const getGreeting = () => {
    let hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
      return "Good morning, ";
    } else if (hour >= 12 && hour < 18) {
      return "Good afternoon, ";
    } else {
      return "Good evening, ";
    }
  }

  const closeMessage = () => {
    setShowMessage(false);
  }

  return (
    <div className="welcome-message">
      <div className="message-box">
        <div className="message-content">
          <h2>{getGreeting()} {userObj.name}!</h2>
          {categories.map((category, index) => (
            <p key={index}>{getCategoryGreeting(category)}</p>
          ))}
          <p>The time is now {currentTime}.</p>
          <button className="btn btn-primary" onClick={closeMessage}>Close</button>
        </div>
      </div>
    </div>
  );
}
