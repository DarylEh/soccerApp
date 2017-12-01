import React from 'react';
import GameModal from "./addGameModal.js";
import PlayerModal from "./addPlayerModal.js";
import LoginModal from "./loginModal.js";
import firebase from 'firebase';
import {
    BrowserRouter as Router,
    Route, Link, Switch, BrowserHistory
} from 'react-router-dom';
import Collapsible from 'react-collapsible';
import ManageTeam from './manageTeam.js';

class TeamPage extends React.Component {
    constructor() {
        super();
        this.state = {
            games: [],
            currentUserEmail: "",
            currentUserName: "",
            loggedIn: false
        }
        this.goBack = this.goBack.bind(this);
        this.getCurrentUserEmail = this.getCurrentUserEmail.bind(this);
        this.displayUserName = this.displayUserName.bind(this);
        this.signOut = this.signOut.bind(this);
    }
    
    
    goBack() {
		window.history.back();
	}
    
    //getting data from firebase to populate upcoming games
    
    
    componentDidMount() {
        const teamId = this.props.match.params.key;
        const dbRef = firebase.database().ref(teamId);

        // START OF TEST
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    currentUserEmail: firebase.auth().currentUser.email,
                    loggedIn: true
                });
                this.displayUserName();

            } else {
                this.setState({
                    loggedIn: false,
                    currentUserEmail: '',
                    currentUserName: '',
                    
                })
            }
        });

    //END OF TEST
        
        dbRef.on("value", (firebaseData) => {
            const teamData = firebaseData.val();
            const gamesArray = [];
            const gameData = teamData.games;
            //console.log(teamData);
            for (let gameKey in gameData) {
                gameData[gameKey].key = gameKey;
                gamesArray.push(gameData[gameKey]);
                // console.log(teamsData[teamKey])
            }
            this.setState({
                games: gamesArray
                
            })
            // this.setState({
            //     currentUserEmail: firebase.auth().currentUser.email
            // })
            
            // console.log(currentUserEmail);
            
        })
        // this.displayUserName();
    }
    getCurrentUserEmail(currentemail) {
        this.displayUserName();
        this.setState({
            currentUserEmail: email
        })
    }


    

    displayUserName(){
        const teamId = this.props.match.params.key;
        const dbRef = firebase.database().ref(teamId);
        

        dbRef.on("value", (firebaseData) => {
            const teamData = firebaseData.val();
            const userData = teamData.users;
            let userName = "";

            
            for (let userKey in userData){
                
                if (this.state.currentUserEmail === userData[userKey].email){
                    userName = userData[userKey].name
                }
            }
            this.setState({
                currentUserName: userName
            })
        })
        // for (let userKey );
    }

    signOut(event) {
        event.preventDefault()
        firebase.auth().signOut();
    }

    render(){
        let logInOrOut = '';
        let response = '';
        if (this.state.loggedIn == false){
            logInOrOut = (
                <LoginModal getCurrentUserEmail={ this.getCurrentUserEmail} teamKey={this.props.match.params.key}/>

            )
        } else {
            logInOrOut = (
                <button onClick={this.signOut}>Log Out</button>
            )
            response = (
                <div className="rsvp">
                    <button>Yes</button>
                    <button>No</button>
                    <p>You said TBA</p>
                </div>
            )
        }
        return (
            <div>
                {logInOrOut}
                <GameModal teamKey={this.props.match.params.key}/>
                <div> <button onClick={this.goBack}>Back</button></div>
                    <h2>{this.props.match.params.team}</h2>
                    <p>Welcome {this.state.currentUserName}</p>
                <Link to={`/${this.props.match.params.team}/${this.props.match.params.key}/manageTeam`}>
                    <p>Manage Team</p>
                </Link>
                <section>
                    <h3>Upcoming Games</h3>
                    <div className="fullSchedule">
                    {this.state.games.map((game, i) => {
                        return (
                            <div>
                                    <Collapsible trigger={`${game.date} vs ${game.opponent}`}>
                                    <div className="container">
                                        <div>
                                            <h4>Location</h4>
                                            <p>{game.location}</p>
                                            <h4>Time</h4>
                                            <p>{game.time}</p>
                                        </div>
                                        <div className="attendence">
                                            <p>Going: TBA</p>
                                            <p>Gents: TBA</p>
                                            <p>Ladies: TBA</p>
                                            <p>Can't make it</p>
                                        </div>
                                        <div className="yes">
                                            <ul>
                                                <li>TBA</li>
                                            </ul>
                                        </div>
                                        <div className="no">
                                            <ul>
                                                <li>TBA</li>
                                            </ul>
                                        </div>
                                        <div className="Pending">
                                            <ul>
                                                <li>TBA</li>
                                            </ul>
                                        </div>
                                        <button>We Need Subs</button>
                                    </div>
                                </Collapsible>
                                {response}
                            </div>
                        )
                    }  
                    )}
                    </div>
                </section>
            </div>   
        )
    }
}

export default TeamPage