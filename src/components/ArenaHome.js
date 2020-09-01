import React,{ useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from './Logo';
import './ArenaHome.scss';

export default function ArenaHome(props) {

    useEffect(() => {
        props.endQuizSession();
    }, []);

    return (
        <div className="arena-home">
            <Logo/>
            <div className="main-menu" >
                <ul style={{ listStyleType: "none", padding: "0" }}>
                    <li className="listPadding">
                        <Link to="/play"><button type="button" className="btn btn-lg btn-success menuStyle">Play</button></Link>
                    </li>
                    <li className="listPadding">
                        <Link to="/profile"><button type="button" className="btn btn-lg btn-success menuStyle">Profile</button></Link>
                    </li>
                    <li className="listPadding">
                        <Link to="/leaderboard"><button type="button" className="btn btn-lg btn-success menuStyle">Leaderboard</button></Link>
                    </li>
                    <li className="listPadding">
                        <Link to="/credits"><button type="button" className="btn btn-lg btn-success menuStyle">Credits</button></Link>
                    </li>
                    <li className="listPadding">
                        <button type="button" onClick={ () => { var ww = window.open(window.location, '_self'); ww.close(); }} className="btn btn-lg btn-success menuStyle">Quit</button>
                    </li>
                </ul>
            </div>
        </div>
    );
}