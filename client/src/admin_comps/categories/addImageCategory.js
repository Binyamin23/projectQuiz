import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { API_URL, TOKEN_KEY } from '../../services/apiService';

const AddPictureToCategory = ({ categoryId, setPictureComp ,close}) => {

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
        <Form.Label className='text-dark m-1'>Choose a picture to upload:</Form.Label>
        <Form.Control type="file" onChange={handlePictureChange} />
      </Form.Group>
      <Button className='m-1 text-light btn btn-info' onClick={handlePictureUpload}>Upload</Button>
      <button className='btn btn-outline-dark m-1' onClick={close}>Close</button>
    </div>
  );
};

export default AddPictureToCategory;
