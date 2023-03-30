import React from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL, doApiMethod } from '../../services/apiService';

export default function Signup() {
  const nav = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubForm = (bodyData) => {
    console.log(bodyData);
    doApi(bodyData);
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
      if (err.response.data.code == 11000) {
        toast.error("Email already in system. Please log in instead.");
        nav('/login');
      }
      else {
        alert("There is a problem. Please try again later.");
        console.log(err);
      }
    }
  }

  return (
    <div className="container-fluid p-4 bg-light">
      <div className="row justify-content-center">
        <div className="col-11 col-md-6 p-4 bg-white shadow rounded-2">
          <h1 className="text-center mb-4">Sign up to our site</h1>
          <form onSubmit={handleSubmit(onSubForm)}>
            <div className="form-group">
              <label>Name:</label>
              <input {...register("name", { required: true, minLength: 2, maxLength: 30 })} className="form-control" type="text" />
              {errors.name && <div className="text-danger">* Enter a valid name (min 2 chars)</div>}
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input {...register("email", { required: true, minLength: 2, maxLength: 30 })} className="form-control" type="email" />
              {errors.email && <div className="text-danger">* Enter a valid email (min 2 chars)</div>}
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input {...register("password", { required: true, minLength: 2, maxLength: 30 })} className="form-control" type="password" />
              {errors.password && <div className="text-danger">* Enter a valid password (min 2 chars)</div>}
            </div>
            <div className="mt-4 text-center">
              <div className='form-check'>
                <input className='form-check-input' type='checkbox'/>
                {/* {...register('agreeToPrivacy', { required: true })}  */}
                <label className='form-check-label'>
                  I agree to the <Link to='/privacy-policy'>privacy policy</Link> and <Link to='/terms-of-service'>terms of service</Link>
                </label>
                {errors.agreeToPrivacy && (<div className='text-danger'>* You must agree to the privacy policy and terms of service</div>)}
              </div>
              <button className="btn btn-primary w-50 mt-3">Sign up</button>
            </div>
            <p className='mt-4 text-center'>Do you have an account? <br></br> <Link className='text-primary' to="/login"><strong> Sign in</strong></Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}