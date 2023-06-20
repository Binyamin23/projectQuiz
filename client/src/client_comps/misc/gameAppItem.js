import React from 'react'
import { Link } from 'react-router-dom';
import {fixImageUrl} from "../../services/apiService"

export default function GameAppItem(props) {
  let item = props.item;
  return (
    <div className='col-md-3 text-center'>
      <div className='p-2 shadow h-100'>
        <div style={{backgroundImage:`url(${fixImageUrl(item.img_url)})`}} className='bg-item-app'></div>
        <h4>{item.name}</h4>
        <div>Category: {item.category_url}</div>
        <Link className='text-info' to={"/info/"+item._id}>More info</Link>
      </div>
    </div>
  )
}
