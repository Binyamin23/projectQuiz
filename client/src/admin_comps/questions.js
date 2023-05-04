import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Loading from '../comps_general/loading';
import PagesComp from '../comps_general/pagesComp';
import { API_URL, doApiGet, doApiMethod } from '../services/apiService';
import AuthAdmin from './authAdmin';
import QuizForm from './addQuestion';
import { toast } from 'react-toastify';


export default function QuestionsList() {
  const [getQuery] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [editQuestion, setEditQuestion] = useState({});

  useEffect(() => {
    setLoading(true);
    doApi();
  }, [getQuery]);

  const doApi = async () => {
    let perPage = getQuery.get('perPage') || 5;
    let page = getQuery.get('page') || 1;

    let url = `${API_URL}/questions/all`;
    try {
      let data = await doApiGet(url);
      data.sort((a, b) => a.cat_url.localeCompare(b.cat_url));
      setQuestions(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      alert('There is a problem. Please try again later.');
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
    <div className="container">
      <AuthAdmin />
      <h1>List of questions in the system</h1>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Close' : 'Add Question'}
      </button>
      <PagesComp
        apiPages={API_URL + '/questions/count?perPage=5'}
        linkTo={'/admin/apps?page='}
        linkCss={'btn btn-warning me-2'}
      />
      {showForm && <QuizForm />}
      {loading && <Loading />}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Category</th>
            <th>Level</th>
            <th>Question</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q._id}>
              <td>{q.cat_url}</td>
              <td>{q.level}</td>
              <td>
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
                    <button
                      className="btn btn-success"
                      onClick={() => onSaveEditClick()}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    {q.question}

                  </>
                )}
              </td>
              <td>
                <button
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => onEditClick(q._id, q)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  onClick={() => {
                    onXClick(q._id);
                  }}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}