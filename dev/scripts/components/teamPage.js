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
        this.addToYes = this.addToYes.bind(this);
        this.addToNo = this.addToNo.bind(this);
        this.moveFbRecord = this.moveFbRecord.bind(this);
    }
    
    goBack() {
		window.history.back();
	}
    
    //getting data from firebase to populate upcoming games
    componentDidMount() {
        const teamId = this.props.match.params.key;
        const dbRef = firebase.database().ref(teamId);
        
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

        dbRef.on("value", (firebaseData) => {
            const teamData = firebaseData.val();
            const gamesArray = [];
            const gameData = teamData.games;
            for (let gameKey in gameData) {
                gameData[gameKey].key = gameKey;
                gamesArray.push(gameData[gameKey]);
            }
            this.setState({
                games: gamesArray
            })
        })
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
        const dbRefUsers = firebase.database().ref(`${this.props.match.params.key}/users`);
        dbRefUsers.on('value', (players) => {
            const teamArray = []
            for (let player in players.val()) {
                const playerObj = {
                    name: players.val()[player].name,
                    email: players.val()[player].email,
                    gender: players.val()[player].gender
                }
                teamArray.push(playerObj);
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
    }

    signOut(event) {
        event.preventDefault()
        firebase.auth().signOut();
    }

    addToYes(gameKey){
        //find out who is signed in via email, should be currentuseremail in state
        console.log(this.state.currentUserEmail);
        console.log(gameKey);

        //reference for pending list
        let pendingRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/pending`);
        let noRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/no`);

        let oldRef = '';
        let newRef = '';
        
        //PULLS FROM PENDING IN FIREBASE
        pendingRef.on("value", (firebaseData) => {
            //all the people in pending list on firebase
            let playerToMove = firebaseData.val();
            console.log(playerToMove)
            
            let movingArray = [];
            //puts each object for each player in an array
            for(let player in playerToMove){
                // console.log(player);
                // console.log(playerToMove);
                playerToMove[player].key = player;
                movingArray.push(playerToMove[player])
            }

            console.log(movingArray)
            //filters through the array of player objects, to create a new Array that JUST contains the object for the currently logged in player, IF the player was in the pending list
            let movingPlayer = movingArray.filter((value)=>{
                return value['email'] === this.state.currentUserEmail;
            });
            console.log(movingPlayer)
            //if the player was in the pending list
            if (movingPlayer.length == 1){
                console.log('Player was in pending')

                oldRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/pending/${movingPlayer[0]['key']}`)

                newRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/yes`);

                // //EMPTY ALL ARRAYS WHEN DONE
                movingArray = [];
                movingPlayer = [];
            } 
        })
        
        noRef.on("value", (firebaseData) => {
            //all the people in pending list on firebase
            let playerToMove = firebaseData.val();
            console.log(playerToMove)

            let movingArray = [];
            //puts each object for each player in an array
            for (let player in playerToMove) {
                // console.log(player);
                // console.log(playerToMove);
                playerToMove[player].key = player;
                movingArray.push(playerToMove[player])
            }

            console.log(movingArray)
            //filters through the array of player objects, to create a new Array that JUST contains the object for the currently logged in player, IF the player was in the pending list
            let movingPlayer = movingArray.filter((value) => {
                return value['email'] === this.state.currentUserEmail;
            });
            console.log(movingPlayer)
            //if the player was in the pending list
            if (movingPlayer.length == 1) {
                console.log('Player was in no')

                oldRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/no/${movingPlayer[0]['key']}`)

                newRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/yes`);
                
                // //EMPTY ALL ARRAYS WHEN DONE
                movingArray = [];
                movingPlayer = [];
            }
        })
        this.moveFbRecord(oldRef, newRef)
    }

    addToNo(gameKey){
        //find out who is signed in via email, should be currentuseremail in state
        console.log(this.state.currentUserEmail);
        console.log(gameKey);

        //reference for pending list
        let pendingRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/pending`);
        let yesRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/yes`);

        let newRef = '';
        let oldRef = '';

        //PULLS FROM PENDING IN FIREBASE
        pendingRef.on("value", (firebaseData) => {
            //all the people in pending list on firebase
            let playerToMove = firebaseData.val();
            console.log(playerToMove)

            let movingArray = [];
            //puts each object for each player in an array
            for (let player in playerToMove) {
                // console.log(player);
                // console.log(playerToMove);
                playerToMove[player].key = player;
                movingArray.push(playerToMove[player])
            }

            console.log(movingArray)
            //filters through the array of player objects, to create a new Array that JUST contains the object for the currently logged in player, IF the player was in the pending list
            let movingPlayer = movingArray.filter((value) => {
                return value['email'] === this.state.currentUserEmail;
            });
            console.log(movingPlayer)
            //if the player was in the pending list
            if (movingPlayer.length == 1) {
                console.log('Player was in pending')

                oldRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/pending/${movingPlayer[0]['key']}`)

                newRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/no`);

                // //EMPTY ALL ARRAYS WHEN DONE
                movingArray = [];
                movingPlayer = [];
            }
          
        })

        yesRef.on("value", (firebaseData) => {
            //all the people in pending list on firebase
            let playerToMove = firebaseData.val();
            console.log(playerToMove)

            let movingArray = [];
            //puts each object for each player in an array
            for (let player in playerToMove) {
                // console.log(player);
                // console.log(playerToMove);
                playerToMove[player].key = player;
                movingArray.push(playerToMove[player])
            }

            console.log(movingArray)
            //filters through the array of player objects, to create a new Array that JUST contains the object for the currently logged in player, IF the player was in the pending list
            let movingPlayer = movingArray.filter((value) => {
                return value['email'] === this.state.currentUserEmail;
            });
            console.log(movingPlayer)
            //if the player was in the pending list
            if (movingPlayer.length == 1) {
                console.log('Player was in yes')

                oldRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/yes/${movingPlayer[0]['key']}`)

                newRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/no`);

                movingArray = [];
                movingPlayer = [];
            }
        })
        this.moveFbRecord(oldRef, newRef)
    }

    moveFbRecord(oldRef, newRef) {
        let playerInfo = '';
        oldRef.on ('value', (playerData) => {
            playerInfo = playerData.val();
        })
        newRef.push(playerInfo);
        oldRef.remove();
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
        let addGame = '';
        let manageTeam = '';
        let welcomeMessage = '';
        let femaleCounter = 0;
        let maleCounter = 0;
        if (this.state.loggedIn == false){
            logInOrOut = (
                <LoginModal getCurrentUserEmail={ this.getCurrentUserEmail} teamKey={this.props.match.params.key}/>
            )
        } else {
            logInOrOut = (
                <button onClick={this.signOut}>Log Out</button>
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
                            for (let key in game.attendance.yes){
                                if (game.attendance.yes[key].gender === 'female'){
                                    femaleCounter = femaleCounter + 1;
                                }
                                if (game.attendance.yes[key].gender === 'male') {
                                    maleCounter = maleCounter + 1;
                                }
                            }
                            console.log(game.attendance.yes)
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
                                                <p>Going: {Object.keys(game.attendance.yes).length - 1}</p>
                                                <p>Gents: {maleCounter}</p>
                                                <p>Ladies: {femaleCounter}</p>
                                            </div>
                                            <div className="yes">
                                                <h4>Yes:</h4>
                                                <ul>
                                                    {Object.keys(game.attendance.yes).map(function (key, index) {
                                                        if (game.attendance.yes.length === 1) {
                                                            return <li>none</li>
                                                        } else {
                                                            if (key !== '0') {
                                                                return <li>{game.attendance.yes[key].name}</li>
                                                            } else {
                                                                return null
                                                            }
                                                        }
                                                    })}
                                                </ul>
                                            </div>
                                            <div className="no">
                                                <h4>No:</h4>
                                                <ul>
                                                    {Object.keys(game.attendance.no).map(function (key, index) {
                                                        if (game.attendance.no.length === 1) {
                                                            return <li>none</li>
                                                        } else {
                                                            if (key !== '0') {
                                                                return <li>{game.attendance.no[key].name}</li>
                                                            } else {
                                                                return null
                                                            }
                                                        }
                                                    })}
                                                </ul>
                                            </div>
                                            <div className="Pending">
                                                <h4>pending:</h4>
                                                <ul>
                                                    {Object.keys(game.attendance.pending).map(function (key, index) {
                                                        if (game.attendance.pending.length === 1) {
                                                            return <li>none</li>
                                                        } else {
                                                            if (key !== '0') {
                                                                return <li>{game.attendance.pending[key].name}</li>
                                                            } else {
                                                                return null
                                                            }
                                                        }
                                                    })}
                                                </ul>
                                            </div>
                                            <button>We Need Subs</button>
                                        </div>
                                    </Collapsible>
                                    {/* {response} */}
                                    {this.state.loggedIn
                                    ? (<div className="rsvp">
                                        <button onClick={() => this.addToYes(game.key)} >Yes</button>
                                        <button onClick={() => this.addToNo(game.key)}>No</button>
                                        <p>You said TBA</p>
                                        </div>)
                                            
                                    : (<div></div>)
                                            
                                    
                                    }
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