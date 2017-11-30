import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import {
	BrowserRouter as Router,
	Route, Link, Switch
} from 'react-router-dom';
import Modal from 'react-modal';
import WelcomeHeader from './components/welcomeHeader.js'
import Footer from './components/footer.js';
import TeamPage from './components/teamPage.js';
import WelcomePage from './components/welcomePage.js';
import TeamModal from "./components/addTeamModal.js";
import GameModal from "./components/addGameModal.js";
import ManageTeam from './components/manageTeam.js';


// Firebase init
var config = {
	apiKey: 'AIzaSyAgZ1C-1-nUuDT3KXsutthpAr8O5Sf-ohs',
	authDomain: 'soccerapp-9ccf0.firebaseapp.com',
	databaseURL: 'https://soccerapp-9ccf0.firebaseio.com',
	projectId: 'soccerapp-9ccf0',
	storageBucket: 'soccerapp-9ccf0.appspot.com',
	messagingSenderId: '865884317137'
};
firebase.initializeApp(config);

class App extends React.Component {
	render() {
		return (
			<Router>
				<div>
					<WelcomeHeader />
					<Switch>
						<Route exact path='/' component={WelcomePage}></Route>
						<Route exact path='/:team/:key/manageTeam' component={ManageTeam}></Route>
						<Route exact path='/:team/:key' component={TeamPage}></Route>
					</ Switch>
					<Footer />
				</div>
			</Router>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));