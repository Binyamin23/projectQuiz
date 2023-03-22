import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { API_URL, doApiGet } from '../../services/apiService';

export default function CatQuiz() {
  const [ar, setAr] = useState([]);
  const [cat, setCat] = useState("c");
  const [level, setLevel] = useState(1);
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState({});

  useEffect(() => {

    setCat(params["catName"] || "c")
    setLevel(params["level"] || 1)

    fetchCats();
  }, [params["catName"], params["level"]])

  const fetchCats = async () => {
    try {
      const data = await doApiGet(API_URL + `/categories/byCode/${cat}`);
      console.log(data);
      setCategory(data);
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='container-fluid container-quiz' style={{backgroundImage:`url(${API_URL+'/'+category.img_url})`, backgroundSize:"cover", minHeight:"100vh"}}>
      <div className='row justify-content-around'>
        <div className='col-10 col-md-6 border text-center justify-content-around'>
          <h2 className='p-2'>{cat}</h2>
        </div>
      </div>
    </div>
  )
}
