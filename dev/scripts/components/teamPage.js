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
            loggedIn: false,
            teamRoster: []
        }
        this.goBack = this.goBack.bind(this);
        this.getCurrentUserEmail = this.getCurrentUserEmail.bind(this);
        this.displayUserName = this.displayUserName.bind(this);
        this.signOut = this.signOut.bind(this);
        this.getFullRoster = this.getFullRoster.bind(this);
        this.populateAttendanceList = this.populateAttendanceList.bind(this);
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
        })
        // this.displayUserName();
        this.getFullRoster();
    }
    getCurrentUserEmail(currentemail) {
        this.displayUserName();
        this.setState({
            currentUserEmail: email
        })
    }
    // Pull a full list of all members on the current team
    getFullRoster() {
        //console.log(this.props.match.params.key)
        const dbRefUsers = firebase.database().ref(`${this.props.match.params.key}/users`);
        //const dbRefUsers = firebase.database().ref(`${this.props.match.params.key}/users`);
        //console.log(dbRefUsers)
        dbRefUsers.on('value', (players) => {
            const teamArray = []
            for (let player in players.val()) {
                // console.log(players.val()[player].email, players.val()[player].name)
                const playerObj = {
                    name: players.val()[player].name,
                    email: players.val()[player].email
                }
                teamArray.push(playerObj)
            }
            this.setState({
                teamRoster: teamArray
            })
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

    populateAttendanceList(game, listName) {
        const namesArray = [];

        const attendanceArray = [];
        //console.log(game.attendance.pending)
        for (let player in game.attendance[listName]) {
            attendanceArray.push(game.attendance[listName][player])
        }

        this.state.teamRoster.forEach((player) => {
            attendanceArray.forEach((playerEmail) => {
                if (playerEmail === player.email) {
                    namesArray.push(player.name)
                }
            })
        })

        return namesArray;
    }

    render(){
        let logInOrOut = '';
        let response = '';
        let addGame = '';
        let manageTeam = '';
        let welcomeMessage = '';
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
         if (this.state.currentUserName === ''){
            addGame = (
                <p>NO YOU CANT ADD GAMES</p>
            )
            manageTeam = (
                <p>NO YOU CANT MANAGE THE TEAM</p>
            )
            welcomeMessage = (
                <p></p>
            )
        } else {
            addGame = (
                <GameModal teamKey={this.props.match.params.key} />
            )
             manageTeam = (
                 <Link to={`/${this.props.match.params.team}/${this.props.match.params.key}/manageTeam`}>
                     <p>Manage Team</p>
                 </Link>
            )
             welcomeMessage = (
                 <p>Welcome {this.state.currentUserName}</p>
                
            )
        }
        
        return (
            <div>
                {logInOrOut}
                {addGame}
                <div>
                    <button onClick={this.goBack}>Back</button>
                </div>
                <h2>{this.props.match.params.team}</h2>
                {welcomeMessage}
                {manageTeam}
                <section>
                    <h3>Upcoming Games</h3>
                    <div className="fullSchedule">
                        {this.state.games.map((game, i) => {
                            const pendingNamesArray = this.populateAttendanceList(game, 'pending');
                            const yesNamesArray = this.populateAttendanceList(game, 'yes');
                            const noNamesArray = this.populateAttendanceList(game, 'no');
                            return (
                                <div key={game.key}>
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
                                            </div>
                                            <div className="yes">
                                                <h4>Yes:</h4>
                                                <ul>
                                                    {yesNamesArray.map((player) => {
                                                        return <li key={player}>{player}</li>
                                                    })}
                                                </ul>
                                            </div>
                                            <div className="no">
                                                <h4>No:</h4>
                                                <ul>
                                                    {noNamesArray.map((player) => {
                                                        return <li key={player}>{player}</li>
                                                    })}
                                                </ul>
                                            </div>
                                            <div className="Pending">
                                                <h4>pending:</h4>
                                                <ul>
                                                    {pendingNamesArray.map((player) => {
                                                        return <li key={player}>{player}</li>
                                                    })}
                                                </ul>
                                            </div>
                                            <button>We Need Subs</button>
                                        </div>
                                    </Collapsible>
                                    {response}
                                </div>
                            )
                        })}
                    </div>
                </section>
            </div>   
        )
    }
}

export default TeamPage