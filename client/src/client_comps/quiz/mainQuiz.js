import React, { useEffect, useState } from 'react';
import './mainQuiz.css';
// Import your icon library here, for example: import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Quiz = ({ questions }) => {
    const [Questions, setQuestions] = useState(questions);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(Array(questions.length).fill(null));

    const handleAnswer = (index, answer) => {
        const newAnswers = [...answers];
        newAnswers[index] = answer;
        setAnswers(newAnswers);
    };

    const moveToNextQuestion = () => {
        setCurrentQuestion(currentQuestion + 1);
    };

    const moveToPreviousQuestion = () => {
        setCurrentQuestion(currentQuestion - 1);
    };

    useEffect(() => {
        console.log(Questions)
    }, [Questions])

    return (
        <div className="quiz-container container">
            <div className='row'>
                <div className="quiz-header">
                    Question {currentQuestion + 1} of {Questions.length}
                </div>
                <div className='col-12 justify-content-center text-center bg-black bg-opacity-50 rounded-2'>

                    <h3 className='mt-3 text-light question-title mt-4'>{Questions[currentQuestion].question}</h3>
                    <div className="btn-group-vertical rounded-2  mt-3 text-light">
                        {Questions[currentQuestion].answers.map((answer, index) => (
                            <button
                                key={index}
                                className={`btn btn-${answers[currentQuestion] === index ? 'primary' : 'outline-secondary'}`}
                                onClick={() => handleAnswer(currentQuestion, index)}
                            >
                                <h5>{answer}</h5>
                            </button>
                        ))}
                    </div>

                    <div className="quiz-footer">
                        {/* Replace the following spans with your icons, for example: <FontAwesomeIcon icon="star" /> */}
                        <span className="mr-3">Star</span>
                        <span>Report</span>
                    </div>
                </div>

                <div className="d-flex justify-content-between mt-3">
                    <button className="btn btn-secondary" onClick={moveToPreviousQuestion} disabled={currentQuestion === 0}>
                        Previous
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={moveToNextQuestion}
                        disabled={currentQuestion === questions.length - 1}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
