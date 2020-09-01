import React, { Component } from 'react';
import deepEqual from 'deep-equal';
import './ArenaProfile.scss';
import rainbowLoading from '../images/leaderboard-loading.svg';

export default class ArenaProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sfx: false,
            loading: false,
            currentTabIndex: 0,
            tabs: [{ label: 'Settings', data: [{ label: 'Nickname', value: '' }, { label: 'Music', value: false }, { label: 'SFX', value: false }, { label: 'Volume', value: 50 }], color: '#4CAF50' }, { label: 'Challenges', data: [], color: '#5aafee' }, { label: 'Excellence', data: [], color: '#FF5722' }]
        }
    }

    componentDidMount() {
        let tabs = this.state.tabs;
        tabs[0].data[0].value = this.props.playerDetails.nickname;
        tabs[0].data[1].value = this.props.playerDetails.music;
        tabs[0].data[2].value = this.props.playerDetails.sfx;
        tabs[0].data[3].value = this.props.audioVolume;
        tabs[1].data = this.props.playerDetails.challenges;
        tabs[2].data = this.props.playerDetails.stats;
        this.setState({ tabs });
    }

    componentDidUpdate(prevProps) {
        //update exellence data in state
        if (!deepEqual(prevProps.playerDetails, this.props.playerDetails)) {
            let tabs = this.state.tabs;
            tabs[1].data = this.props.playerDetails.challenges;
            tabs[2].data = this.props.playerDetails.stats;
            this.setState({ tabs });
        }
    }

    componentWillUnmount() {
        this.props.updatePlayerDetails(this.state.tabs[0].data[0].value, this.props.playerDetails.id);
    }

    switchTab = (tabIndex) => {
        this.setState({ currentTabIndex: tabIndex, loading: true });
        this.timeout = setTimeout(() => this.setState({ loading: false }), 400);
    }

    updateNickname = (e) => {
        let tabs = this.state.tabs;
        tabs[0].data[0].value = e.target.value;
        this.setState({ tabs });
    }

    toggleMusic = () => {
        this.props.toggleMusic();
        let tabs = this.state.tabs;
        tabs[0].data[1].value = !tabs[0].data[1].value;
        this.setState({ tabs });
    }

    toggleSfx = () => {
        this.props.toggleSfx();
        let tabs = this.state.tabs;
        tabs[0].data[2].value = !tabs[0].data[2].value;
        this.setState({ tabs });
    }

    changeSfx = (e) => {
        this.props.changeSfx(e.target.value);
    }

    render() {
        return (
            <div className="profile">
                <ul className="profile-tabs">
                    {this.state.tabs.map((tab, tabIndex) => {
                        return <li key={tabIndex} style={{ backgroundColor: tab.color }} onClick={() => this.switchTab(tabIndex)}>{tab.label}</li>
                    })}
                </ul>
                <div className="profile-content" style={{ backgroundColor: this.state.tabs[this.state.currentTabIndex].color }}>
                    {this.state.loading === true ? <div className="loading-profile-content"><img height="100" src={rainbowLoading} /></div> :
                        <ul>
                            {this.state.tabs[this.state.currentTabIndex].data.map((element, elementIndex) => {
                                switch (this.state.currentTabIndex) {
                                    case 0: {
                                        switch (element.label) {
                                            case 'Nickname': {
                                                return <li key={elementIndex}>
                                                    <div className="">
                                                        <label htmlFor="nickname">{element.label}</label>
                                                        <input id="nickname" type="text" onChange={this.updateNickname} value={element.value} />
                                                    </div>
                                                </li>
                                            }
                                            case 'Music': {
                                                return <li key={elementIndex}>
                                                    <div className="custom-control custom-switch">
                                                        <input type="checkbox" onChange={this.toggleMusic} className="custom-control-input" id="customSwitch1" checked={element.value} />
                                                        <label className="custom-control-label" htmlFor="customSwitch1">{element.label}</label>
                                                    </div>
                                                </li>
                                            }
                                            case 'SFX': {
                                                return <li key={elementIndex} className="sfx">
                                                    <div className="custom-control custom-switch">
                                                        <input type="checkbox" onChange={this.toggleSfx} className="custom-control-input" id="customSwitch2" checked={element.value ? true : false} />
                                                        <label className="custom-control-label" htmlFor="customSwitch2">{element.label}</label>
                                                    </div>
                                                    <select className="custom-select custom-select-sm" onChange={this.changeSfx} defaultValue={this.props.playerDetails.sfxSound}>
                                                        {this.props.playerDetails.sfxChoices.map((choice, index) => {
                                                            return <option key={index} value={choice}>{choice.split('.')[0]}</option>
                                                        })}
                                                    </select>
                                                </li>
                                            }
                                            case 'Volume': {
                                                return <li key={elementIndex}>
                                                    <div className="form-group">
                                                        <label htmlFor="volume">{element.label}</label>
                                                        <input type="range" onChange={this.props.changeVolume} className="form-control-range" id="formControlRange" defaultValue={element.value} />
                                                    </div>
                                                </li>
                                            }
                                        }
                                    }
                                    case 1: {
                                        return <li key={elementIndex} className="challenged-by-card">
                                            <div className="challenged-by-avatar" style={{ backgroundImage: `url(https://dev71980.service-now.com/${element.challenged_by.avatar_src})`, backgroundColor: element.challenged_by.avatar_src == '' ? 'grey' : 'none' }}>
                                                <div style={{ display: element.challenged_by.avatar_src == '' ? 'block' : 'none' }} >{element.challenged_by.initials}</div>
                                            </div>
                                            <div className="challenged-by-name">{element.challenged_by.label}</div>
                                            <button className="btn btn-sm accept-btn" onClick={()=>this.props.playLevel(element.challenged_by.level, element.challenged_by.difficulty)}>Accept</button>
                                        </li>;
                                    }
                                    case 2: {
                                        return <li key={elementIndex}>
                                            <div className="excellence-label">{element.label}</div>
                                            <div className="excellence-bar">
                                                <div className="user-excellence" style={{ width: element.value + "%" }}></div>
                                            </div>
                                        </li>
                                    }
                                    default: {
                                        return null;
                                    }
                                }
                            })}
                        </ul>
                    }
                </div>
            </div>
        )
    }
}
