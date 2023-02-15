import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Loading from '../../comps_general/loading';
import { API_URL, doApiGet } from '../../services/apiService';
import GameAppItem from '../misc/gameAppItem';

export default function PageGamesList() {
  // יכיל את הרשימה של האפליקציות/משחקים של אותה קטגוריה
  const [ar, setAr] = useState([]);
  // יכיל את המידע על הקטגוריה
  const [catInfo, setCatInfo] = useState({});
  const params = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log(params["catName"]);
    doApi();
  }, [])

  const doApi = async () => {
    setLoading(true);
    // מביא מידע נוסף על הקטגוריה
    let catName = params["catName"];
    let urlCat = `${API_URL}/categories/byCode/${catName}`;
    let dataCat = await doApiGet(urlCat);
    console.log(dataCat);
    setCatInfo(dataCat)

// מביא את רשימת המשחקים של אותה קטגוריה
    let url = `${API_URL}/gamesApps/?cat=${catName}`;
    let data = await doApiGet(url);
    console.log(data);
    setAr(data);
    setLoading(false);
  }

  return (
    <div className='container py-4 text-center'>
      {loading ? <Loading /> :
      <React.Fragment>
        <h1 className='display-4'>Apps/games of {catInfo.name} list:</h1>
        <p className='lead'>{catInfo.info}</p>
        <div className="row justify-content-center">

          {ar.map(item => {
            return (
              <GameAppItem key={item._id} item={item} />
            )
          })}
        </div>
      </React.Fragment>
      }
    </div>
  )
}
