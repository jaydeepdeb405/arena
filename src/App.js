import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import loading from './images/arena-loading.gif';

import icon from './images/arena-favicon.png';
import Favicon from 'react-favicon';
import RestMessage from './RestMessage';
import MetaTags from 'react-meta-tags';

import HomeButton from './components/HomeButton';
import ArenaHome from './components/ArenaHome';
import ArenaLevels from "./components/ArenaLevels";
import ArenaQuiz from "./components/ArenaQuiz";
import ArenaLeaderboard from "./components/ArenaLeaderboard";
import ArenaCredits from "./components/ArenaCredits";
import ArenaProfile from "./components/ArenaProfile";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerDetails: {},
            playerLevelIndex: 0,
            playerDifficultyIndex: 0,
            quizData: {},
            startQuiz: false,
            loading: true
        };
        this.audioVolume = 0.5;
        this.music = new Audio('gameBGM3.mp3');
        this.music.loop = true;
        this.music.volume = this.audioVolume;
    }

    componentDidMount() {
        this.getPlayerDetails();

        // play sfx for every click
        var allElements = document.getElementsByTagName('*');
        for ( var i = 0; i<allElements.length; i++ ) {
            allElements[i].addEventListener('click', ()=>this.playSfx());
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.playerDetails.music !== undefined) {
            if(this.state.playerDetails.music === true) {
                this.music.play();
            }
            if(this.state.playerDetails.music === false) {
                this.music.pause();
            }
        }
    }

    endQuizSession = ()=> {
        this.setState({
            startQuiz: false
        });
    }

    getPlayerDetails = async () => {
        try {
            var rm = new RestMessage('/api/x_93700_arena/arena/getPlayerDetails', 'GET');
            const response = await rm.execute();
            const responseBody = response.getBody();
            this.setState({ playerDetails: responseBody, playerLevelIndex: responseBody.levelIndex, playerDifficultyIndex: responseBody.difficultyIndex, loading: false, sfx: responseBody.sfxChoices[0] });
        }
        catch (error) {
            console.error(error);
        }
    }

    playLevel = (currentPlayingLevel, currentPlayingDifficulty) => {
        this.playSfx();
        if(this.state.startQuiz === true) {
            this.setState({ startQuiz: false }, () => this.setState({ startQuiz: true, currentPlayingLevel, currentPlayingDifficulty }));
        }
        else {
            this.setState({ currentPlayingLevel, currentPlayingDifficulty, startQuiz: true });
        }
    }

    playSfx = () => {
        if(this.state.playerDetails.sfx === true) {
            let sfx = new Audio(this.state.playerDetails.sfxSound);
            sfx.volume = this.audioVolume;
            sfx.play().then(() => sfx = null);
        }
    }

    toggleMusic = () => {
        let playerDetails = this.state.playerDetails;
        playerDetails.music = !playerDetails.music;
        this.setState({ playerDetails });
    }

    toggleSfx = () => {
        let playerDetails = this.state.playerDetails;
        playerDetails.sfx = !playerDetails.sfx;
        this.setState({ playerDetails });
    }

    changeSfx = (sfxSound) => {
        let playerDetails = this.state.playerDetails;
        playerDetails.sfxSound = sfxSound;
        this.setState({playerDetails});
    }

    changeVolume = (event) => {
        this.audioVolume = event.target.value/100;
        this.music.volume = this.audioVolume;
    }

    updatePlayerDetails = async(nickname, sys_id) => {
        let playerDetails = this.state.playerDetails;
        playerDetails.nickname = nickname;
        this.setState({ playerDetails });
        try {
            var rm = new RestMessage(`/api/now/table/x_93700_arena_user/${sys_id}`, 'PATCH');
            rm.setRequestBody({ avatar: nickname, music: playerDetails.music, sfx: playerDetails.sfx, sfx_sounds: playerDetails.sfxSound });
            const response = await rm.execute();
        }
        catch (error) {
            console.error(error);
        }
    }

    render() {
        return (
            <>
                <Favicon url={icon} />
                <MetaTags>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </MetaTags>
                {this.state.loading === true ? <div className="loading"><img height='150' src={loading} /></div> : 
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <Router basename={process.env.APP_URL_BASE}>
                                <HomeButton quizStarted={this.state.startQuiz} endQuizSession={this.endQuizSession} />
                                <Switch>
                                    <Route exact path="/">
                                        <ArenaHome endQuizSession={this.endQuizSession} />
                                    </Route>
                                    <Route exact path="/profile">
                                        <ArenaProfile playerDetails={this.state.playerDetails} playLevel={this.playLevel} updatePlayerDetails={this.updatePlayerDetails} toggleMusic={this.toggleMusic} toggleSfx={this.toggleSfx} changeSfx={this.changeSfx} changeVolume={this.changeVolume} audioVolume={this.audioVolume*100} />
                                    </Route>
                                    <Route exact path="/play">
                                        { this.state.startQuiz === false ? 
                                        <ArenaLevels playerLevelIndex={this.state.playerLevelIndex} playerDifficultyIndex={this.state.playerDifficultyIndex} playLevel={this.playLevel}/> : 
                                        <ArenaQuiz level={this.state.currentPlayingLevel} difficulty={this.state.currentPlayingDifficulty} playLevel={this.playLevel} endQuizSession={this.endQuizSession} /> }
                                    </Route> 
                                    <Route exact path="/leaderboard">
                                        <ArenaLeaderboard playerId={this.state.playerDetails.id} playerLevelIndex={this.state.playerLevelIndex} playerDifficultyIndex={this.state.playerDifficultyIndex} />
                                    </Route> 
                                    <Route exact path="/credits">
                                        <ArenaCredits />
                                    </Route>
                                    <Route path="*">
                                        <ArenaHome action={this.action} />
                                    </Route>
                                </Switch>
                            </Router>
                        </div>
                    </div>
                </div>
                }   
            </>
        );
    }
}