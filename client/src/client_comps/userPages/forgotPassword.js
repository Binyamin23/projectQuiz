import React, { useRef, useState } from 'react';
import { API_URL, REQUSET_RESET_PASSWORD, doApiPost } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const emailRef = useRef();
  const [msg, setMsg] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const nav = useNavigate();

  const requsetResetPassword = async () => {
    setLoading(true);
    setErrMsg(null);
    setMsg(null);
    try {
      console.log(REQUSET_RESET_PASSWORD);
      const { data } = await doApiPost(REQUSET_RESET_PASSWORD, {
        email: emailRef.current.value,
        redirectUrl: API_URL + '/resetPassword'
      });
      setToggle(true);
      console.log(data);
      setMsg(data.message);

      setTimeout(() => {
        setToggle(true);
        nav('/login');
        setLoading(false);
      }, 3000);
    } catch (err) {
      setToggle(true);
      if (err.response && err.response.data) {
        console.log(err.response);
        setErrMsg(err.response.data.message);
      } else {
        console.error(err);
        setErrMsg("An unexpected error occurred.");
      }
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '100vh' }}>
      <div className='w-fit mx-auto p-5 shadow-2xl rounded-xl border mt-5'>
        <p className='text-base my-2'>Enter your email to reset your password:</p>
        <input
          ref={emailRef}
          className='form-control mb-2 rounded-2xl px-2 h-100 w-100'
          type='email'
          placeholder='Enter your email....'
        />
        <button
          disabled={toggle}
          onClick={requsetResetPassword}
          className='btn btn-primary mb-2'
        >
          Send Email
        </button>
        {toggle && errMsg && (
          <button
            onClick={() => {
              setToggle(false);
              setMsg(null);
              setErrMsg(null);
            }}
            className='btn btn-secondary mx-2 mb-2'
          >
            Try Again
          </button>
        )}

        {msg && <p className='text-base text-success my-2'>{msg}</p>}
        {loading && (
          <div>
         <iframe src="https://giphy.com/embed/3y0oCOkdKKRi0" width="480" height="350" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
         <p>
          <a href="https://giphy.com/gifs/3y0oCOkdKKRi0">via GIPHY</a>
          </p>
          </div>
        )}
        {errMsg && (
          <pre className='text-base text-danger my-2 whitespace-pre-wrap overflow-auto'>
            {errMsg}
          </pre>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;