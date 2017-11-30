import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import firebase from 'firebase';
import Dropdown from 'react-dropdown';
import { BreadcrumbsProvider } from 'react-breadcrumbs-dynamic';
import { Breadcrumbs } from 'react-breadcrumbs-dynamic';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';

// Size of popup window
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

class GameModal extends React.Component {
    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
            opponent: '',
            location: '',
            date: '',
            time: '',
            opponentList :[]        
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
            console.log(opponentData);
            for (let opponentKey in opponentData) {
                opponentArray.push(opponentData[opponentKey].teamName);
                console.log(opponentData[opponentKey].teamName)
            }
            this.setState({
                opponentList: opponentArray
            })
            console.log(this.state.opponentList)
        })
    }
    // User action: submit 'add game' form
    handleSubmit(event) {
        event.preventDefault();
        const dbRefTeam = firebase.database().ref(`${this.props.teamKey}`);
        const dbRefGames = firebase.database().ref(`${this.props.teamKey}/games`);
        const dbRefUsers = firebase.database().ref(`${this.props.teamKey}/users`);
        const teamObject = {};

        firebase.database().ref(`${this.props.teamKey}`).on('value', (players) => {
            const userObj = players.val().users.email;
            console.log(userObj);
            let i = 0;
            for (let userKey in userObj) {
                teamObject[i] = userKey;
                i++;
            }
            console.log(userObj)
        })
        const gameObject = {
            location: this.state.location,
            date: this.state.date,
            time: this.state.time,
            opponent: this.state.opponent,
            attendance: {
                pending: teamObject,
                yes: 'none',
                no: 'none'
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
        this.subtitle.style.color = '#F00';
    }
    closeModal() {
        this.setState({ modalIsOpen: false });
    }
    
    render() {
        // const defaultOption = options[0]
        return (
            
            <div>
                <button onClick={this.openModal}>+ Add Game</button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                    >

                    <h2 ref={subtitle => this.subtitle = subtitle}>Add New Game</h2>
                    <button onClick={this.closeModal}>close</button>

                    <form action="" onSubmit={this.handleSubmit}>
                    
                        <label htmlFor="opponent"> Opponent </label>
                        <select id="opponent" name="opponent" onChange={this.handleChange} >
                            {this.state.opponentList.map ((opponent)=>{
                                return (
                                    <option value={opponent}> {opponent} </option>
                                )
                            })}
                        </select>

                        <label htmlFor="location">Location:</label>
                        <input type="text" id="location" name="location" onChange={this.handleChange} value={this.state.userName} required />

                        <label htmlFor="date">Game Date:</label>
                        <input type="date" id="date" name="date" onChange={this.handleChange} value={this.state.userEmail} required />

                        <label htmlFor="time">Game Time:</label>
                        <input type="time" id="time" name="time" onChange={this.handleChange} value={this.state.userPhone} required />

                        <input type="submit" value="Submit" />
                    </form>
                </Modal>
            </div>
        );
    }
}

export default GameModal;