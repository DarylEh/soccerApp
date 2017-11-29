import React from 'react';
import GameModal from "./addGameModal.js";
import firebase from 'firebase';
import {
    BrowserRouter as Router,
    Route, Link
} from 'react-router-dom';

class TeamPage extends React.Component {
    render(){
        return (
            <div>
                <GameModal />
                <h2>{this.props.match.params.team}</h2>
                {/* add link to manage teams here */}
                <section>
                    <h3>Upcoming Games</h3>
                    <div className="container">
                        <div>
                            <h4>Location</h4>
                            <p></p>
                            <h4>Time</h4>
                            <p></p>
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
                        <div className="rsvp">
                            <button>Yes</button>
                            <button>No</button>
                            <p>You said TBA</p>
                        </div>
                    </div>  {/*end of container */}
                </section>
            </div>    
        )
    }
}

export default TeamPage