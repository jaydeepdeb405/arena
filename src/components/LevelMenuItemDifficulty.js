import React from 'react';
import lockIcon from '../images/arena-level-lock-icon.svg';

export default function LevelMenuItemDifficulty(props) {

    return (
        <div className="difficulty-wrapper">
            {props.difficulty.locked == true ?
                <div className="locked">
                    <img className="lock-icon" src={lockIcon} />
                </div> :
                <div onClick={() => props.playLevel(props.difficulty.locked, props.level, props.difficulty)}>
                    <img src={require(`../images/${props.difficulty.icon}`)} />
                    <span>{props.difficulty.label}</span>
                </div>}
        </div>
    );
}