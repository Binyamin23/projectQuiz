import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import AddPictureToCategory from './addImageCategory';
import { Button } from 'react-bootstrap';
import './categoriesList.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const Row = ({ item, onXClick, setEditCategory, setShowPicture, editCategory, showPicture, isMobile }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [isAddImage, setIsAddImage] = useState(false)
    const [query] = useSearchParams();
    const { _id, name, url_code, info } = item;


    useEffect(() => {
        if (query.get("edit") == _id) {
            setIsEditing(true);
            setTimeout(() => {
                setIsEditing(false);
            }, 20000)

        };
    }, [query.get("edit")])

    const xClick = () => {
        window.confirm("Delete item?") && onXClick()
    }
    const editClick = () => {
        setEditCategory();
        nav("/admin/categories/edit/" + _id);
    }
    const nav = useNavigate();
    const uploadImage = () => {
        setIsAddImage(!isAddImage);
        if (editCategory != _id) {
            setEditCategory(_id);
            setShowPicture(true);
        }
        else {
            if (editCategory === _id) {
                setShowPicture(true);
            }
            if (editCategory === _id && showPicture) {
                setShowPicture(false);

            }

        }
    }
    return (
        <tr key={_id}>
            <td>
                {name}
                {isEditing &&
                   
                    <FontAwesomeIcon className='ms-3' icon={faCircleCheck} flip style={{ color: "#23d138", transition: 'background-color 3s' }} />
                    
                }
            </td>
            <td>{url_code}</td>
            <td title={info}>{info.substring(0, 15)}...</td>
            <td>
                <Button variant='danger' className={isMobile ? 'w-100 mb-2' : 'm-2'} onClick={xClick}>Delete</Button>
                <Button variant='info' className={isMobile ? 'w-100 mb-2 text-light' : 'm-2 text-light'} onClick={editClick}>Edit</Button>
                <Button style={isMobile ? { padding: "7.5%" } : null} variant='secondary' className={isMobile ? 'w-100' : 'm-2'} onClick={uploadImage}>Add Image</Button>
                {isAddImage &&
                    <AddPictureToCategory
                        categoryId={_id}
                        setPictureComp={setEditCategory}
                        close={() => setIsAddImage(false)}
                    />}
            </td>
        </tr>
    )
}

export default Row