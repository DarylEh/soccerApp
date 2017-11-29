import React from 'react';
import firebase from 'firebase';
import Modal from 'react-modal';
import {
    BrowserRouter as Router,
    Route, Link
} from 'react-router-dom';
import TeamPage from './teamPage.js';
import TeamModal from "./modal.js"

class WelcomePage extends React.Component{
    constructor() {
        super();
        this.state = {
            teams: []
        }
    }
    componentDidMount() {
    const dbRef = firebase.database().ref();

        
    dbRef.on("value", (firebaseData) => {
        
        const teamsArray = [];
        const teamsData = firebaseData.val();
        console.log(teamsData);
        for (let teamKey in teamsData) {
            teamsData[teamKey].key = teamKey;
            teamsArray.push(teamsData[teamKey]);
            console.log(teamsData[teamKey])
        }
        this.setState({
            teams: teamsArray
        
        })
        console.log(this.state.teams);
    })
}//end of  componentDidMount
    render(){
        return (
            <main>
                <section>
                    <ul>
                        {this.state.teams.map((team, i) => {
                            return (
                                <div key={team.key}>
                                    <Link to={`/${team.teamName}/${team.key}`}>
                                        <li>{team.teamName}</li>
                                    </Link>
                                </div>
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