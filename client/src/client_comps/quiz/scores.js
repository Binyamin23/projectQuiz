import React, { useContext } from 'react';
import './scores.css';
import { AuthContext } from '../../context/createContext';

const ScoresOverview = () => {
    const { user, admin, userObj, setUser, setAdmin } = useContext(AuthContext);
    console.log(5/100)

  return (
    <div className="scores-overview">
      <h2>Scores Overview</h2>
      {userObj.scores_array_byCat.map((score, index) => {
        const totalAnswers = score.right_answers + score.wrong_answers;
        const rightPercentage = (score.right_answers / totalAnswers) * 100;
        const wrongPercentage = (score.wrong_answers / totalAnswers) * 100;

        return (
          <div key={index} className="category-score">
            <h3>{score.cat_url}</h3>
            <div className="progress-bar">
              <div
                className="progress-right"
                style={{ width: `${rightPercentage}%` }}
              ></div>
              <div
                className="progress-wrong"
                style={{ width: `${wrongPercentage}%` }}
              ></div>
            </div>
            <p>
              Right Answers: {score.right_answers} / Wrong Answers: {score.wrong_answers}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ScoresOverview;
