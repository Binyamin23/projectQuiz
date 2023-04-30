import React, { useContext, useEffect, useState } from 'react';
import './mainQuiz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { AuthContext, FavoritesUpdateContext } from '../../context/createContext';
import { removeFromUserWrongIds, updateUserWrongIds } from '../../services/apiService';
// Import your icon library here, for example: import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Quiz = ({ questions }) => {

    const { favoritesUpdateFlag, setFavoritesUpdateFlag } = useContext(FavoritesUpdateContext);
    const { user, admin, userObj, setUser, setAdmin } = useContext(AuthContext);




    const addToLocalStorage = (_id) => {
        if (!user && !admin) {
            toast.warning('Only signed up members can use this feature');
            return;
        }
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
            setFavoritesUpdateFlag(!favoritesUpdateFlag);

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


    const checkAnswers = async () => {
        let correctAnswers = 0;
        let wrongAnswers = 0;
    
        const minIndex = Math.min(Questions.length, answers.length);
    
        for (let i = 0; i < minIndex; i++) {
            if (Questions[i] && answers[i] === Questions[i].correct) {
                correctAnswers++;
    
                if (userObj && userObj.wrong_ids && userObj.wrong_ids.includes(Questions[i]._id)) {
                    const data = await removeFromUserWrongIds(userObj._id, Questions[i]._id);
                    console.log("Removed question ID from user's wrong_ids:", data);
                    userObj.wrong_ids = userObj.wrong_ids.filter(id => id !== Questions[i]._id);
                }
            } else {
                if (userObj) {
                    console.log("check:", userObj);
                    const data = await updateUserWrongIds(userObj._id, Questions[i]._id);
                    console.log("Added question ID to user's wrong_ids:", data);
                    userObj.wrong_ids.push(Questions[i]._id);
                }
                wrongAnswers++;
            }
        }
    
        setShowResults(true);
    
        toast.success(`You answered ${correctAnswers} questions correctly and ${wrongAnswers} questions incorrectly.`);
    
        return correctAnswers;
    };
    



    useEffect(() => {
        console.log(Questions)
        console.log(userObj)
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

                    <div className="quiz-footer p-2">
                        <FontAwesomeIcon
                            onClick={() => addToLocalStorage(Questions[currentQuestion]._id)}
                            className="mr-3 quiz-icon"
                            icon={faStar}
                        />
                        <br></br>
                        <span className='text-light p-2'>Add to favs</span>
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
