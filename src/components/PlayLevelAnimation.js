import React, { useState, useEffect } from "react";
import './PlayLevelAnimation.scss';

export default function PlayLevelAnimation(props) {

    const [second, setSecond] = useState(-1);
    const [text, setText] = useState('');

    useEffect(() => {
        const playingTexts = ['On your marks', 'Set', 'Go!'];
        let interval = null;
        const timeout = setTimeout(() => {
            setSecond(0); 
            setText(playingTexts[0]);
            interval = setInterval(() => {
                let index;
                setSecond((second) => {index = second+1; return second+1;}); 
                setText(playingTexts[index]);
                if(index === 3) {
                    clearInterval(interval);
                    setSecond(-1); 
                    setText('');
                    props.endAnimation();
                }
            }, 1500);
        }, 1000);

        // cleanup on unmount
        return () => { 
            clearInterval(interval); 
            clearTimeout(timeout);
        }
    }, []);

    return (
        <div className="play-level-message">
            <div className="traffic-lights">
                <div className="light" style={second === 0 ? { backgroundColor: 'red', boxShadow: '0px 0px 50px' } : {}}></div>
                <div className="light" style={second === 1 ? { backgroundColor: 'yellow', boxShadow: '0px 0px 50px' } : {}}></div>
                <div className="light" style={second === 2 ? { backgroundColor: '#7cfc00', boxShadow: '0px 0px 50px' } : {}}></div>
            </div>
            <div className="slide-text">
                {text}
            </div>
        </div>
    );
}