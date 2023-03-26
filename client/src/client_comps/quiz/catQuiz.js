import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL, doApiGet } from '../../services/apiService';

import './quiz.css';

export default function CatQuiz() {
  const [cat, setCat] = useState('c');
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState({});

  const params = useParams();

  useEffect(() => {
    setCat(params['catName'] || 'c');
  }, [params['catName']]);

  useEffect(() => {
    fetchCats();
  }, [cat]);

  const fetchCats = async () => {
    try {
      const data = await doApiGet(API_URL + `/categories/byCode/${cat}`);
      setCategory(data);
      setLoading(true);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setCategory({ img_url: '../../images/logo.png' }); // set default image URL or null
    }
  };

  return (
    <div
      className="container-fluid container-quiz"
      style={{
        backgroundImage: `url(${API_URL + (category?.img_url || '../../images/logo.png')})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        
      }}
    >
      {loading ? (
        <div className="row justify-content-around">
          <div className="col-10 col-md-6 border text-center justify-content-around">
            <h2 className="p-2">{cat}</h2>
          </div>
        </div>
      ) : (
        'loading...'
      )}
    </div>
  );
}
