import React, { useContext } from 'react'
import { useForm } from "react-hook-form"
import { API_URL, doApiMethod, TOKEN_KEY } from '../../services/apiService';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/createContext';

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
      setUser(true);
      nav("/");
      toast.info("You logged in");
    }
    catch (err) {
      console.log(err);
      toast.error("Email or password wrong!");
    }
  }

  return (
    <div className="container-fluid p-4 bg-light">
      <div className="row justify-content-center">
        <div className="col-11 col-md-6 p-4 bg-white shadow">
          <h1 className="text-center mb-4">Sign in to our site</h1>
          <form onSubmit={handleSubmit(onSub)}>
            <div className="form-group fw-bold">
              <label>Email:</label>
              <input {...register("email", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })} type="text" className="form-control" />
              {errors.email && <div className="text-danger">* Enter valid email</div>}
            </div>
            <div className="form-group fw-bold">
              <label>Password:</label>
              <input {...register("password", { required: true, minLength: 3 })} type="password" className="form-control" />
              {errors.password && <div className="text-danger">* Enter valid password (min 3 chars)</div>}
            </div>
            <div className="d-flex justify-content-between mt-2">
              <div className="div_checkbox align-items-center">
                <div className="d-flex align-items-center">
                  <div className="form-check">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="form-check-input"
                    />
                    <label htmlFor="remember-me" className="form-check-label">
                      Remember me
                    </label>
                  </div>
                </div>
              </div>
              <div className="div_link">
                <Link to={'/forgotPassword'} className="fw-bold text-decoration-none" style={{ color: '#007BFF' }}>
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div className="text-center mt-4">
              <button className="btn btn-primary w-50">Sign in</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}