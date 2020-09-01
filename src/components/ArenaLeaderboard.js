import React from "react";
import RestMessage from '../RestMessage';
import './ArenaLeaderboard.scss';
import rainbowLoading from '../images/leaderboard-loading.svg';
import fighter from '../images/fighter.gif';

export default class ArenaLeaderboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leaderboardData: [{ "label": "Level 1", "value": "level1", "difficulties": [{ "label": "Easy", "value": "easy", "data": [] }, { "label": "Medium", "value": "medium", "data": [] }, { "label": "Hard", "value": "hard", "data": [] }] }, { "label": "Level 2", "value": "level2", "difficulties": [{ "label": "Easy", "value": "easy", "data": [] }, { "label": "Medium", "value": "medium", "data": [] }, { "label": "Hard", "value": "hard", "data": [] }] }, { "label": "Level 3", "value": "level3", "difficulties": [{ "label": "Easy", "value": "easy", "data": [] }, { "label": "Medium", "value": "medium", "data": [] }, { "label": "Hard", "value": "hard", "data": [] }] }, { "label": "Level 4", "value": "level4", "difficulties": [{ "label": "Easy", "value": "easy", "data": [] }, { "label": "Medium", "value": "medium", "data": [] }, { "label": "Hard", "value": "hard", "data": [] }] }],
            leaderboardColors: ["#4CAF50", "#5aafee", "#CDDC39", "#FF5722"],
            leaderboardLoading: true,
            fight: false,
            selectedLevel: { difficulties: [] },
            selectedDifficulty: {},
            scores: []
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.playerLevelIndex !== prevProps.playerLevelIndex || this.props.playerDifficultyIndex !== prevProps.playerDifficultyIndex) {
            this.setLeaderboardData();
        }
    }

    componentDidMount() {
        this.setLeaderboardData();
        this.getLeaderboardData();
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    setLeaderboardData = () => {
        this.setState({
            currentLevelIndex: this.props.playerLevelIndex,
            selectedLevel: this.state.leaderboardData[this.props.playerLevelIndex],
            selectedDifficulty: this.state.leaderboardData[this.props.playerLevelIndex].difficulties[this.props.playerDifficultyIndex],
            scores: this.state.leaderboardData[this.props.playerLevelIndex].difficulties[this.props.playerDifficultyIndex].data
        });
    }

    getLeaderboardData = async () => {
        this.setState({ leaderboardLoading: true });
        try {
            var rm = new RestMessage('/api/x_93700_arena/arena/getLeaderboardData', 'GET');
            const response = await rm.execute();
            const responseBody = response.getBody();
            this.setState({ leaderboardData: responseBody },
                () => { this.setLeaderboardData(); this.setState({ leaderboardLoading: false }) });
        }
        catch (error) {
            console.error(error);
        }
    }

    changeLevel = (levelIndex) => {
        this.setState({
            leaderboardLoading: true,
            currentLevelIndex: levelIndex,
            selectedLevel: this.state.leaderboardData[levelIndex],
            selectedDifficulty: this.state.leaderboardData[levelIndex].difficulties[0],
            scores: this.state.leaderboardData[levelIndex].difficulties[0].data
        });
        this.timeout = setTimeout(() => {
            this.setState({ leaderboardLoading: false });
        }, 100);
    }

    changeDifficulty = (difficultyIndex) => {
        this.setState({
            leaderboardLoading: true,
            currentDifficultyIndex: difficultyIndex,
            selectedDifficulty: this.state.leaderboardData[this.state.currentLevelIndex].difficulties[difficultyIndex],
            scores: this.state.leaderboardData[this.state.currentLevelIndex].difficulties[difficultyIndex].data
        });
        this.timeout = setTimeout(() => {
            this.setState({ leaderboardLoading: false });
        }, 100);
    }

    challenge = async (level, difficulty, challenged_player, scoreIndex) => {
        this.setState({ fight: true });
        try {
            var rm = new RestMessage('/api/x_93700_arena/arena/challengePlayer', 'GET');
            rm.setQueryParameter('level', level);
            rm.setQueryParameter('difficulty', difficulty);
            rm.setQueryParameter('challenged_player', challenged_player);
            const response = await rm.execute();
            const httpStatus = response.getStatusCode();
            const responseBody = response.getBody();
            if (httpStatus === 200) {
                alert(responseBody.message);
                this.setState({
                    scores: this.state.scores.map((score, index) => {
                        if (scoreIndex === index) score.challengeEnabled = false;
                        return score;
                    })
                });
            }
        }
        catch (error) {
            console.error(error);
        }
        this.timeout = setTimeout(() => {
            this.setState({ fight: false });
            clearTimeout((this.timeout));
        }, 3850);
    }

    render() {
        return (
            <div>
                <img className="fight-animation" style={{ display: this.state.fight == true ? 'block' : 'none' }} src={fighter} />

                <div className="leaderboard-heading">Arena Leaderboard</div>

                <div className="leaderboard" style={{ filter: this.state.fight == false ? 'none' : 'blur(3px)' }}>
                    <ul className="level-tabs">
                        {this.state.leaderboardData.map((level, levelIndex) => {
                            return <li key={levelIndex} style={{ backgroundColor: this.state.leaderboardColors[levelIndex] }}
                                onClick={() => this.changeLevel(levelIndex)}><span>{level.label}</span></li>
                        })}
                    </ul>
                    <div className="leaderboard-content" style={{ backgroundColor: this.state.leaderboardColors[this.state.currentLevelIndex] }}>
                        <ul className="difficulty-tabs">
                            {this.state.selectedLevel.difficulties.map((difficulty, difficultyIndex) => {
                                return <li key={difficultyIndex} onClick={() => this.changeDifficulty(difficultyIndex)}>
                                    <span>{difficulty.label}
                                        <div className={difficulty.value == this.state.selectedDifficulty.value ? 'difficulty-tab active-tab' : 'difficulty-tab'}></div>
                                    </span>
                                </li>
                            })}
                            <div className="refresh-button" onClick={() => this.getLeaderboardData()}>
                                <svg className="bi bi-arrow-repeat" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M2.854 7.146a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L2.5 8.207l1.646 1.647a.5.5 0 0 0 .708-.708l-2-2zm13-1a.5.5 0 0 0-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0 0-.708z" />
                                    <path fillRule="evenodd" d="M8 3a4.995 4.995 0 0 0-4.192 2.273.5.5 0 0 1-.837-.546A6 6 0 0 1 14 8a.5.5 0 0 1-1.001 0 5 5 0 0 0-5-5zM2.5 7.5A.5.5 0 0 1 3 8a5 5 0 0 0 9.192 2.727.5.5 0 1 1 .837.546A6 6 0 0 1 2 8a.5.5 0 0 1 .501-.5z" />
                                </svg>
                            </div>
                        </ul>
                        <div className="leaderboard-loading" style={{ display: this.state.leaderboardLoading == true ? 'block' : 'none' }}><img src={rainbowLoading} /></div>

                        <div style={{ overflow: 'overlay', display: this.state.scores.length > 0 && this.state.leaderboardLoading == false ? 'block' : 'none', height: '57vh' }}>
                            {this.state.scores.map((score, scoreIndex) => {
                                return <div className="leaderboard-item" key={scoreIndex}>
                                    <div className="user-avatar" style={{ backgroundImage: `url(https://dev71980.service-now.com/${score.avatar_src})`, backgroundColor: score.avatar_src == '' ? 'grey' : 'none' }}>
                                        <div style={{ display: score.avatar_src == '' ? 'block' : 'none' }} >{score.initials}</div>
                                    </div>
                                    <div className="points-bar">
                                        <div className="user-points-bar" style={{ width: score.score + '%' }}></div>
                                        <div className="user-name">{scoreIndex + 1}. {score.user_name}</div>
                                    </div>
                                    <div className="score">
                                        <div className="user-points text-center">{score.score}pts in {score.time_taken}s</div>
                                        <button style={{ display: score.challengeEnabled == true ? 'block' : 'none' }} className="btn btn-sm challenge-btn"
                                            onClick={() => this.challenge(this.state.selectedLevel.value, this.state.selectedDifficulty.value, score.user_id, scoreIndex)}>Challenge</button>
                                    </div>
                                </div>
                            })}
                        </div>

                        {this.state.scores.map((score, scoreIndex) => {
                            if (score.isCurrentUser == true)
                                return <div className="leaderboard-item current-user-board" key={scoreIndex} style={{ display: (this.state.leaderboardLoading == false) ? 'flex' : 'none' }}>
                                    <div className="user-avatar" style={{ backgroundImage: `url(https://dev71980.service-now.com/${score.avatar_src})`, backgroundColor: score.avatar_src == '' ? 'grey' : 'none' }}>
                                        <div style={{ display: score.avatar_src == '' ? 'block' : 'none' }}>{score.initials}</div>
                                    </div>
                                    <div className="points-bar">
                                        <div className="user-points-bar" style={{ width: score.score + '%' }}></div>
                                        <div className="user-name">{scoreIndex + 1}. {score.user_name}</div>
                                    </div>
                                    <div className="score">
                                        <div className="user-points text-center">{score.score}pts in {score.time_taken}s</div>
                                    </div>
                                </div>
                        })}

                        <div className="leaderboard-item" style={{ display: (this.state.leaderboardLoading == false && this.state.scores.length === 0) ? 'flex' : 'none', margin: 'auto' }}>
                            <div className="text-center no-records">
                                Nothing here
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}