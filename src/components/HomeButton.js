import React, { useState, useEffect } from 'react';
import Notiflix from 'notiflix';
import { Link, useLocation } from "react-router-dom";
import './HomeButton.scss';

export default function HomeButton(props) {

    const [href, setHref] = useState('#');
    
    function confirm() {
        if(props.quizStarted === true) {
            Notiflix.Confirm.Show('Confirm',
                'Exit level?', 'Yes', 'No',
                () => { props.endQuizSession(); },
                () => {  }
            );
        }
    }

    useEffect(() => {
        if(props.quizStarted === true) setHref('#');
        else setHref('/');
    });

    return (
        <>
            {useLocation().pathname !== '/' ?
                <Link to={href}>
                    <div className="home-button" onClick={() => confirm()}>
                        {props.quizStarted === false ?
                        <svg className="bi bi-house-door" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M7.646 1.146a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 .146.354v7a.5.5 0 0 1-.5.5H9.5a.5.5 0 0 1-.5-.5v-4H7v4a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .146-.354l6-6zM2.5 7.707V14H6v-4a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4h3.5V7.707L8 2.207l-5.5 5.5z" />
                            <path fillRule="evenodd" d="M13 2.5V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z" />
                        </svg> :
                        <svg className="bi bi-arrow-return-left" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.854 5.646a.5.5 0 0 1 0 .708L3.207 9l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0z"/>
                        <path fillRule="evenodd" d="M13.5 2.5a.5.5 0 0 1 .5.5v4a2.5 2.5 0 0 1-2.5 2.5H3a.5.5 0 0 1 0-1h8.5A1.5 1.5 0 0 0 13 7V3a.5.5 0 0 1 .5-.5z"/>
                      </svg>}
                    </div>
                </Link> 
                :
                null
            }
        </>
    );
}