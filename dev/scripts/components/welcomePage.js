import React from 'react';
import firebase from 'firebase';
import {
    BrowserRouter as Router,
    Route, Link
} from 'react-router-dom';
import TeamPage from './teamPage.js'



class WelcomePage extends React.Component{
    constructor() {
        super();
        this.state = {
            teams: [
                'orange team',
                'blue',
                'red'
            ]
        }
    }

    

    render(){
        return (
            <main>
                <section>
                    <ul>
                        {this.state.teams.map((team, i) => {
                            return (
                                <div>
                                    <Link to={`/${team}`}>
                                        <li>{team}</li>
                                    </Link>

                                </div>
                            )
                        })}
                    </ul>
                </section>
                <section>
                    {/* button to take you to subs roster */}
                </section>
            </main>
        )
    }
}

export default WelcomePage