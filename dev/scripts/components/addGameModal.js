import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import firebase from 'firebase';
import Dropdown from 'react-dropdown';

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
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        const dbRef = firebase.database().ref();

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
        const dbRefTeam = firebase.database().ref(`${this.props.teamKey}`);
        const dbRefGames = firebase.database().ref(`${this.props.teamKey}/games`);
        const dbRefUsers = firebase.database().ref(`${this.props.teamKey}/users`);
        const teamArray = []

        //creates list of user emails in pending when game is created
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

        this.setState({
            modalIsOpen: false,
            opponent: '',
            location: '',
            date: '',
            time: ''
        });
    }
    
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });   
    }

    // Modal controls
    openModal() {
        this.setState({ modalIsOpen: true });
    }
    afterOpenModal() {
        // references are now sync'd and can be accessed.
        //this.subtitle.style.color = '#F00';
    }
    closeModal() {
        this.setState({ modalIsOpen: false });
    }
    
    render() {
        return (
            <div>
                <button onClick={this.openModal}>Add Game</button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
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
                            {this.state.opponentList.map ((opponent)=>{
                                return (
                                    <option value={opponent}> {opponent} </option>
                                )
                            })}
                        </select>

                        <label htmlFor="location" className="hiddenLabel">Location:</label>
                        <input type="text" id="location" name="location" onChange={this.handleChange} value={this.state.userName} placeholder="Game Location" required />

                        <label htmlFor="date" className="hiddenLabel">Game Date:</label>
                        <input type="date" id="date" name="date" onChange={this.handleChange} value={this.state.userEmail} required />

                        <label htmlFor="time" className="hiddenLabel">Game Time:</label>
                        <input type="time" id="time" name="time" onChange={this.handleChange} value={this.state.userPhone} required />

                        <input type="submit" value="Submit" />
                    </form>
                </Modal>
            </div>
        );
    }
}

export default GameModal;