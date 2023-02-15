import React, { useEffect } from 'react'
import { API_URL, doApiGet } from '../services/apiService'
import { useNavigate } from "react-router-dom"

export default function AuthAdmin() {
  const nav = useNavigate();

  useEffect(() => {
    doApi();
  }, [])

  const doApi = async () => {
    let url = API_URL + "/users/checkToken"
    try {
      let data = await doApiGet(url);
      if (data.role != "admin") {
        // send to login and show message to login again
        alert("You need to be admin to login to this area")
        nav("/admin")
      }
    }
    catch(err){
      alert("You need to login again to this area")
      nav("/admin")
    }
  }


  return (
    <React.Fragment></React.Fragment>
  )
}
