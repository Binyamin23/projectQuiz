import React from 'react'
import {useForm} from "react-hook-form"
import { API_URL,doApiMethod, TOKEN_KEY } from '../services/apiService';
import {useNavigate} from "react-router-dom";

export default function LoginAdmin() {

  const{register , handleSubmit ,  formState: { errors } } = useForm();
  const nav = useNavigate();

  // הפונקציה תופעל רק אם הוולדזציה של כל האינפוטים/סלקטים
  // יהיו נכונים
  const onSub = (bodyData) => {
    console.log(bodyData)
    doApi(bodyData);
  }

  const doApi = async(bodyData) => {
    try{
      let url = API_URL+"/users/login";
      let data = await doApiMethod(url,"POST",bodyData);
      console.log(data);
      // save local of token
      localStorage.setItem(TOKEN_KEY, data.token);
      // navigate to categoriesList.js
      nav("/admin/categories")
    }
    catch(err){
      console.log(err);
      alert("Email or passwrod worng!");
    }
    
  }



  return (
    <div className='container'>
      <h1 className='text-center'>Login to admin</h1>
      <form onSubmit={handleSubmit(onSub)} className='col-md-6 mx-auto p-2'>
        <label>Email:</label>
        <input {...register("email",{required:true,pattern:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i})} type="text" className='form-control'/>
        {errors.email && <div className='text-danger'>* Enter valid email</div>}
        <label>Password:</label>
        <input {...register("password",{required:true,minLength:3})} type="text" className='form-control'/>
        {errors.password && <div className='text-danger'>* Enter valid password (min 3 chars)</div>}
        <div className='mt-4'>
          <button className='btn btn-info'>Log in</button>
        </div>
      </form>
    </div>
  )
}
