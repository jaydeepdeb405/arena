import React from "react";
import RestMessage from '../RestMessage';
import PlayLevelAnimation from "./PlayLevelAnimation";
import ArenaResults from "./ArenaResults";
import './ArenaQuiz.scss';
import loading from '../images/arena-loading.gif';

export default class ArenaLevels extends React.Component {
    constructor(props) {
        super(props);
        this.interval = null,
        this.state = {
            questionsLoading: true,
            playingAnimation: true,
            seconds: -1,
            quizData: {},
            questions: [],
            currentQuestionIndex: 0,
            answers: [],
            questionTransition: false,
            showResults: false,
            results: {},
            fetchingResults: false
        }
    }

    componentDidMount() {
        this.getQuestions(this.props.level, this.props.difficulty);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.seconds === 0) {
            this.state.currentQuestionIndex < this.state.questions.length - 1 ?
                this.nextQuestion() : this.validateResponses();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
        clearInterval(this.interval);
        this.props.endQuizSession();
    }

    setTimer = () => {
        this.setState({ seconds: this.state.quizData.timer });
        clearTimeout(this.timeout);
        clearInterval(this.interval);
        this.timeout = setTimeout(() => {
            this.interval = setInterval(() => {
                this.setState({
                    seconds: this.state.seconds - 1,
                });
            }, 1000);
        }, parseInt(this.state.quizData.timer));
    }

    getQuestions = async (level, difficulty) => {
        try {
            var rm = new RestMessage('/api/x_93700_arena/arena/getQuestions', 'GET');
            rm.setQueryParameter('level', level.value);
            rm.setQueryParameter('difficulty', difficulty.value);
            const response = await rm.execute();
            const responseBody = response.getBody();
            this.setState({
                quizData: responseBody,
                questions: responseBody.questions,
                seconds: responseBody.timer,
                questionsLoading: false
            }, () => {
                this.initializeQuestionResponse()
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    saveAnswer = (question, choiceId) => {
        if (question.type == 'radioButton') {
            this.answer.response = [choiceId];
        } else if (question.type == 'checkBox') {
            var index = this.answer.response.indexOf(choiceId);
            if (index === -1) this.answer.response.push(choiceId);
            else this.answer.response.splice(index, 1);
        }
    }

    initializeQuestionResponse = () => {
        this.answer = {
            questionID: this.state.questions[this.state.currentQuestionIndex].id,
            type: this.state.questions[this.state.currentQuestionIndex].type,
            module: this.state.questions[this.state.currentQuestionIndex].module,
            timeTaken: 0,
            response: []
        };
    }

    saveQuestionResponse = () => {
        this.answer.timeTaken = this.state.quizData.timer - this.state.seconds;
        let answers = this.state.answers;
        answers.push(this.answer);
        this.setState({ answers });
    }

    endAnimation = () => {
        //start timer only if questions are loaded
        if (this.state.questionsLoading === false) {
            this.setState({ playingAnimation: false }, () => this.setTimer());
        }
    }

    nextQuestion = () => {
        // save current ques response
        this.saveQuestionResponse();

        // 500ms transition time between each question
        this.setState({ questionTransition: true });
        setTimeout(() => { this.setState({ questionTransition: false }); }, 500);

        // clear all inputs
        document.querySelectorAll('.quiz input[name=ques-radio]').forEach((input) => { input.checked = false });
        document.querySelectorAll('.quiz input[name=ques-checkbox]').forEach((input) => { input.checked = false });

        // goto next question & build response object
        this.setState({ currentQuestionIndex: this.state.currentQuestionIndex + 1 }, () => this.initializeQuestionResponse());

        // reset timer
        this.setTimer();
    }

    validateResponses = async () => {
        // save response for last question
        this.setState({ fetchingResults: true });
        this.saveQuestionResponse();
        try {
            var rm = new RestMessage('/api/x_93700_arena/arena/validateQuizResponses', 'POST');
            rm.setRequestBody({
                level: this.props.level.value,
                difficulty: this.props.difficulty.value,
                answers: this.state.answers
            });
            const response = await rm.execute();

            this.setState({ results: response.getBody() }, () => this.setState({ fetchingResults: false, showResults: true }));
        }
        catch (error) {
            console.error(error);
        }
    }

    replay = () => {
        this.setState({
            questionsLoading: true,
            playingAnimation: true,
            seconds: -1,
            quizData: {},
            questions: [],
            currentQuestionIndex: 0,
            answers: [],
            questionTransition: false,
            showResults: false,
            results: {}
        }, () => this.getQuestions(this.props.level, this.props.difficulty) );
    }

    render() {
        return (
            <>
                {this.state.playingAnimation === true ?
                    <PlayLevelAnimation endAnimation={this.endAnimation} /> :
                    this.state.showResults === true ? <ArenaResults playLevel={this.props.playLevel} replay={this.replay} results={this.state.results} /> :
                        this.state.fetchingResults === true ? <div className="loading"><img height='150' src={loading} /></div> :
                        <div className="quiz">
                            <div className="seconds-bar" style={{ animation: this.state.questionTransition === true ? 'none' : 'color 60s linear 0s forwards' }} ></div>
                            <div className="timer">
                                <div style={{ fontSize: '0.6em' }}>TIME LEFT</div>
                                <div style={{ textAlign: 'center' }}>{this.state.seconds + 's'}</div>
                            </div>
                            <div className="quiz-header">
                                <div>{this.props.level.label}</div>
                                <div>{this.props.difficulty.label}</div>
                            </div>
                            <div className="quiz-divider"></div>
                            <div className="quiz-question">
                                <div className="quiz-question-title" dangerouslySetInnerHTML={{ __html: this.state.currentQuestionIndex + 1 + '. ' + this.state.questions[this.state.currentQuestionIndex].title }}></div>
                                <div className="quiz-question-choices">
                                    <ul>
                                        {this.state.quizData.questions[this.state.currentQuestionIndex].choices.map((choice, choiceIndex) => {
                                            let choiceContent;
                                            if (this.state.questions[this.state.currentQuestionIndex].type === 'radioButton') {
                                                choiceContent = <label>
                                                    <input type="radio" name="ques-radio" value={choice.id} onClick={() => this.saveAnswer(this.state.questions[this.state.currentQuestionIndex], choice.id)} />
                                                    <span className="radio-label">{choice.value}</span>
                                                    <span className="radio-styled"></span>
                                                </label>
                                            }
                                            else if (this.state.questions[this.state.currentQuestionIndex].type === 'checkBox') {
                                                choiceContent = <label>
                                                    <input type="checkbox" name="ques-checkbox" value={choice.id} onClick={() => this.saveAnswer(this.state.questions[this.state.currentQuestionIndex], choice.id)} />
                                                    <span className="checkbox-label">{choice.value}</span>
                                                    <span className="checkbox-styled">
                                                        <svg className="bi bi-check" width="1em" height="1em" viewBox="0 0 16 16" fillRule="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" />
                                                        </svg>
                                                    </span>
                                                </label>
                                            }
                                            else if (this.state.questions[this.state.currentQuestionIndex].type === 'match') {

                                            }
                                            return <div key={choiceIndex} className="choices-wrapper">{choiceContent}</div>;
                                        })}
                                    </ul>
                                </div>
                            </div>
                            <div className="quiz-buttons">
                                {this.state.currentQuestionIndex < this.state.questions.length - 1 ?
                                    <button className="btn btn-block" onClick={() => { this.nextQuestion() }}>Next</button> :
                                    <button className="btn btn-block" onClick={() => { this.validateResponses() }}>Submit</button>
                                }
                            </div>
                        </div>
                }
            </>
        );
    }

}