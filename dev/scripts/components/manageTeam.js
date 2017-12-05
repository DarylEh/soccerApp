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

class ManageTeam extends React.Component {
constructor () {
    super();
    this.state = {
        players:[]
    }
    this.goBack = this.goBack.bind(this);
    this.signOut = this.signOut.bind(this);
}
    goBack() {
        this.signOut()
        window.history.back();

    }

    signOut() {
        firebase.auth().signOut();
    }

//gets player data from database
componentDidMount(){
    const teamId = this.props.match.params.key;
    const dbRef = firebase.database().ref(teamId);

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


//displaying player info on the accordian
render(){
    return (
        <div className='wrapper'>
            <h2 className='rosterTitle'>Roster</h2>
            <div className="rosterButtons clearfix">
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