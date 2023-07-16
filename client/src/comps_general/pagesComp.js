import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { doApiGet } from '../services/apiService';

export default function PagesComp(props) {
  // props needed: apiPages, linkTo, linkCss

  const [pages,setPages] = useState();

  useEffect(() => {
    doApi();
    
  
  },[props.apiPages])

  const doApi = async() => {
    // let url = `http://localhost:3002/gamesApps/count?perPage=5`
    console.log(props.apiPages)
    let resp = await doApiGet(props.apiPages);
    console.log(resp);
    setPages(resp.pages);
  }


  return (
    <div>
      <span>Page: </span>
      {[...Array(pages)].map((item,i) => {
        return(
          <Link to={props.linkTo+(i+1)} key={i} className={props.linkCss}>{i+1}</Link>
        )
      })}
    </div>
  )
}
