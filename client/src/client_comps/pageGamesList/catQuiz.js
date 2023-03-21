import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Loading from '../../comps_general/loading';
import { API_URL, doApiGet } from '../../services/apiService';
import GameAppItem from '../misc/gameAppItem';

export default function CatQuiz() {
  const [ar, setAr] = useState([]);
  const [cat, setCat] = useState("c");
  const [level, setLevel] = useState(1);
  const params = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  
    setCat(params["catName"] || "c")
    setLevel(params["level"] || 1)
  }, [params["catName"], params["level"]])


  return (
    <div>
      <h1>Quiz</h1>
      <h2>{cat}</h2>
      <h2>{level}</h2>
    </div>
  )
}
