import React, { useRef } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL, doApiMethod } from '../../services/apiService';
import './signup.css'

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
    <div className="bodyy">
      <div className="signUp_form_container">
        <form className="login_form" onSubmit={handleSubmit(onSubForm)}>
          <h2>SignUp</h2>

          <div className="input_group">
            <i class="fa fa-user"></i>
            <input {...register("name", { required: true, minLength: 2, maxLength: 30 })}
              className="input_text" placeholder="UserName" type="text" />
            {errors.name && <div className="text-danger">* Enter a valid email (min 2 chars)</div>}
          </div>
          <div className="input_group">
            <i class="fa fa-envelope-o"></i>
            <input {...register("email", {
              required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
            })} type="email" placeholder="Email" className="input_text" />
            {errors.email && <div className="text-danger">* Enter valid email</div>}
          </div>
          <div className="input_group">
            <i class="fa fa-lock"></i>
            <input {...register("password", { required: true, minLength: 3 })} type="password"
              className="input_text" placeholder="Password" />
            {errors.password && <div className="text-danger">* Enter valid password (min 3 chars)</div>}
          </div>
          <div className="input_group">
            <i class="fa fa-picture-o"></i>
            <input ref={fileRef} style={{border:'none'}} className="input_text form-control" type="file" />
          </div>
          <div className="input_group">
            <input type="checkbox" {...register('agreeToPrivacy', { required: true })} />
            <label>I agree to the<span>
              <Link to="/privacy-policy" className='linkCheckBox' > <strong> Privacy Policy</strong></Link>
            </span>
            </label>
            {errors.agreeToPrivacy && <div className="text-danger">* You must agree to the privacy policy and
              terms of service</div>}
          </div>

          <div class="button_group" id="login_button">
            <button>Submit</button>
          </div>
          <div class="fotter">
            <label style={{fontSize:"18px"}}>Do you have an account??&nbsp;<Link to={'/login'}><strong>SignIn</strong></Link></label>
          </div>

        </form>
      </div>
    </div>

  )
}