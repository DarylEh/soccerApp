import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import firebase from 'firebase';

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
            opponent: '',
            location: '',
            date: '',
            time: ''
        };

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    // User action: submit 'new team' form
    handleSubmit(event) {
        event.preventDefault();
        const dbRef = firebase.database().ref(`${this.props.teamKey}/games`);
        const gameObject = {
            location: this.state.location,
            date: this.state.date,
            time: this.state.time,
            opponent: this.state.opponent,
        }
        dbRef.push(gameObject);
    }

    pushToFirebase() {
        const dbRef = firebase.database().ref();
        // dbRef.push(teamObject);
    }

    // User action: remove focus from form item
    handleChange(event){
        this.setState({
            [event.target.id]: event.target.value
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
                        <label htmlFor="opponent">Opponent:</label>
                        <input type="text" id="opponent" onChange={this.handleChange} value={this.state.teamName} required />

                        <label htmlFor="location">Location:</label>
                        <input type="text" id="location" onChange={this.handleChange} value={this.state.userName} required />

                        <label htmlFor="date">Game Date:</label>
                        <input type="date" id="date" onChange={this.handleChange} value={this.state.userEmail} required />

                        <label htmlFor="time">Game Time:</label>
                        <input type="time" id="time" onChange={this.handleChange} value={this.state.userPhone} required />

                        <input type="submit" value="Submit" />
                    </form>
                </Modal>
            </div>
        );
    }
}

export default GameModal;