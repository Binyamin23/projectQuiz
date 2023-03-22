import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Loading from '../../comps_general/loading';
import { API_URL, doApiGet, doApiMethod } from '../../services/apiService';
import { getLocal } from '../../services/localService';
import GameAppItem from '../misc/gameAppItem';

export default function FavsGameList() {
  // יכיל את הרשימה של האפליקציות/משחקים של אותה קטגוריה
  const [ar, setAr] = useState([]);
  const [favsLocal_ar,setFavsLocalAr] = useState(getLocal());
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
   
// מביא את רשימת המשחקים של אותה קטגוריה
    console.log(favsLocal_ar);
    let url = `${API_URL}/gamesApps/groupsApp`;
    let data = await doApiMethod(url,"POST",{ids:favsLocal_ar});
    console.log(data);
    setAr(data);
    setLoading(false);
  }

  return (
    <div className='container py-4 text-center'>
      {loading ? <Loading /> :
      <React.Fragment>
        <h1 className='display-4'>Your favorties App/Games</h1>
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
