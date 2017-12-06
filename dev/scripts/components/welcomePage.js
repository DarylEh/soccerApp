import React from 'react';
import firebase from 'firebase';
import Modal from 'react-modal';
import {
    BrowserRouter as Router,
    Route, Link
} from 'react-router-dom';
import TeamPage from './teamPage.js';
import TeamModal from "./addTeamModal.js"

class WelcomePage extends React.Component{
    constructor() {
        super();
        this.state = {
            teams: []
        }
    }

    //loading team data from firebase when page mounts
    componentDidMount() {
    const dbRef = firebase.database().ref();

        
    dbRef.on("value", (firebaseData) => {
        
        const teamsArray = [];
        const teamsData = firebaseData.val();
        // console.log(teamsData);
        for (let teamKey in teamsData) {
            teamsData[teamKey].key = teamKey;
            teamsArray.push(teamsData[teamKey]);
            // console.log(teamsData[teamKey])
        }
        this.setState({
            teams: teamsArray
        
        })
    })
}//end of  componentDidMount

    render(){
        return (
            <main className="wrapper">
                <section className='welcomePage'>
                    <h2>Find Your Team</h2>
                    <ul className="clearfix">
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