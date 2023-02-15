import React from 'react'
import {useForm} from "react-hook-form"
import { API_URL,doApiMethod, TOKEN_KEY } from '../../services/apiService';
import {useNavigate} from "react-router-dom";
import { toast } from 'react-toastify';

export default function Login() {

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
      nav("/");
      toast.info("You logged in");
    }
    catch(err){
      console.log(err);
      toast.error("Email or password wrong!");
    }
    
  }



  return (
    <div className='container p-4'>
      <h1 className='text-center display-4'>Login to the site</h1>
      <p className='lead text-center'>Allow you to add new app/games to our site</p>
      <form onSubmit={handleSubmit(onSub)} className='col-md-6 mx-auto p-2 shadow'>
        <label>Email:</label>
        <input {...register("email",{required:true,pattern:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i})} type="text" className='form-control'/>
        {errors.email && <div className='text-danger'>* Enter valid email</div>}
        <label>Password:</label>
        <input {...register("password",{required:true,minLength:3})} type="text" className='form-control'/>
        {errors.password && <div className='text-danger'>* Enter valid password (min 3 chars)</div>}
        <div className='mt-4 text-center'>
          <button className='btn btn-warning col-4 shadow'>Log in</button>
        </div>
      </form>
    </div>
  )
}
