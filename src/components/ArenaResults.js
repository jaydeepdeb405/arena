import React from 'react';
import { Link } from "react-router-dom";
import './ArenaResults.scss';

export default function ArenaResults(props) {
    return (
        <div className='arena-results'>
            <div className="pyro">
                <div className="before"></div>
                <div className="after"></div>
            </div>
            <h2 className='text'>Your Score: {props.results.score}</h2>
            <h2 className='text'>Time taken: {props.results.timeTaken}</h2>
            <div className='button-panel'>
                <Link to="/leaderboard"><button className='btn btn-success btn-lg'>Leaderboard</button></Link>
                <button className='btn btn-success btn-lg' onClick={() => props.replay()}>
                    <svg className="bi bi-arrow-repeat" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M2.854 7.146a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L2.5 8.207l1.646 1.647a.5.5 0 0 0 .708-.708l-2-2zm13-1a.5.5 0 0 0-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0 0-.708z" />
                        <path fillRule="evenodd" d="M8 3a4.995 4.995 0 0 0-4.192 2.273.5.5 0 0 1-.837-.546A6 6 0 0 1 14 8a.5.5 0 0 1-1.001 0 5 5 0 0 0-5-5zM2.5 7.5A.5.5 0 0 1 3 8a5 5 0 0 0 9.192 2.727.5.5 0 1 1 .837.546A6 6 0 0 1 2 8a.5.5 0 0 1 .501-.5z" />
                    </svg>
                    <span style={{ paddingLeft: '20px' }}>Replay</span>
                </button>
                {props.results.nextLevel === null ? null : 
                <button className='btn btn-success btn-lg' onClick={() => props.playLevel(props.results.nextLevel, props.results.nextDifficulty)}>Next Level</button>}
            </div>
        </div>
    )
}
