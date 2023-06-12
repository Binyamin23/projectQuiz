import React, { useContext } from 'react'
import { useForm } from "react-hook-form"
import { API_URL, doApiMethod, TOKEN_KEY } from '../../services/apiService';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/createContext';
import './login.css'

export default function Login() {
  const { user, setUser } = useContext(AuthContext);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const nav = useNavigate();

  const onSub = (bodyData) => {
    console.log(bodyData);
    doApi(bodyData);
  }

  const doApi = async (bodyData) => {
    try {
      let url = API_URL + "/users/login";
      let data = await doApiMethod(url, "POST", bodyData);
      console.log(data);
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(true)
      nav("/");
      toast.info("You logged in");
    }
    catch (err) {
      console.log(err);
      toast.error("Email or password wrong!");
    }
  }

  return (
    <div className="body">
      <div className="login_form_container">
        <form className="login_form" onSubmit={handleSubmit(onSub)}>
          <h2>Login</h2>
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
          <div class="button_group" id="login_button">
            <button>Submit</button>
          </div>
          <div class="fotter">
            <Link to={'/forgotPassword'}><strong>Forgot Password ?</strong></Link>
            <Link to={'/signUp'}><strong>SingUp</strong></Link>
          </div>
        </form>
      </div>
    </div>
  )
}