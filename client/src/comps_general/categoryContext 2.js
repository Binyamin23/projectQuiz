import React, { useState } from 'react'
import { selectedEditCategory } from '../context/createContext';
import { CategoryContext } from '../context/createContext';

const CategoryProvider = ({ children }) => {
   
const [selectedCategory, setSelectedCategory] = useState();

    return (
        <CategoryContext.Provider value={{selectedCategory, setSelectedCategory }}>
            {children}
        </CategoryContext.Provider>
    )
}

export default CategoryProvider;
