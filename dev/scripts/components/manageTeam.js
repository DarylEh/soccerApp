import React from 'react';
import firebase from 'firebase';
import Modal from 'react-modal';
import {
    BrowserRouter as Router,
    Route, Link
} from 'react-router-dom';
import TeamPage from './teamPage.js';
import PlayerModal from "./addPlayerModal.js"
import Collapsible from 'react-collapsible';

// LOGIN MODAL
// Opens when user needs to log in

class ManageTeam extends React.Component {
    constructor () {
        super();
        this.state = {
            players:[]
        }
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount(){
        // team's key in Firebase - user to find & write info to team
        const teamId = this.props.match.params.key;
        // Firebase root -> a specific team
        const dbRef = firebase.database().ref(teamId);

        // Get player info from Firebase to be displayed on page
        dbRef.on("value", (firebaseData) => {
            const teamData = firebaseData.val();
            const playerArray = [];
            const playerData = teamData.users;
            for (let userKey in playerData) {
                playerData[userKey].key = userKey;
                playerArray.push(playerData[userKey]);
            }
            this.setState({
                players: playerArray
            })
        })
    }

    // back to team page
    goBack() {
        // signs users out b/c Firebase won't let you create a user without also logging in as them
        // this saves confusion after a team captain creates a player and goes back signed in as a different person
        firebase.auth().signOut();
        window.history.back();
    }

    render(){
        return (
            <div className='wrapper'>
                <h2 className='rosterTitle'>Roster</h2>
                <div className='rosterButtons clearfix'>
                    <div className='rosterBack'>
                        <button onClick={this.goBack}>Back</button>
                    </div>
                    <PlayerModal teamKey={this.props.match.params.key} />
                </div>
                <section className='roster'>
                    {this.state.players.map ((player, i)=>{
                        return (
                            <div key={i}>
                                <Collapsible trigger={`${player.name}`}>
                                    <div className="innerWrapper rosterPanel">
                                        <p><span>Phone:</span> {player.phone}</p>
                                        <p><span>E-mail:</span> {player.email}</p>
                                    </div>
                                </ Collapsible>
                            </div>
                        )
                    })}
                </section>
                <div className="soccerImage">
                    <img src="/public/assets/soccerBall.png" alt="Soccer Ball icon"/>
                </div>
            </div>
        )
    }
}

export default ManageTeam;