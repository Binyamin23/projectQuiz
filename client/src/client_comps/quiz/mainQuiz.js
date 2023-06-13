import React, { useContext, useEffect, useState } from 'react';
import './mainQuiz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { AuthContext, LevelContext } from '../../context/createContext';
import { API_URL, doApiMethod, removeFromUserWrongIds, updateUserScoresByCat, updateUserWrongIds } from '../../services/apiService';

const Quiz = ({ questions }) => {

    const { user, admin, userObj, setUser, setAdmin, updateUserInfo } = useContext(AuthContext);
    const { cat, level } = useContext(LevelContext);

    const [submitting, setSubmitting] = useState(false);
    const [quizComplete, setQuizComplete] = useState(false);

    // Function to determine the font size of the question based on its length
    const getFontSize = (text) => {
        const length = text.length;
        const screenWidth = window.innerWidth;
        if (screenWidth > 576) { // Adjust the breakpoint as needed
            if (length < 100) return '1.5rem';
            if (length < 200) return '1.2rem';
            if (length < 300) return '1rem';
            return '0.9rem';
        } else {
            if (length < 100) return '1rem';
            if (length < 200) return '0.9rem';
            if (length < 300) return '0.8rem';
            return '0.7rem';
        }
    };

    // Function to add a question to favorites
    const addToFavorites = async (_id) => {
        if (!user && !admin) {
            toast.warning('Only signed up members can use this feature');
            return;
        }
        try {
            const response = await doApiMethod(API_URL + '/users/addFavorite', 'POST', { userId: userObj._id, questionId: _id });
    
            if (response.success) {
                toast.success('Question added to favorites');
            } else {
                toast.info('Question already saved in favorites');
            }
    
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong, please try again');
        }
    };
    
    // Function to shuffle the answers of a question
    const shuffleArray = (array) => {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    // Randomize the order of questions and their answers
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

    // Function to handle selecting an answer
    const handleAnswer = (index, answer) => {
        const newAnswers = [...answers];
        newAnswers[index] = answer;
        setAnswers(newAnswers);
    };

    // Function to move to the next question
    const moveToNextQuestion = () => {
        setCurrentQuestion(currentQuestion + 1);
    };

    // Function to move to the previous question
    const moveToPreviousQuestion = () => {
        setCurrentQuestion(currentQuestion - 1);
    };

    // Function to update the answer count on the server
    const updateAnswerCount = async (userId, isCorrect) => {
        try {
            await doApiMethod(API_URL + '/users/updateAnswerCount', 'POST', { userId, isCorrect });
        } catch (err) {
            console.error(err);
        }
    };

    // Function to check the answers and update scores
    const checkAnswers = async () => {
        // Disable the button
        setSubmitting(true);

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

                // Update the right answer count on the server
                if (userObj) {
                    await updateAnswerCount(userObj._id, true);
                }
            } else {
                if (userObj) {
                    console.log("check:", userObj);
                    const data = await updateUserWrongIds(userObj._id, Questions[i]._id);
                    console.log("Added question ID to user's wrong_ids:", data);
                    userObj.wrong_ids.push(Questions[i]._id);
                }
                wrongAnswers++;

                // Update the wrong answer count on the server
                if (userObj) {
                    await updateAnswerCount(userObj._id, false);
                }
            }
        }

        // Update the scores_array_byCat in the user model
        if (userObj) {
            await updateUserScoresByCat(userObj._id, cat, correctAnswers, wrongAnswers);
        }

        setShowResults(true);
        if (correctAnswers === 0) {
            toast.error(`You answered ${correctAnswers} questions correctly and ${wrongAnswers} questions incorrectly.`);
        }
        else if (wrongAnswers === 0) {
            toast.success(`You answered ${correctAnswers} questions correctly and ${wrongAnswers} questions incorrectly.`);
        }
        else {
            toast.info(`You answered ${correctAnswers} questions correctly and ${wrongAnswers} questions incorrectly.`);
        }

        // Quiz is now complete
        setQuizComplete(true);

        // Enable the button
        setSubmitting(false);
    };

    // Function to reload the component
    const reloadComponent = () => {
        window.location.reload();
    };

    useEffect(() => {
        console.log(Questions)
        console.log(userObj)
    }, [Questions]);

    return (
        <div className="quiz-container container center-vertically" id="quiz-component">
            <div className='row' style={{ width: '100vw' }}>
                <div className="quiz-header">
                    Question {currentQuestion + 1} of {Questions.length}
                </div>
                <div style={{ maxHeight: '80vh' }} className='col-12 justify-content-center text-center bg-black bg-opacity-50 rounded-2 p-2'>
                    {/* Set the font size for the question based on its length */}
                    <h3 className='mt-3 text-light question-title' style={{ fontSize: getFontSize(Questions[currentQuestion].question), maxHeight: '3rem' }}>{Questions[currentQuestion].question}</h3>
                    <div className="btn-group-container d-flex justify-content-center align-items-center">
                        <div className="btn-group-vertical rounded-2 mt-3 text-light">
                            {Questions[currentQuestion].answers.map((answer, index) => (
                                <button
                                    key={index}
                                    className={`answer-button btn btn-${showResults ? (index === Questions[currentQuestion].correct ? 'success' : (answers[currentQuestion] === index ? 'danger' : 'outline-secondary')) : (answers[currentQuestion] === index ? 'primary' : 'outline-secondary')}`}
                                    onClick={() => !showResults && handleAnswer(currentQuestion, index)}
                                >
                                    <h5 style={{ fontSize: getFontSize(answer) }}>{answer}</h5>
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Add a CSS class to fix the position of the quiz footer */}
                    <div className="quiz-footer p-2">
                        <FontAwesomeIcon
                            onClick={() => addToFavorites(Questions[currentQuestion]._id)}
                            className="mr-3 quiz-icon"
                            icon={faStar}
                        />
                        <br />
                        <span className='text-light p-2'>Add to favs</span>
                    </div>
                    <div className={`quiz-buttons`}>
                        <div className="d-flex justify-content-between mt-3 button-group mb-4">
                            <button className="btn btn-secondary button-left" onClick={moveToPreviousQuestion} disabled={currentQuestion === 0}>
                                Previous
                            </button>
                            {currentQuestion === questions.length - 1 ? (
                                <button
                                    className="btn btn-secondary button-right"
                                    onClick={quizComplete ? reloadComponent : checkAnswers}
                                    disabled={submitting} // Disable the button when submitting
                                >
                                    {quizComplete ? "Play Again" : "Check Answers"}
                                </button>
                            ) : (
                                <button
                                    className="btn btn-secondary button-right"
                                    onClick={moveToNextQuestion}
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
