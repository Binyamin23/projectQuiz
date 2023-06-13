import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loading from '../../comps_general/loading';
import { API_URL, doApiGet, doApiMethod } from '../../services/apiService';
import QuizForm from './addQuestion';
import { toast } from 'react-toastify';
import './questions.css'
import { Table } from 'react-bootstrap';
import useWindowWidth from '../../comps_general/useWidth';
import { AuthContext } from '../../context/createContext';


export default function QuestionsList() {


  const [getQuery] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [editQuestion, setEditQuestion] = useState({});
  const [filterCat, setFilterCat] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  const { user, admin, setUser, setAdmin } = useContext(AuthContext);

  let width = useWindowWidth();
  const [isMobile, setIsMobile] = useState(width < 500);
  const nav = useNavigate();

  useEffect(() => {
    setIsMobile(width < 500);
  }, [width])

  useEffect(() => {
    if (user && admin) {
      setLoading(true);
      doApi(filterCat, filterLevel);
    }
    else {
      nav("/");
    }

  }, [getQuery, filterCat, filterLevel]);


  const doApi = async (filterCat, filterLevel) => {

    let url = `${API_URL}/questions/all`;
    if (filterCat || filterLevel) {
      url += `?cat=${filterCat}&level=${filterLevel}`;
    }
    try {
      let data = await doApiGet(url);
      data.sort((a, b) => {
        let catComparison = a.cat_url.localeCompare(b.cat_url);
        if (catComparison !== 0) {
          // if 'cat_url' is not the same, sort by 'cat_url'
          return catComparison;
        } else {
          // if 'cat_url' is the same, sort by 'level'
          return a.level - b.level;
        }
      });
      setQuestions(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      alert('There is a problem. Please try again later.');
    }
  };

  const onFilterChange = (event, field) => {
    const value = event.target.value;
    if (field === 'category') {
      setFilterCat(value);
    } else if (field === 'level') {
      setFilterLevel(value);
    }
  };


  const onXClick = async (_delId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }
    let url = API_URL + '/questions/' + _delId;
    try {
      let data = await doApiMethod(url, 'DELETE');
      if (data.deletedCount) {
        alert('Question deleted.');
        doApi();
      }
    } catch (err) {
      console.log(err);
      alert('There is a problem. Please try again later.');
    }
  };

  const onEditClick = async (id, { question, level, cat_url, answers, status }) => {
    if (id === editQuestionId) {
      setEditQuestionId(null);
      setEditQuestion({});
    } else {
      setEditQuestionId(id);
      setEditQuestion({ question, level, cat_url, answers, status });
    }
  };



  const onSaveEditClick = async () => {
    let url = API_URL + '/questions/' + editQuestionId;
    console.log(editQuestion)
    try {
      let data = await doApiMethod(url, 'PUT', editQuestion);
      toast.success('Question updated');
      setEditQuestionId(null);
      setEditQuestion({});
      doApi();
    } catch (err) {
      console.log(err);
      toast.error('Not successful!')
    }
  };



  const onInputChange = (event, field) => {
    setEditQuestion((prevQuestion) => ({
      ...prevQuestion,
      [field]: event.target.value,
    }));
  };

  const onAnswersChange = (event, index) => {
    setEditQuestion((prevQuestion) => {
      const answers = [...prevQuestion.answers];
      answers[index] = event.target.value;
      return {
        ...prevQuestion,
        answers,
      };
    });
  };

  return (
    <>
      {user && admin ?
        <div className='container' style={{ maxWidth: "100%", overflowX: "hidden" }}>
          <h1 className='m-3'>List of Questions</h1>

          <div className="mb-3">
            <button
              className="btn btn-outline-dark "
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Close' : 'Add Question'}
            </button>
          </div>

          {showForm && <QuizForm />}

          <div className="mb-3 row g-3 align-items-center">
            <div className="col-auto">
              <label htmlFor="category" className="col-form-label">Filter by Category</label>
            </div>
            <div className="col-auto">
              <input type="text" id="category" className="form-control" onChange={(event) => onFilterChange(event, 'category')} />
            </div>
            <div className="col-auto">
              <label htmlFor="level" className="col-form-label">Filter by Level</label>
            </div>
            <div className="col-auto">
              <select id="level" className="form-select" onChange={(event) => onFilterChange(event, 'level')}>
                <option value="">Select Level</option>
                <option value="1">Easy</option>
                <option value="2">Medium</option>
                <option value="3">Hard</option>
              </select>
            </div>
          </div>

          {loading && <Loading />}
          <div className="table-responsive">
            <Table striped bordered hover variant="dark" style={{ borderRadius: '30px', marginTop: '20px' }}>
              <thead>
                <tr>
                  <th>Cat</th>
                  <th>Level</th>
                  <th>Question</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q._id}>
                    <td>{q.cat_url}</td>
                    <td>{q.level}</td>
                    <td colSpan={editQuestionId === q._id ? 4 : 1}>
                      {editQuestionId === q._id ? (
                        <>
                          <div className="mb-3">
                            <label htmlFor={`question_${q._id}`} className="form-label">
                              Question
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id={`question_${q._id}`}
                              value={editQuestion.question}
                              onChange={(event) => onInputChange(event, 'question')}
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor={`level_${q._id}`} className="form-label">
                              Level
                            </label>
                            <select
                              className="form-select"
                              id={`level_${q._id}`}
                              value={editQuestion.level}
                              onChange={(event) => onInputChange(event, 'level')}
                            >
                              <option value="1">Easy</option>
                              <option value="2">Medium</option>
                              <option value="3">Hard</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <label htmlFor={`cat_url_${q._id}`} className="form-label">
                              Category URL
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id={`cat_url_${q._id}`}
                              value={editQuestion.cat_url}
                              onChange={(event) => onInputChange(event, 'cat_url')}
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor={`img_url_${q._id}`} className="form-label">
                              Image URL
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id={`img_url_${q._id}`}
                              value={editQuestion.img_url}
                              onChange={(event) => onInputChange(event, 'img_url')}
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor={`info_${q._id}`} className="form-label">
                              Info
                            </label>
                            <textarea
                              className="form-control"
                              id={`info_${q._id}`}
                              value={editQuestion.info}
                              onChange={(event) => onInputChange(event, 'info')}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Answers</label>
                            {editQuestion.answers.map((answer, index) => (
                              <div className="d-flex align-items-center mb-2" key={index}>
                                <input
                                  type="text"
                                  className="form-control me-2"
                                  value={answer}
                                  onChange={(event) => onAnswersChange(event, index)}
                                />
                                {index === 0 && <span>correct</span>}
                              </div>
                            ))}
                          </div>

                          <div className='mt-4 justify-content-between'>
                            <button
                              className="btn btn-success me-2"
                              onClick={() => onSaveEditClick()}
                            >
                              Save
                            </button>

                            <button type='button' onClick={() => {
                              setEditQuestionId(null)
                            }} className='btn btn-outline-light'>Close</button>
                          </div>

                        </>
                      ) : (
                        <>
                          {q.question}

                        </>
                      )}
                    </td>
                    {editQuestionId !== q._id && (
                      <td>
                        <button
                          className={isMobile ? 'w-100 mb-2 btn btn-outline-light' : 'm-2 btn btn-outline-light'}
                          onClick={() => onEditClick(q._id, q)}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            onXClick(q._id);
                          }}
                          className={isMobile ? 'w-100 mb-2 btn btn-danger' : 'm-2 btn btn-danger'}                     >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
        : ''}
    </>
  );
}