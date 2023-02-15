import axios from 'axios';
import React, { useRef } from 'react'
import { API_URL } from '../services/apiService';

export default function TestUpload() {

  const fileRef = useRef();

  const onSub = (e) => {
    e.preventDefault();
    uploadFile();
    
  }
  
  const uploadFile = async() => {
    console.log(fileRef.current.files)
    try{

      if(fileRef.current.files){
        let url = API_URL+"/upload/gamesApp";
        let formData = new FormData()
        // אינפוט של קבצים , אין להם וויליו
        // אך יש להם פיילס שהוא מערך/רשימה
        // של קבצים שהמשתמש בחר
        // אם נתעסק עם קובץ אחד בעצם נעלה את תא 0
        formData.append("myFile",fileRef.current.files[0])
        let resp = await axios.post(url, formData);
        console.log(resp.data)
      }
    }
    catch(err){
      console.log(err);
      alert("There problem")
    }
    
  }

  return (
    <div className='container'>
      <h2>Test upload file form:</h2>
      <form onSubmit={onSub} className='col-md-6 '>
        <label>Choose file</label>
        <br/>
        <input ref={fileRef} type="file" />
        <button>Upload</button>
      </form>
    </div>
  )
}
