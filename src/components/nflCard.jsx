import { useState } from 'react';
import React from "react";
import '../styles/mainCard.css';
import { getPlayerInfo } from "../api/nflAPI";
import defaultImage from '../assets/default2.png';

const MainCard = () => {
    const [banList, setBanList] = useState([]);
    const [playerInfo, setPlayerInfo] = useState({
        name: '',
        age: '',
        image: defaultImage,
        position: '',
        height: '',
        weight: '',
        college: ''
    });

    const getNewPlayerInfo = () => {
        getPlayerInfo(banList).then((data) => {
            setPlayerInfo(data);
        });
    }

    const addToBanList = () => {
        if (playerInfo.position && !banList.includes(playerInfo.position)) {
            const updatedBanList = [...banList, playerInfo.position];
            setBanList(updatedBanList);
            console.log('Ban List:', updatedBanList);
        }
    }

    const removeFromBanList = (positionToRemove) => {
        const updatedBanList = banList.filter(position => position !== positionToRemove);
        setBanList(updatedBanList);
        console.log('Updated Ban List:', updatedBanList);
    }

    const handleError = (e) => {
        e.target.src = defaultImage;
        e.target.onerror = null;
    };

    return (
        <div className='comp-container'>
            <div className="main-card">
                <h1>{playerInfo.name}</h1>
                <h2>{playerInfo.college}</h2>
                <img src={playerInfo.image || defaultImage} onError={handleError} alt={playerInfo.name} />
                <p className='stat'>Age: {playerInfo.age}</p>
                <p onClick={addToBanList} className='stat category'>
                    Position: {playerInfo.position}
                </p>
                <p className='stat'>Height: {playerInfo.height}</p>
                <p className='stat'>Weight: {playerInfo.weight}</p>
                <button type='submit' onClick={getNewPlayerInfo}>Get New Player</button>
            </div>
            {
                banList.length > 0 && (
                    <div className='ban-list'>
                        <h3>🚫Banned Categories (click to remove):</h3>
                        <ul>
                            {banList.map((position, index) => (
                                <li
                                    key={index}
                                    onClick={() => removeFromBanList(position)}
                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    {position}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </div>
    )
}

export default MainCard;