import React from "react";
import Logo from './Logo';
import LevelMenuItem from "./LevelMenuItem";
import './ArenaLevels.scss';

export default class ArenaLevels extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            levels: [
                { label: 'Level 1', value: 'level1', locked: false, difficulties: [{ label: 'Easy', value: 'easy', icon: 'arena-level-easy.svg', locked: false }, { label: 'Medium', value: 'medium', icon: 'arena-level-medium.svg', locked: true }, { label: 'Hard', value: 'hard', icon: 'arena-level-hard.svg', locked: true }] },
                { label: 'Level 2', value: 'level2', locked: true, difficulties: [{ label: 'Easy', value: 'easy', icon: 'arena-level-easy.svg', locked: true }, { label: 'Medium', value: 'medium', icon: 'arena-level-medium.svg', locked: true }, { label: 'Hard', value: 'hard', icon: 'arena-level-hard.svg', locked: true }] },
                { label: 'Level 3', value: 'level3', locked: true, difficulties: [{ label: 'Easy', value: 'easy', icon: 'arena-level-easy.svg', locked: true }, { label: 'Medium', value: 'medium', icon: 'arena-level-medium.svg', locked: true }, { label: 'Hard', value: 'hard', icon: 'arena-level-hard.svg', locked: true }] },
                { label: 'Level 4', value: 'level4', locked: true, difficulties: [{ label: 'Easy', value: 'easy', icon: 'arena-level-easy.svg', locked: true }, { label: 'Medium', value: 'medium', icon: 'arena-level-medium.svg', locked: true }, { label: 'Hard', value: 'hard', icon: 'arena-level-hard.svg', locked: true }] }
            ],
            second: -1,
            playingText: ''
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.playerLevelIndex !== prevProps.playerLevelIndex || this.props.playerDifficultyIndex !== prevProps.playerDifficultyIndex) {
            this.setUserLevel();
        }
    }

    componentDidMount() {
        this.setUserLevel();
    }

    setUserLevel = () => {
        let lockFlag = false;
        const levels = this.state.levels.map((level, levelIndex) => {
            let levelData = level;
            levelData.locked = levelIndex <= this.props.playerLevelIndex ? false : true;
            levelData.difficulties.forEach((difficulty, difficultyIndex) => {
                difficulty.locked = lockFlag;
                if (levelIndex == this.props.playerLevelIndex && difficultyIndex == this.props.playerDifficultyIndex) {
                    lockFlag = true;
                }
            });
            return levelData;
        });
        this.setState({ levels });
    }

    flipItem = (event, levelIndex, locked) => {
        document.querySelectorAll('.menu-item').forEach((item, index) => {
            if (index == levelIndex && locked == false) item.classList.add('is-flipped');
            else item.classList.remove('is-flipped');
        });
    }

    playLevel = (locked, level, difficulty) => {
        if (locked === false) {
            this.props.playLevel(level, difficulty);
        }
    }

    render() {
        return (
            <div className="arena-home">
                <Logo/>
                <div className="rows">
                    {this.state.levels.map((level, index) => {
                        return <LevelMenuItem key={index} flipItem={this.flipItem} index={index} level={level} difficulties={level.difficulties} playLevel={this.playLevel} />
                    })}
                </div>
            </div>
        )
    };
}