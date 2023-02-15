import React, { useEffect } from 'react'
import { API_URL, doApiGet } from '../services/apiService'
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';

export default function AuthClient() {
  const nav = useNavigate();

  useEffect(() => {
    doApi();
  }, [])

  const doApi = async () => {
    let url = API_URL + "/users/checkToken"
    try {
      let data = await doApiGet(url);
      if(!data.role){
        alert("There problem , com back later")
      }
    }
    catch(err){
      toast.error("You need login to be here, or your token expired , log in again")
      nav("/login")
    }
  }


  return (
    <React.Fragment></React.Fragment>
  )
}
