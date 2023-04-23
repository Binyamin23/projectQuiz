import React, { useEffect, useState } from 'react';
import './mainQuiz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
// Import your icon library here, for example: import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Quiz = ({ questions }) => {

    const addToLocalStorage = (_id) => {
        // Get the current list of starred questions from local storage or initialize an empty array
        const currentStarredQuestions = JSON.parse(localStorage.getItem('starredQuestions') || '[]');

        // Check if the question ID already exists in the array
        if (!currentStarredQuestions.includes(_id)) {
            // Add the new question ID to the array
            currentStarredQuestions.push(_id);

            // Save the updated array back to local storage
            localStorage.setItem('starredQuestions', JSON.stringify(currentStarredQuestions));

            // Show a success toast message
            toast.success('Question added to favorites');
        } else {
            // Show a toast message when the question is already in favorites
            toast.info('Question already saved in favorites');
        }
    };




    const shuffleArray = (array) => {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    const randomizedQuestions = questions.map((question) => {
        const shuffledAnswers = shuffleArray(question.answers);
        const correctIndex = shuffledAnswers.indexOf(question.answers[0]);

        return {
            ...question,
            answers: shuffledAnswers,
            correct: correctIndex,
        };
    });


    const [Questions, setQuestions] = useState(randomizedQuestions);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(JSON.parse(localStorage.getItem('userAnswers')) || Array(questions.length).fill(null));
    const [showResults, setShowResults] = useState(false);

    // const getStoredAnswers = () => {
    //     const storedAnswers = JSON.parse(localStorage.getItem('userAnswers'));
    //     const expiration = localStorage.getItem('userAnswersExpiration');

    //     if (!storedAnswers || !expiration) {
    //         return Array(questions.length).fill(null);
    //     }

    //     const currentTime = new Date().getTime();
    //     if (currentTime >= Number(expiration)) {
    //         localStorage.removeItem('userAnswers');
    //         localStorage.removeItem('userAnswersExpiration');
    //         return Array(questions.length).fill(null);
    //     }

    //     return storedAnswers;
    // };


    const handleAnswer = (index, answer) => {
        const newAnswers = [...answers];
        newAnswers[index] = answer;
        setAnswers(newAnswers);

        const currentTime = new Date().getTime();
        const expirationTime = currentTime + 2 * 60 * 60 * 1000; // 2 hours later
        localStorage.setItem('userAnswers', JSON.stringify(newAnswers));
        localStorage.setItem('userAnswersExpiration', expirationTime);
    };

    const moveToNextQuestion = () => {
        setCurrentQuestion(currentQuestion + 1);
    };

    const moveToPreviousQuestion = () => {
        setCurrentQuestion(currentQuestion - 1);
    };

    const checkAnswers = () => {
        let correctAnswers = 0;

        answers.forEach((answer, index) => {
            if (Questions && Questions[index] && answer === Questions[index].correct) {
                correctAnswers++;
            }
        });

        alert(`You got ${correctAnswers} out of ${questions.length} questions right.`);
        setShowResults(true);
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
                                className={`btn btn-${showResults ? (index === Questions[currentQuestion].correct ? 'success' : (answers[currentQuestion] === index ? 'danger' : 'outline-secondary')) : (answers[currentQuestion] === index ? 'primary' : 'outline-secondary')}`}
                                onClick={() => !showResults && handleAnswer(currentQuestion, index)}
                            >
                                <h5>{answer}</h5>
                            </button>
                        ))}
                    </div>

                    <div className="quiz-footer">
                        <button>
                            <FontAwesomeIcon onClick={() => addToLocalStorage(Questions[currentQuestion]._id)} className='mr-3' icon={faStar} style={{ color: "#dbd751", }} />
                        </button>
                        <span>Report</span>
                    </div>
                </div>

                <div className="d-flex justify-content-between mt-3">
                    <button className="btn btn-secondary" onClick={moveToPreviousQuestion} disabled={currentQuestion === 0}>
                        Previous
                    </button>
                    {currentQuestion === questions.length - 1 ? (
                        <button
                            className="btn btn-secondary"
                            onClick={checkAnswers}
                        >
                            Check Answers
                        </button>
                    ) : (
                        <button
                            className="btn btn-secondary"
                            onClick={moveToNextQuestion}
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Quiz;
