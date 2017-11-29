import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import {
	BrowserRouter as Router,
	Route, Link
} from 'react-router-dom';
import Modal from 'react-modal';
import WelcomeHeader from './components/welcomeHeader.js'
import Footer from './components/footer.js';
import TeamPage from './components/teamPage.js';
import WelcomePage from './components/welcomePage.js'
import TeamModal from "./components/modal.js"


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

	// constructor(){
	// 	super();
	// 	this.state = {
	// 		teams : [
	// 			'orange team',
	// 			'blue',
	// 			'red'
	// 		]
	// 	}
	// }

	render() {
		return (
			<Router>
				<div>
					<WelcomeHeader />
					<Route exact path='/' component={WelcomePage}></Route>
					<Route exact path='/:team' component={TeamPage}></Route>
					{/* <TeamModal /> */}
					<Footer />
				</div>
			</Router>

		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));