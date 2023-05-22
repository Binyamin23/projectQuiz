import React, { useState } from 'react';
import axios from 'axios';
import { API_URL, doApiMethod } from '../services/apiService';

const QuizForm = () => {
    const [question, setQuestion] = useState('');
    const [level, setLevel] = useState(1);
    const [cat_url, setCat_url] = useState('');
    const [img_url, setImg_url] = useState('');
    const [info, setInfo] = useState('');
    const [answers, setAnswers] = useState(['', '', '', '']);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const questionObj = { question, level, cat_url, img_url, info, answers };
        console.log("addQuestion",questionObj)
        try {
            await doApiMethod( API_URL + '/questions/newQuestion', 'POST', questionObj);
            alert('Question added successfully!');
            setQuestion('');
            setLevel(1);
            setCat_url('');
            setImg_url('');
            setInfo('');
            setAnswers(['', '', '', '']);
        } catch (error) {
            alert('Failed to add question. Please try again.');
        }
    };

    const handleAnswerChange = (e, index) => {
        const newAnswers = [...answers];
        newAnswers[index] = e.target.value;
        setAnswers(newAnswers);
    };

    return (
        <div className="container quiz-form-container mb-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header quiz-form-header">Add Question</div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="question">Question</label>
                                    <textarea
                                        className="form-control"
                                        id="question"
                                        rows="3"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="level">Level</label>
                                    <select
                                        className="form-control"
                                        id="level"
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                        required
                                    >
                                        <option value="1">Easy</option>
                                        <option value="2">Medium</option>
                                        <option value="3">Hard</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cat_url">Category URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="cat_url"
                                        value={cat_url}
                                        onChange={(e) => setCat_url(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="img_url">Image URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="img_url"
                                        value={img_url}
                                        onChange={(e) => setImg_url(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="info">Additional Info</label>
                                    <textarea
                                        className="form-control"
                                        id="info"
                                        rows="3"
                                        value={info}
                                        onChange={(e) => setInfo(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Answers</label>
                                    {answers.map((answer, index) => (
                                        <div key={index} className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">{index + 1}</div>
                                            </div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={`Answer ${index + 1}`}
                                                value={answer}
                                                onChange={(e) => handleAnswerChange(e, index)}
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button type="submit" className="btn btn-outline-dark quiz-form-submit">
                                    Add Question
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizForm;