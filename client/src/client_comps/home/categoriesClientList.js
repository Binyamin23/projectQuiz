import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { API_URL, doApiGet } from '../../services/apiService';

export default function CategoriesClientList() {
  const [ar, setAr] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    doApi();
  }, [])

  const doApi = async () => {
    let url = API_URL + "/categories";
    let data = await doApiGet(url);
    // console.log(data);
    setAr(data);
  }


  return (
    <div className='row g-4 py-5'>
      {ar.map((item, i) => {
        return (
          <article onClick={() => {
            nav("/category/"+item.url_code);
          }} key={item._id} className='col-md-4 '>
            <div className='bg-category shadow center' style={{ backgroundImage: `url(${item.img_url})` }}>
              <h3>
                <Link to={"/category/"+item.url_code}>{item.name}</Link>
              </h3>
            </div>

          </article>
        )
      })}
    </div>
  )
}
