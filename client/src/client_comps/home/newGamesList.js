import React, { useEffect, useState } from 'react'
import { API_URL, doApiGet } from '../../services/apiService';
import GameAppItem from '../misc/gameAppItem';

export default function NewGamesList() {
  const [ar,setAr] = useState([])


  useEffect(() => {
    doApi();
  },[])

  const doApi = async() => {
    let url = API_URL+"/gamesApps?perPage=4";
    let data = await doApiGet(url);
    console.log(data);
    setAr(data);
  }

  return (
    <div>
      <hr className='shadow'/>
      <h2>New games/apps in the site:</h2>
      <div className="row pb-5">
        {ar.map(item => {
          return(
            <GameAppItem key={item._id} item={item}/>
          )
        })}
      </div>
    </div>
  )
}
