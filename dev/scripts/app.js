import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import {
	BrowserRouter as Router,
	Route, Link
} from 'react-router-dom';

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
			<div>
				Hello
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));