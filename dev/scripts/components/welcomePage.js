import React from 'react';
import firebase from 'firebase';
import Modal from 'react-modal';
import {
    BrowserRouter as Router,
    Route, Link
} from 'react-router-dom';
import TeamPage from './teamPage.js';
import TeamModal from "./addTeamModal.js"

// WELCOME / HOME PAGE
// Landing page of app - display a list of teams for user to select from

class WelcomePage extends React.Component{
    constructor() {
        super();
        this.state = {
            teams: []
        }
    }

    //loading team data from firebase when page mounts
    componentDidMount() {
        // Firebase root
        const dbRef = firebase.database().ref();

        // Pull list of teams from Firebase
        dbRef.on("value", (firebaseData) => {
            const teamsArray = [];
            const teamsData = firebaseData.val();
            
            // Save list of teams to state
            for (let teamKey in teamsData) {
                teamsData[teamKey].key = teamKey;
                teamsArray.push(teamsData[teamKey]);
            }
            this.setState({
                teams: teamsArray
            })
        })
    }

    render(){
        return (
            <main className="wrapper">
                <section className='welcomePage'>
                    <h2>Find Your Team</h2>
                    <ul className="clearfix teams">
                        {this.state.teams.map((team, i) => {
                            return (
                                <Link to={`/${team.teamName}/${team.key}`}>
                                    <div className="teamTile" key={team.key}>
                                        <li>{team.teamName}</li>
                                    </div>
                                </Link>
                            )
                        })}
                    </ul>
                </section>
                <section>
                    <TeamModal />
                </section>
            </main>
        )
    }
}

export default WelcomePage