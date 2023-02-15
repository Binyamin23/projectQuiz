import axios from 'axios';
import React, { useRef } from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useForm  } from "react-hook-form"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import AuthClient from '../../comps_general/authClient';
import Loading from '../../comps_general/loading';
import { API_URL, doApiGet, doApiMethod, fixImageUrl, TOKEN_KEY } from '../../services/apiService';

export default function EditGame() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [catgories_ar,setCategoriesAr] = useState([]);
  const [formInfo,setFormInfo] = useState({});
  const params = useParams();
  const nav = useNavigate();
  const fileRef = useRef()

  useEffect(() => {
    GetCategoriesAndFormInfo();
  },[])

  const onSubForm = (_bodyData) => {
    console.log(_bodyData);
    doApiPut(_bodyData)
  }

  const GetCategoriesAndFormInfo = async() => {
    let url = API_URL+"/categories";
    let data = await doApiGet(url);
    console.log(data);
    setCategoriesAr(data); 

    let formItemInfoUrl = API_URL+"/gamesApps/single/"+params["id"];
    let dataFormInfo = await doApiGet(formItemInfoUrl);
    console.log(dataFormInfo);
    setFormInfo(dataFormInfo);
  }

  const doApiPut = async(_bodyData) => {
    try{
    

      let url = API_URL+"/gamesApps/"+params["id"];
      let data = await doApiMethod(url,"PUT",_bodyData);

      // מזהה אם המשתמש מנסה ללעלות קובץ
      if(fileRef.current.files.length > 0){
        // alert("There file to upload")
        let url = API_URL+"/upload/gamesApp/"+formInfo._id;
        let formData = new FormData()
        formData.append("myFile",fileRef.current.files[0])
        let resp = await axios.post(url, formData,{
          headers: {
            "x-api-key": localStorage[TOKEN_KEY]
          }
        });
        if(resp.data.status == 200){
          toast.success("File img and Game/app updated!");
          return  nav(-1)
        }
        else{
          return toast.error("There problem with the file")

        }
      }

      if(data.modifiedCount == 1){
        toast.success("Game/app updated!");
        nav(-1)
      }
      else{
        toast.info("You need to change something for update the game/app")
      }
    }
    catch(err){
      alert("There problem");
      console.log(err);
      
    }
  }

  return (
    <div className='container mt-3'>
      <AuthClient />
      <h1 className='text-info'>Edit App/Games form</h1>
      <Link to="/userGameList" className='btn btn-danger' >Cancel</Link>
      {!formInfo._id ? <Loading /> :
      <form className='col-md-6' onSubmit={handleSubmit(onSubForm)} id="id_form" >
        <label>name</label>
        <input defaultValue={formInfo.name} {...register("name", { required: true, minLength: 2 })} className="form-control" type="text" />
        {errors.name && <div className="text-danger">* Enter valid name</div>}
        <label>info</label>
        {/* row -> גובה הטקסט אריאה לפי שורות */}
        <textarea defaultValue={formInfo.info} rows={3} {...register("info", { required: true, minLength: 2 })} className="form-control" type="textarea"></textarea>
        {errors.info && <div className="text-danger">* Enter valid info</div>}
        <label>price</label>
        <input defaultValue={formInfo.price} {...register("price", { required: true, min: 1 })} className="form-control" type="number" />
        {errors.price && <div className="text-danger">* Enter valid price</div>}
        <label>img_url (you can upload file or enter url of the image):</label>
        
        <input className='form-control' ref={fileRef} type="file" />

        <input defaultValue={formInfo.img_url} {...register("img_url", { required: false, minLength: 2 })} className="form-control" type="text" />
        {errors.img_url && <div className="text-danger">* Enter valid img_url</div>}
        {/* image preview */}
        <div>
          <img src={fixImageUrl(formInfo.img_url)} height="50" alt={formInfo.name} /> 
        </div>
        
        <label>link_url</label>
        <input defaultValue={formInfo.link_url} {...register("link_url", { required: true, minLength: 2 })} className="form-control" type="text" />
        {errors.link_url && <div className="text-danger">* Enter valid link_url</div>}

        <label>category_url</label>
        <select defaultValue={formInfo.category_url} {...register("category_url", { required: true, minLength: 2 })} className="form-select" type="select" >
          {catgories_ar.map(item => {
            return (
              <option key={item._id} value={item.url_code}>{item.name}</option>
            )
          })}
        </select>

        <button className='btn btn-info mt-3'>Update game/app</button>
      </form> }
    </div >
  )
}
