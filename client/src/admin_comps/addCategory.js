import React, { useRef } from 'react'
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { API_URL, doApiMethod, TOKEN_KEY } from '../services/apiService';
import AuthAdmin from './authAdmin';

export default function AddCategory() {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const nav = useNavigate();
  const fileRef = useRef();

  const onSub = (bodyData) => {
    const formData = new FormData();
    for(let key in bodyData){
      formData.append(key, bodyData[key]);
    }
    // Append the file
    formData.append('myFile', fileRef.current.files[0]);
    doApi(formData);
  }

  const doApi = async (bodyData) => {
    try {
      let url = API_URL + "/categories/newCat";
      let data = await doApiMethod(url, "POST", bodyData);
      if (data.newCategory._id) {
        toast.success("Category added successfully!");
        nav("/admin/categories");
      }
    }
    catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(`Error: ${err.response.data}`);
      } else {
        toast.error("There was a problem. Please come back later");
      }
    }
  }

  return (
    <div className='container' style={{ maxWidth: "100%", overflowX: "hidden" }}>
      <AuthAdmin />
      <h1 className='my-3 text-center'>Add new Category to the system</h1>
      <form onSubmit={handleSubmit(onSub)} id="id_form" className='col-lg-6 mx-auto shadow p-5 rounded' >
        <label>Name</label>
        <input {...register("name", { minLength: 2, required: true })} className="form-control" type="text" />
        {errors.name && <div className='text-danger'>* Enter valid name (min 2 chars)</div>}

        <label>url_code</label>
        <input {...register("url_code", { minLength: 2, required: true })} className="form-control" type="text" />
        {errors.url_code && <div className='text-danger'>* Enter valid url_code (min 2 chars)</div>}

        <label>Upload Image</label>
        <div className="form-group">
          <input ref={fileRef} type="file" className="form-control-file" />
        </div>

        <label>info</label>
        <input {...register("info", { minLength: 2, required: true })} className="form-control" type="text" />
        {errors.info && <div className='text-danger'>* Enter valid info (min 2 chars)</div>}

        <div className='mt-4'>
          <button className='btn btn-success'>Add new</button>
        </div>
      </form>
    </div>
  )
}

