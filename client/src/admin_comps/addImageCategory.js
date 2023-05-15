import React, { useState } from 'react';
import axios from 'axios';
import { API_URL, TOKEN_KEY } from '../services/apiService';

const AddPictureToCategory = ({ categoryId, setPictureComp }) => {
  const [picture, setPicture] = useState(null);

  const handlePictureChange = (event) => {
    setPicture(event.target.files[0]);
  };

  const handlePictureUpload = async () => {
    const formData = new FormData();
    formData.append('myFile', picture);
    try {
      await axios.post(`${API_URL}/upload/category/${categoryId}`, formData, {
        headers: {
          'x-api-key': localStorage[TOKEN_KEY],
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Picture uploaded successfully!');
    } catch (error) {
      console.log(error);
      alert('Error uploading picture.');
    }
    setPictureComp(false)
  };

  return (
    <div>
      <label htmlFor="picture">Choose a picture to upload:</label>
      <input type="file" id="picture" onChange={handlePictureChange} />
      <button onClick={handlePictureUpload}>Upload</button>
    </div>
  );
};

export default AddPictureToCategory;
