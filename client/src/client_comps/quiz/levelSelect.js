import React, { useContext } from 'react';
import { AuthContext, LevelContext } from '../../context/createContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './levelSelect.css'

export default function LevelSelect() {

    const nav = useNavigate();
    const { cat, setCat, level, setLevel } = useContext(LevelContext);
    const { user, admin, setUser, setAdmin } = useContext(AuthContext);

    const handleLevelChange = (newLevel) => {
        if (user || admin || newLevel == 1) {
            setLevel(newLevel);
            window.history.pushState({}, '', `/category/${cat}/level/${newLevel}`);
        } else {
            toast.info('Please log in or sign up to access this level');
            nav('/signup')
        };
    };

     return (
        <div id="level-select-component" className="level-select-container">
            <div className='background-half'>
                <h2 className="level-select-title">Select Level</h2>
                <div className="level-options">
                    <button className={level == 1 ? 'level-option-selected' : 'level-option'} onClick={() => handleLevelChange(1)}>Level 1</button>
                    <button className={level == 2 ? 'level-option-selected' : 'level-option'} onClick={() => handleLevelChange(2)}>Level 2</button>
                    <button className={level == 3 ? 'level-option-selected' : 'level-option'} onClick={() => handleLevelChange(3)}>Level 3</button>
                </div>
            </div>
        </div>
    );
}