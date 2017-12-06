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

// TEAM PAGE
// Team information/Team landing page

class TeamPage extends React.Component {
    constructor() {
        super();
        this.state = {
            games: [],
            currentUserEmail: "",
            currentUserName: "",
            loggedIn: false,
            teamRoster: [],
            captainEmail: ""
        }

        this.goBack = this.goBack.bind(this);
        this.getCurrentUserEmail = this.getCurrentUserEmail.bind(this);
        this.displayUserName = this.displayUserName.bind(this);
        this.signOut = this.signOut.bind(this);
        this.getFullRoster = this.getFullRoster.bind(this);
        this.addToYes = this.addToYes.bind(this);
        this.addToNo = this.addToNo.bind(this);
        this.moveFbRecord = this.moveFbRecord.bind(this);
        this.playerResponse = this.playerResponse.bind(this);
        this.removeGame = this.removeGame.bind(this);
    }
    
    // Take the user back to list of teams
    goBack() {
		window.history.back();
    }

    // Get data from firebase to populate upcoming games
    componentDidMount() {
        const teamId = this.props.match.params.key;
        const dbRef = firebase.database().ref(teamId);
        // Firebase root -> specific team -> games list
        const gamesRef = firebase.database().ref(`${teamId}/games`)
        
        // Greet the user if logged in
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    currentUserEmail: firebase.auth().currentUser.email,
                    loggedIn: true,
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

        // Pull list of games from Firebase
        gamesRef.on("value", (firebaseData) => {
            const gameData = firebaseData.val();
            const gamesArray = [];
            for (let gameKey in gameData) {
                gameData[gameKey].key = gameKey;
                gameData[gameKey].order = gameData[gameKey].date.split('-').join('');
                gamesArray.push(gameData[gameKey]);
            }
            // Sort chronologically
            gamesArray.sort((a,b)=>{
                return a.order - b.order
            });
            this.setState({                
                games: gamesArray
            })
        })

        // pull list of all team members, save it to the state
        this.getFullRoster();

        // Find the captain's email - for special permissions
        dbRef.on("value", (firebaseData)=>{
            const teamData = firebaseData.val();
            this.setState({
                captainEmail: teamData.users.captain.email
            })
        })

    }

    // Pull user's email back from the login modal
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
                    gender: players.val()[player].gender,
                }
                teamArray.push(playerObj);
            }
            this.setState({
                teamRoster: teamArray
            })
        })
    }

    // Greet the current user with "Welcome -------"
    displayUserName(){
        const teamId = this.props.match.params.key;
        const dbRef = firebase.database().ref(teamId);
        
        // Get current user's name, save it to the state
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

    // Sign out user from Firebase auth
    signOut(event) {
        event.preventDefault()
        firebase.auth().signOut();
    }

    // User action: Click "yes" button on a game
    addToYes(gameKey){
        //reference for pending list
        let pendingRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/pending`);
        let noRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/no`);

        let oldRef = '';
        let newRef = '';
        
        //PULLS FROM PENDING IN FIREBASE
        pendingRef.on("value", (firebaseData) => {
            //all the people in pending list on firebase
            let playerToMove = firebaseData.val();
            
            let movingArray = [];
            //puts each object for each player in an array
            for(let player in playerToMove){
                playerToMove[player].key = player;
                movingArray.push(playerToMove[player])
            }

            //filters through the array of player objects, to create a new Array that JUST contains the object for the currently logged in player, IF the player was in the pending list
            let movingPlayer = movingArray.filter((value)=>{
                return value['email'] === this.state.currentUserEmail;
            });
            //if the player was in the pending list
            if (movingPlayer.length == 1){

                oldRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/pending/${movingPlayer[0]['key']}`)

                newRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/yes`);

                // EMPTY ALL ARRAYS WHEN DONE
                movingArray = [];
                movingPlayer = [];
            } 
        })
        
        // PULLS FROM NO LIST IN FIREBASE
        noRef.on("value", (firebaseData) => {
            //all the people in no list on firebase
            let playerToMove = firebaseData.val();

            let movingArray = [];
            //puts each object for each player in an array
            for (let player in playerToMove) {
                playerToMove[player].key = player;
                movingArray.push(playerToMove[player])
            }

            //filters through the array of player objects, to create a new Array that JUST contains the object for the currently logged in player, IF the player was in the no list
            let movingPlayer = movingArray.filter((value) => {
                return value['email'] === this.state.currentUserEmail;
            });
            //if the player was in the pending list
            if (movingPlayer.length == 1) {

                oldRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/no/${movingPlayer[0]['key']}`)

                newRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/yes`);
                
                // EMPTY ALL ARRAYS WHEN DONE
                movingArray = [];
                movingPlayer = [];
            }
        })
        this.moveFbRecord(oldRef, newRef)
    }

    addToNo(gameKey){
        //reference for pending list
        let pendingRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/pending`);
        //reference for yes list
        let yesRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/yes`);

        let newRef = '';
        let oldRef = '';

        //PULLS FROM PENDING IN FIREBASE
        pendingRef.on("value", (firebaseData) => {
            //all the people in pending list on firebase
            let playerToMove = firebaseData.val();

            let movingArray = [];
            //puts each object for each player in an array
            for (let player in playerToMove) {
                playerToMove[player].key = player;
                movingArray.push(playerToMove[player])
            }

            //filters through the array of player objects, to create a new Array that JUST contains the object for the currently logged in player, IF the player was in the pending list
            let movingPlayer = movingArray.filter((value) => {
                return value['email'] === this.state.currentUserEmail;
            });
            //if the player was in the pending list
            if (movingPlayer.length == 1) {

                oldRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/pending/${movingPlayer[0]['key']}`)

                newRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/no`);

                // //EMPTY ALL ARRAYS WHEN DONE
                movingArray = [];
                movingPlayer = [];
            }
          
        })

        //PULLS FROM YES IN FIREBASE
        yesRef.on("value", (firebaseData) => {
            //all the people in pending list on firebase
            let playerToMove = firebaseData.val();

            let movingArray = [];
            //puts each object for each player in an array
            for (let player in playerToMove) {
                playerToMove[player].key = player;
                movingArray.push(playerToMove[player])
            }

            //filters through the array of player objects, to create a new Array that JUST contains the object for the currently logged in player, IF the player was in the pending list
            let movingPlayer = movingArray.filter((value) => {
                return value['email'] === this.state.currentUserEmail;
            });
            //if the player was in the pending list
            if (movingPlayer.length == 1) {

                oldRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/yes/${movingPlayer[0]['key']}`)

                newRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}/attendance/no`);

                movingArray = [];
                movingPlayer = [];
            }
        })
        this.moveFbRecord(oldRef, newRef)
    }

    // Take user out of old spot in Firebase, place them in new spot
    moveFbRecord(oldRef, newRef) {
        let playerInfo = '';
        oldRef.on ('value', (playerData) => {
            playerInfo = playerData.val();
        })
        newRef.push(playerInfo);
        oldRef.remove();
    }

    // populate yes/no/pending list baed on Firebase data
    populateAttendanceList(game, listName) {
        const namesArray = [];

        // Get list of all players in yes/no/pending
        const attendanceArray = [];
        for (let player in game.attendance[listName]) {
            attendanceArray.push(game.attendance[listName][player])
        }

        // compare attendance array and the full team, pull names into an array to return
        this.state.teamRoster.forEach((player) => {
            attendanceArray.forEach((playerEmail) => {
                if (playerEmail === player.email) {
                    namesArray.push(player.name)
                }
            })
        })

        // Sends back an array of names for players in the requested response (y/n/pending)
        return namesArray;
    }

    // Return value to display based on user's attendance response for specified game
    playerResponse(game){
        for (let key in game.attendance.yes) {
            if (game.attendance.yes[key].email === this.state.currentUserEmail) {
                return ' yes'
            }
        };
        for (let key in game.attendance.no) {
            if (game.attendance.no[key].email === this.state.currentUserEmail) {
                return ' no'
            }
        }
        for (let key in game.attendance.pending) {
            if (game.attendance.pending[key].email === this.state.currentUserEmail) {
                return ' pending'
            }
        }
    }

    // Remove a game item (Only available to captains)
    removeGame(gameKey){
        const dbRef = firebase.database().ref(`${this.props.match.params.key}/games/${gameKey}`);
        dbRef.remove()
    }

    render(){
        let logInOrOut = '';
        let addGame = '';
        let manageTeam = '';
        let welcomeMessage = '';
        let response = 'Pending';
        let femaleCounter;
        let maleCounter;

        // Display login/log out button based on user's auth status
        if (this.state.loggedIn == false){
            logInOrOut = (
                <LoginModal getCurrentUserEmail={ this.getCurrentUserEmail} teamKey={this.props.match.params.key}/>
            )
        } else {
            logInOrOut = (
                <button onClick={this.signOut}>Log Out</button>
            )
        }

        // Allow only signed in users who are also part of the team to manage game/team info
        if (this.state.currentUserName === ''){
            addGame = (
                <p className='noGames' >Please log in to manage team</p>
            )
            welcomeMessage = (
                <p></p>
            )
        } else {
            addGame = (
                <GameModal teamKey={this.props.match.params.key} />
            )
            manageTeam = (
                <Link className='manageButton' to={`/${this.props.match.params.team}/${this.props.match.params.key}/manageTeam`}>
                    Manage Team
                </Link>
            )
            welcomeMessage = (
                <p className='welcomeHead'>Welcome {this.state.currentUserName}</p>
            )
        }
        
        return (
            <div className='wrapper'>
                <div className="teamHeader clearfix">
                    <h2 className='teamNameDisplay' >{this.props.match.params.team}</h2>
                    {manageTeam}
                </div>
                {welcomeMessage}
                <div className="teamPageButtons clearfix">
                    {logInOrOut}
                    <div>
                        <button onClick={this.goBack}>Back</button>
                    </div>
                    {addGame}
                </div>
                <section>
                    <h3 className='upcoming'>Upcoming Games</h3>
                    <div className="fullSchedule">
                        {this.state.games.map((game, i) => {
                            
                            femaleCounter = 0;
                            maleCounter = 0;
                            for (let key in game.attendance.yes) {
                                if (game.attendance.yes[key].gender === 'female'){
                                    femaleCounter = femaleCounter + 1
                                }
                                if(game.attendance.yes[key].gender === 'male'){
                                    maleCounter = maleCounter + 1
                                }
                            }
                            return (
                                <div key={game.key}>
                                    <Collapsible className='Collapsible__trigger' trigger={`${game.date} vs ${game.opponent}`}>
                                        <div className='innerWrapper clearfix innerGame'>
                                                <div className='gameLocation clearfix'>
                                                    <h4>Location</h4>
                                                    <p>{game.location}</p>
                                                </div>
                                                <div className='gameTime clearfix'>
                                                    <h4>Time</h4>
                                                    <p>{game.time}</p>
                                                </div>
                                                <div className="attendance">
                                                    <div className='attendanceLeft clearfix'>
                                                        <h4>Attendance</h4>   
                                                    </div>
                                                    <div className='attendanceRight clearfix'>
                                                        <div className='attendanceBreakdown'>
                                                            <p>Going: {Object.keys(game.attendance.yes).length - 1}</p>
                                                            <p>Gents: {maleCounter}</p>
                                                            <p>Ladies: {femaleCounter}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='attendanceAnswer clearfix'>
                                                    <div className="yes">
                                                        <h4>Yes:</h4>
                                                        <ul>
                                                        { // 
                                                            Object.keys(game.attendance.yes).map(function (key, index) {
                                                                if (game.attendance.yes.length === 1) {
                                                                    return <li><p>none</p></li>
                                                                } else {
                                                                    if (key !== '0') {
                                                                        return <li><p>{game.attendance.yes[key].name}</p></li>
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
                                                                    return <li><p>none</p></li>
                                                                } else {
                                                                    if (key !== '0') {
                                                                        return <li key={key}> <p>{game.attendance.no[key].name}</p> </li>

                                                                    } else {
                                                                        return null
                                                                    }
                                                                }
                                                            })}
                                                        </ul>
                                                    </div>
                                            <div className="Pending">
                                                <h4>Pending:</h4>
                                                <ul>
                                                    {Object.keys(game.attendance.pending).map(function (key, index) {
                                                        if (game.attendance.pending.length === 1) {
                                                            return <li key={key}>none</li>
                                                        } else {
                                                            if (key !== '0') {
                                                                return <li key={key}><p>{game.attendance.pending[key].name}</p> </li>
                                                            } else {
                                                                if (key !== '0') {
                                                                    return <li><p>{game.attendance.pending[key].name}</p> </li>
                                                                } else {
                                                                    return null
                                                                }
                                                            }
                                                        }})}
                                                    
                                                        </ul>
                                                    </div>
                                                </div>
                                            <div className='removeButton'>
                                            {this.state.captainEmail === this.state.currentUserEmail
                                            ? (<button onClick={() => this.removeGame(game.key)} >Remove Game</button>)
                                            : (<div></div>)
                                            }
                                            
                                            </div>
                                        </div>

                                    </Collapsible>
                                    {this.state.loggedIn
                                    ? (<div className="rsvp clearfix">
                                            <p><span>Can you make it?</span><br /> Your Response:{this.playerResponse(game)}
                                        </p>
                                        <div className="buttonYesNo clearfix">
                                        <button onClick={() => this.addToYes(game.key)} >Yes</button>
                                        <button onClick={() => this.addToNo(game.key)}>No</button>
                                        
                                        </div>
                                        
                                        </div>)
                                            
                                            : (<div></div>)
                                        }
                                </div>
                            )
                        })}
                    </div>
                </section>
                <div className="soccerImage">
                    <img src="/public/assets/soccerBall.png" alt="Soccer Ball icon" />
                </div>
            </div>  
            
            )
            
    }
}

export default TeamPage