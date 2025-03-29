import { useState } from 'react';
import React from "react";
import '../styles/mainCard.css';
import { getPlayerInfo } from "../api/footballApiCall";
import defaultImage from '../assets/default.png';

const MainCard = () => {
    const [banList, setBanList] = useState([]);
    const [playerInfo, setPlayerInfo] = useState({
        name: '',
        nickname: '',
        age: '',
        photo: defaultImage,
        category: '',
        height: '',
        weight: '',
        reach: ''
    });

    const getNewPlayerInfo = () => {
        getPlayerInfo(banList).then((data) => {
            setPlayerInfo(data);
        });
    }

    const addToBanList = () => {
        if (playerInfo.category && !banList.includes(playerInfo.category)) {
            const updatedBanList = [...banList, playerInfo.category];
            setBanList(updatedBanList);
            console.log('Ban List:', updatedBanList);
        }
    }

    const removeFromBanList = (categoryToRemove) => {
        const updatedBanList = banList.filter(category => category !== categoryToRemove);
        setBanList(updatedBanList);
        console.log('Updated Ban List:', updatedBanList);
    }

    const handleError = (e) => {
        e.target.src = defaultImage;
        e.target.onerror = null;
    };

    return (
        <>
            <div className="main-card">
                <h1>{playerInfo.name}</h1>
                <h2>{playerInfo.nickname}</h2>
                <img src={playerInfo.photo || defaultImage} onError={handleError} alt={playerInfo.name} />
                <p className='stat'>Age: {playerInfo.age}</p>
                <p onClick={addToBanList} className='stat category'>
                    Category: {playerInfo.category}
                </p>
                <p className='stat'>Height: {playerInfo.height}</p>
                <p className='stat'>Weight: {playerInfo.weight}</p>
                <p className='stat'>Reach: {playerInfo.reach}</p>
                <button type='submit' onClick={getNewPlayerInfo}>Get New Fighter</button>
            </div>
            {
                banList.length > 0 && (
                    <div className='ban-list'>
                        <h3>Banned Categories (click to remove):</h3>
                        <ul>
                            {banList.map((category, index) => (
                                <li
                                    key={index}
                                    onClick={() => removeFromBanList(category)}
                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </>
    )
}

export default MainCard;