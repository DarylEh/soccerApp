import React from 'react';
import GameModal from "./addGameModal.js";
import PlayerModal from "./addPlayerModal.js";
import LoginModal from "./loginModal.js";
import firebase from 'firebase';
import {
    BrowserRouter as Router,
    Route, Link, Switch
} from 'react-router-dom';
import Collapsible from 'react-collapsible';
import ManageTeam from './manageTeam.js';



class TeamPage extends React.Component {
    constructor() {
        super();
        this.state = {
            games: []
        }
    }
    //getting data from firebase to populate upcoming games
    componentDidMount() {
        const teamId = this.props.match.params.key;
        const dbRef = firebase.database().ref(teamId);
        
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
            // console.log(gamesArray)
        })
    }

    render(){
        return (
            
            <div>
                <LoginModal teamKey={this.props.match.params.key}/>
                <GameModal teamKey={this.props.match.params.key}/>
                    <h2>{this.props.match.params.team}</h2>
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
                                <div className="rsvp">
                                    <button>Yes</button>
                                    <button>No</button>
                                    <p>You said TBA</p>
                                </div>
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