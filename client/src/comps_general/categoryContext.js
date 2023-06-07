import React, { useState } from 'react'
import { selectedEditCategory } from '../context/createContext';

const CategoryContext = ({ children }) => {
   
const [selectedCategory, setSelectedCategory] = useState();

    return (
        <selectedEditCategory.Provider value={{selectedCategory, setSelectedCategory }}>
            {children}
        </selectedEditCategory.Provider>
    )
}

export default CategoryContext
