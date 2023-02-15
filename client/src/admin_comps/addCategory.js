import React from 'react'
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";

import { API_URL,doApiMethod, TOKEN_KEY } from '../services/apiService';
import AuthAdmin from './authAdmin';

export default function AddCategory() {

  const{register , handleSubmit ,  formState: { errors } } = useForm();
  const nav = useNavigate();

  const onSub = (bodyData) => {
    console.log(bodyData)
    doApi(bodyData);
  }

  const doApi = async(bodyData) => {
    try{
      let url = API_URL+"/categories";
      let data = await doApiMethod(url,"POST",bodyData);
      if(data._id){
        alert("Category added");
        // משגר חזרה לרשימה
        nav("/admin/categories");
      }
    
    }
    catch(err){
      console.log(err);
      alert("There problem come back later");
    }
    
  }
  
  return (
    <div className='container'>
      <AuthAdmin />
      <h1 className='display-5'>Add new Category to the system</h1>
      <form onSubmit={handleSubmit(onSub)}  id="id_form" className='col-md-6 shadow p-2' >
        <label>name</label>
        <input {...register("name", {minLength:2,required:true})} className="form-control" type="text" />
        {errors.name && <div className='text-danger'>
          * Enter valid name (min 2 chars)
          </div>}
        <label>url_code</label>
        <input {...register("url_code", {minLength:2,required:true})}  className="form-control" type="text" />
        {errors.url_code && <div className='text-danger'>
          * Enter valid url_code (min 2 chars)
          </div>}
        <label>img_url</label>
        <input {...register("img_url", {minLength:2,required:false})}  className="form-control" type="text" />
        {errors.img_url && <div className='text-danger'>
          * Enter valid img_url (min 2 chars)
          </div>}
        <label>info</label>
        <input {...register("info", {minLength:2,required:true})} className="form-control" type="text" />
        {errors.info && <div className='text-danger'>
          * Enter valid info (min 2 chars)
          </div>}
        <div className='mt-4'>
          <button className='btn btn-success'>Add new</button>

        </div>
      </form>
    </div>
  )
}


