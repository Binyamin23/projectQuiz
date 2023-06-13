import React, { useContext, useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/createContext';
import { API_URL, doApiGet } from '../../services/apiService';
import gsap from 'gsap';

const ScoresOverview = () => {


    //TO DO:
    //Add option  to reset scores  of each or all  categories!
    
    const [userObj, setUserObj] = useState({}); // State for storing user information
    const { user, admin, setUser } = useContext(AuthContext); // Accessing and updating user authentication context values
    const [categories, setCategories] = useState([]); // State for storing categories data
    const location = useLocation();
    const rightRefs = useRef([]); // Ref for right answer progress bar elements
    const wrongRefs = useRef([]); // Ref for wrong answer progress bar elements

    // Function for updating user information
    const updateUserInfo = async () => {
        let url = API_URL + "/users/myInfo";
        try {
            let data = await doApiGet(url);
            setUserObj(data);
        }
        catch (err) {
            setUserObj(null);
        }
    };

    // Function for making API request to fetch categories data
    const doApi = async () => {
        try {
            let url = API_URL + '/categories/all';
            let data = await doApiGet(url);
            setCategories(data);
        } catch (err) {
            alert("There's a problem, try again later.");
        }
    };

    useEffect(() => {
        if (user || admin) {
            doApi(); // Fetch categories data
            updateUserInfo(); // Update user information
            setUser(!user); // Update user authentication context value
        }
    }, [location]);

    useEffect(() => {
        if (userObj && userObj.scores_array_byCat) {
            userObj.scores_array_byCat.forEach((_, i) => {
                if (rightRefs.current[i] && wrongRefs.current[i]) {
                    // Animate the right and wrong answer progress bars using gsap
                    gsap.fromTo(rightRefs.current[i], { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 2 });
                    gsap.fromTo(wrongRefs.current[i], { scaleX: 0, transformOrigin: 'right' }, { scaleX: 1, duration: 2 });
                }
            });
        }
    }, [userObj]);

    // Render a message for non-signed up members
    if (!user && !admin) {
        return (
            <div className="container my-4">
                <h2>Scores Overview</h2>
                <p className="empty-message" style={{ fontSize: '24px' }}>
                    Only signed up members can use this feature.
                </p>
            </div>
        );
    }

    // Render a loading message while scores are being fetched
    if (!userObj || !userObj.scores_array_byCat) {
        return <p>Loading scores...</p>;
    }

    // Render the scores overview
    // Render the scores overview
    return (
        <div className="container mt-0 p-5">
            <h2>Scores Overview</h2>
            {userObj.scores_array_byCat.length > 0 ? (
                userObj.scores_array_byCat.map((score, index) => {
                    const totalAnswers = score.right_answers + score.wrong_answers;
                    const rightPercentage = totalAnswers ? (score.right_answers / totalAnswers) * 100 : 0;
                    const wrongPercentage = totalAnswers ? (score.wrong_answers / totalAnswers) * 100 : 0;
                    const category = categories.find(category => category.url_code === score.cat_url);

                    return (
                        <div key={index} className="my-3 p-3 bg-light rounded shadow-sm">
                            <h3 className="border-bottom pb-2 mb-0">{category ? category.name : score.cat_url}</h3>
                            <div className="progress mt-3">
                                <div
                                    ref={el => rightRefs.current[index] = el}
                                    className="progress-bar bg-success progress-right"
                                    role="progressbar"
                                    style={{ width: `${rightPercentage}%`, flexShrink: 0 }}
                                    aria-valuenow={rightPercentage}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                                <div
                                    ref={el => wrongRefs.current[index] = el}
                                    className="progress-bar bg-danger progress-wrong"
                                    role="progressbar"
                                    style={{ width: `${wrongPercentage}%`, flexShrink: 0 }}
                                    aria-valuenow={wrongPercentage}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                            <p className="pt-3 mb-0">
                                Right Answers: {score.right_answers} / Wrong Answers: {score.wrong_answers}
                            </p>
                        </div>
                    );
                })
            ) : (
                <p className="empty-message">No scores available yet.</p>
            )}
        </div>
    );
}

export default ScoresOverview;