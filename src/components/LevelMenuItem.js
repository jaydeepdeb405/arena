import React from 'react';
import LevelMenuItemDifficulty from "./LevelMenuItemDifficulty";
import './LevelMenuItem.scss';
import lockIcon from '../images/arena-level-lock-icon.svg';

export default function LevelMenuItem(props) {

    return (
        <div className="menu-space">
            <div className={props.level.locked === true ? 'menu-item locked': 'menu-item'} onClick={(event) => props.flipItem(event, props.index, props.level.locked)}>
                {props.level.locked === true ? 
                <img className="lock-icon" src={lockIcon} />: 
                <div className="menu-face level">{props.level.label}</div>}
                <div className="menu-face difficulty">
                    {props.difficulties.map((difficulty, difficultyIndex) => {
                      return <LevelMenuItemDifficulty key={difficultyIndex} level={props.level} difficulty={difficulty} playLevel={props.playLevel}/>
                    })}
                </div>
            </div>
        </div>
    );
}