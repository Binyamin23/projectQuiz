import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Loading from '../../comps_general/loading';
import { API_URL, doApiGet } from '../../services/apiService';
import GameAppItem from '../misc/gameAppItem';

export default function CatQuiz() {
  const [ar, setAr] = useState([]);
  const [cat, setCat] = useState("");
  const [level, setLevel] = useState("");
  const params = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(params["catName"]);
    console.log(params["level"]);
    setCat(params["catName"])
    setLevel(params["level"])
  }, [params["catName"], params["level"]])


  return (
    <div>
      <h2>{cat}</h2>
      <h2>{level}</h2>
    </div>
  )
}
