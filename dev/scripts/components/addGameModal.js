import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import firebase from 'firebase';
import Dropdown from 'react-dropdown';

// GAME MODAL
// Opens when user needs to create a new game

class GameModal extends React.Component {
    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
            opponent: '',
            location: '',
            date: '',
            time: '',
            opponentList: []
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidMount() {
        // Firebase root
        const dbRef = firebase.database().ref();

        // Pulls a list of possible opponents to populate a select element
        dbRef.on("value", (firebaseData) => {
            const opponentData = firebaseData.val();
            const opponentArray = [];
            for (let opponentKey in opponentData) {
                opponentArray.push(opponentData[opponentKey].teamName);
            }
            this.setState({
                opponentList: opponentArray
            })
        })
    }

    // User action: submit 'add game' form
    handleSubmit(event) {
        event.preventDefault();
        // Firebase root -> a specific team
        const dbRefTeam = firebase.database().ref(`${this.props.teamKey}`);
        // Firebase root -> a specific team -> games array
        const dbRefGames = firebase.database().ref(`${this.props.teamKey}/games`);
        // Firebase root -> a specific team -> users object
        const dbRefUsers = firebase.database().ref(`${this.props.teamKey}/users`);
        // users (& their info) returned from firebase
        const teamArray = [];

        // Get user info from firebase
        firebase.database().ref(`${this.props.teamKey}`).on('value', (players) => {
            const userObj = players.val().users;
            teamArray[0] = {name: 'none'}
            let i = 1;
            for (let userKey in userObj) {
                const currentPlayerObject = {
                    email: userObj[userKey]['email'],
                    name: userObj[userKey]['name'],
                    gender: userObj[userKey]['gender'],
                }
                teamArray[i] = currentPlayerObject;
                i++;
            }
        })

        // game information to send to firebase
        const gameObject = {
            location: this.state.location,
            date: this.state.date,
            time: this.state.time,
            opponent: this.state.opponent,
            attendance: {
                pending: teamArray,
                yes: {0: {name: 'none'}},
                no: {0: {name: 'none'}}
            }
        }
        dbRefGames.push(gameObject);

        // Empties out form to start fresh on reopen
        this.setState({
            modalIsOpen: false,
            opponent: '',
            location: '',
            date: '',
            time: ''
        });
    }
    
    // Pull value from text input and save in state
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });   
    }

    // Modal controls
    openModal() {
        this.setState({ modalIsOpen: true });
    }
    closeModal() {
        this.setState({ modalIsOpen: false });
    }
    
    render() {
        return (
            <div>
                {/* Button appears inline in content */}
                <button 
               className="addGameButton" onClick={this.openModal}>Add Game</button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="Create Game"
                    className="modalContainer"
                    overlayClassName="modalOverlay"
                    >

                    <h2 ref={subtitle => this.subtitle = subtitle} className="modalTitle titleBottomMargin">Add Game</h2>
                    <a onClick={this.closeModal} className="closeModalButton"><i className="fa fa-times" aria-hidden="true"></i></a>

                    <form action="" onSubmit={this.handleSubmit} className="modalForm">
                        <label htmlFor="opponent" className="hiddenLabel"> Opponent </label>
                        <select id="opponent" name="opponent" onChange={this.handleChange}  >
                            <option value="" disabled selected hidden>Select Opponent</option>
                            { // return list of possible opponents from other teams on the app
                                this.state.opponentList.map ((opponent, i)=>{
                                return (
                                    <option value={opponent} key={i}> {opponent} </option>
                                )
                            })}
                        </select>

                        <label htmlFor="location" className="hiddenLabel">Location:</label>
                        <input type="text" id="location" name="location" onChange={this.handleChange} value={this.state.userName} placeholder="Game Location" required />

                        <label htmlFor="date" className="hiddenLabel">Game Date:</label>
                        <input type="date" id="date" name="date" onChange={this.handleChange} value={this.state.userEmail} required />

                        <label htmlFor="time" className="hiddenLabel">Game Time:</label>
                        <input type="time" id="time" name="time" onChange={this.handleChange} value={this.state.userPhone} required />

                        <input type="submit" value="Add Game" />
                    </form>
                </Modal>
            </div>
        );
    }
}

export default GameModal;