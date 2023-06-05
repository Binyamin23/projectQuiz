import React, { useState } from 'react'
import { CategoryContext } from '../context/createContext';

const CategoryEdit = ({ children }) => {
   
const [editCategory, setEditCategory] = useState();

    return (
        <CategoryContext.Provider value={{editCategory, setEditCategory }}>
            {children}
        </CategoryContext.Provider>
    )
}

export default CategoryEdit
