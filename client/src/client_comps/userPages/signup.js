import React, { useRef } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL, doApiMethod } from '../../services/apiService';

export default function Signup() {
  const nav = useNavigate();
  const fileRef = useRef();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubForm = (bodyData) => {
    const formData = new FormData();
    for (let key in bodyData) {
        formData.append(key, bodyData[key]);
    }
    // Append the file
    if (fileRef.current.files.length > 0) {
      formData.append('myFile', fileRef.current.files[0]);
    }
    console.log(formData)
    doApi(formData);
  }

  const doApi = async (bodyData) => {

    try {
      let url = API_URL + '/users/signUp';
      let data = await doApiMethod(url, "POST", bodyData);
      if (data._id) {
        nav("/login");
        toast.success("You signed up successfully. Now you can sign in.")
      }
    }
    catch (err) {
      console.log(err);
      if (err.response && err.response.data) {
        if (err.response.data.code == 11000) {
          toast.error("Email already in system. Please log in instead.");
          nav('/login');
        }
        else if (err.response.status === 400 && Array.isArray(err.response.data.details)) {
          // This is a validation error
          const message = err.response.data.details.map(detail => detail.message).join(', ');
          toast.error(message);
        }
      }
      else {
        toast.error("There is a problem. Please try again later.");
      }
    }
}


  return (
    <div className="container-fluid p-4 bg-light">
      <div className="row justify-content-center">
        <div className="col-11 col-md-6 p-4 bg-white shadow rounded-2">
          <h1 className="text-center mb-4">Sign up to our site</h1>
          <form onSubmit={handleSubmit(onSubForm)}>
            <div className="form-group fw-bold">
              <label>Name:</label>
              <input {...register("name", { required: true, minLength: 2, maxLength: 30 })} className="form-control" type="text" />
              {errors.name && <div className="text-danger">* Enter a valid name (min 2 chars)</div>}
            </div>
            <div className="form-group fw-bold">
              <label>Email:</label>
              <input {...register("email", { required: true, minLength: 2, maxLength: 30 })} className="form-control" type="email" />
              {errors.email && <div className="text-danger">* Enter a valid email (min 2 chars)</div>}
            </div>
            <div className="form-group fw-bold">
              <label>Password:</label>
              <input {...register("password", { required: true, minLength: 2, maxLength: 30 })} className="form-control" type="password" />
              {errors.password && <div className="text-danger">* Enter a valid password (min 2 chars)</div>}
            </div>
            <div className="form-group fw-bold">
              <label>img</label>
              <input ref={fileRef} className="form-control" type="file" />
            </div>
            <div className="mt-4 text-center">
              <div className="form-check d-flex justify-content-center">
                <input className="form-check-input me-2" type="checkbox" {...register('agreeToPrivacy', { required: true })} />
                <label className="form-check-label">
                 I agree to the<span><Link to="/privacy-policy"> privacy policy</Link></span> 
                </label>
              </div>
              {errors.agreeToPrivacy && <div className="text-danger">* You must agree to the privacy policy and terms of service</div>}
              <button className="btn btn-primary w-50 mt-3 d-block mx-auto">Sign up</button>
            </div>



            <p className='mt-4 text-center'>Do you have an account? <br></br> <Link className='text-primary' to="/login"><strong> Sign in</strong></Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}