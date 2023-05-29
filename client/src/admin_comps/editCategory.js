import React, { useContext, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { API_URL, doApiGet, doApiMethod } from '../services/apiService';
import { AuthContext } from '../context/createContext';
import useWindowWidth from '../comps_general/useWidth';
import AuthAdmin from './authAdmin';

export default function EditCategory() {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const { user, admin } = useContext(AuthContext);
  const nav = useNavigate();
  const params = useParams();
  const [info, setInfo] = useState({});
  let width = useWindowWidth();
  const [isMobile, setIsMobile] = useState(width < 500);

  useEffect(() => {
    setIsMobile(width < 500);
  }, [width])

  useEffect(() => {
    if (admin) {
      doApiInit();
    } else {
      nav('/login');
    }
  }, [admin, nav]);

  const doApiInit = async () => {
    let url = API_URL + "/categories/single/" + params["id"]
    try {
      let data = await doApiGet(url);
      console.log(data);
      setInfo(data);
    }
    catch (err) {
      console.log(err);
      toast.error("A problem occured")
    }
  }

  const onSub = (bodyData) => {
    console.log(bodyData)
    doApi(bodyData);
  }

  const doApi = async (bodyData) => {
    try {
      let url = API_URL + "/categories/edit/" + params["id"];
      let data = await doApiMethod(url, "PUT", bodyData);
      console.log(data)
      if (data.modifiedCount == 1) {
        toast.info("Category updated")
        nav(-1);
      }
      else {
        toast.error("You didn't change anything since the last update")
        nav(-1)
      }
    }
    catch (err) {
      console.log(err);
      toast.error("There problem come back later");
    }

  }

  return (
    <div className='container' style={{ maxWidth: "100%", overflowX: "hidden" }}>
      <AuthAdmin />

      <h1 className='m-3 text-dark'>Edit category</h1>

      {!info._id ? <h2>Loading...</h2> :
        <form onSubmit={handleSubmit(onSub)} id="id_form" className='col-lg-6 col-md-8 col-sm-12 shadow p-2 mx-auto' >
          <label>Name</label>
          <input defaultValue={info.name} {...register("name", { minLength: 1, required: true })} className="form-control" type="text" />
          {errors.name && <div className='text-danger'>
            * Enter valid name (min 1 chars)
          </div>}

          <input defaultValue={info.url_code} {...register("url_code", { minLength: 1, required: true })} className="form-control" type="hidden" />
          {errors.url_code && <div className='text-danger'>
            * Enter valid url_code (min 1 chars)
          </div>}

          <label>img_url</label>
          <input defaultValue={info.img_url} {...register("img_url", { minLength: 2, required: false })} className="form-control" type="text" />
          {info.img_url.length > 1 && <img src={info.img_url} alt="img" className='w-25 d-block' />}
          {errors.img_url && <div className='text-danger'>
            * Enter valid img_url (min 2 chars)
          </div>}

          <label>info</label>
          <input defaultValue={info.info} {...register("info", { minLength: 2, required: true })} className="form-control" type="text" />
          {errors.info && <div className='text-danger'>
            * Enter valid info (min 2 chars)
          </div>}

          <div>Url code: {info.url_code}</div>

          <div className='mt-4 d-flex justify-content-between'>
            <button  className='btn btn-info'>Update</button>
            <button type='button' onClick={()=>{
              nav(-1)
            }} className='btn btn-danger'>X</button>
          </div>
        </form>
      }
    </div>
  )
}
