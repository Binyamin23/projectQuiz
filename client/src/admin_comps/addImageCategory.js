import React, { useState } from 'react';
import axios from 'axios';
import { API_URL, TOKEN_KEY } from '../services/apiService';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

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
      toast.success('Picture uploaded successfully.');
    } catch (error) {
      console.log(error);
      toast.error('Error uploading picture.');
    }
    setPictureComp(null)
  };

  return (
    <div className="p-3 mt-3 border rounded bg-light">
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label className='text-dark'>Choose a picture to upload:</Form.Label>
        <Form.Control type="file" onChange={handlePictureChange} />
      </Form.Group>
      <Button variant="primary" onClick={handlePictureUpload}>Upload</Button>
    </div>
  );
};

export default AddPictureToCategory;
