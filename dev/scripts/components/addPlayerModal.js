import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import firebase from 'firebase';

class PlayerModal extends React.Component {
    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
            name: '',
            email: '',
            phone: '',
            gender: '',
            password: '',
            passwordMatch: '',
            uid: ''
        };

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createUser = this.createUser.bind(this);
        this.populateGameAttendance = this.populateGameAttendance.bind(this);
    }
    // User action: submit 'new team' form
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.password === this.state.passwordMatch) {
            this.pushToFirebase();
        } else {
            alert('Passwords do not match')
        }
    }
    
    pushToFirebase(){
        // Add a user for new player
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((data) => {
                this.createUser(data.uid);
            })
            .catch((error) => {
                alert(error.message)
            })

    
    }

    createUser(userID) {
        const dbRef = firebase.database().ref(`${this.props.teamKey}/users`);
        const playerObject = {
            name: this.state.name,
            email: this.state.email,
            phone: this.state.phone,
            gender: this.state.gender,
            password: this.state.password,
            uid: userID
        }
        dbRef.push(playerObject);
        this.populateGameAttendance();
        //empty the form on successful submit
        this.setState({
            modalIsOpen: false,
            name: '',
            email: '',
            phone: '',
            gender: '',
            password: '',
            passwordMatch: ''
        });
    }
    //user action: change value of form item
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    // Push new user into pending on all existing games
    populateGameAttendance() {
        const dbRefGames = firebase.database().ref(`${this.props.teamKey}/games`);
        let gamesData = {};
        dbRefGames.on("value", (firebaseData) => {
            gamesData = firebaseData.val();
            console.log(gamesData);
        })
        for (let game in gamesData) {
            const currentPlayerObject = {
                email: this.state.email,
                name: this.state.name,
                gender: this.state.gender
            }
            firebase.database().ref(`${this.props.teamKey}/games/${game}/attendance/pending`).push(currentPlayerObject);
        }
    }
    
    // Modal controls
    openModal() {
        this.setState({ modalIsOpen: true });
    }
    afterOpenModal() {
        // references are now sync'd and can be accessed.
        // this.subtitle.style.color = '#F00';
    }
    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    render() {
        return (
            <div>
                <button onClick={this.openModal}>Add Player</button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    contentLabel="Create Player"
                    className="modalContainer"
                    overlayClassName="modalOverlay"
                    >

                    <h2 ref={subtitle => this.subtitle = subtitle} className="modalTitle titleBottomMargin">Add Player</h2>
                    <a onClick={this.closeModal} className="closeModalButton"><i className="fa fa-times" aria-hidden="true"></i></a>

                    <form action="" onSubmit={this.handleSubmit} className="modalForm">
                        <label htmlFor="name" className="hiddenLabel">Name:</label>
                        <input type="text" id="name" name="name" onChange={this.handleChange} value={this.state.name} placeholder="Name" required />

                        <label htmlFor="email" className="hiddenLabel">E-mail:</label>
                        <input type="text" id="email" name="email" onChange={this.handleChange} value={this.state.email} placeholder="Email" required />

                        <label htmlFor="phone" className="hiddenLabel">Phone #:</label>
                        <input type="text" id="phone" name="phone" onChange={this.handleChange} value={this.state.phone} placeholder="Phone Number" required />

                        <p className="radioCategoryLabel">Gender:</p>
                        <div className="radioButtonWrapper">
                            <input type="radio" id="genderMale" name="gender" onChange={this.handleChange} value="male" required />
                            <label htmlFor="genderMale">Male</label>
                            <input type="radio" id="genderFemale" name="gender" onChange={this.handleChange} value="female" required />
                            <label htmlFor="genderFemale">Female</label>
                        </div>

                        <label htmlFor="password" className="hiddenLabel">Password:</label>
                        <input type="password" id="password" name="password" onChange={this.handleChange} value={this.state.password} placeholder="Password" required />

                        <label htmlFor="passwordMatch" className="hiddenLabel">Confirm password:</label>
                        <input type="password" id="passwordMatch" name="passwordMatch" onChange={this.handleChange} value={this.state.passwordMatch} placeholder="Confirm Password" required />

                        <input type="submit" value="Submit" />
                    </form>
                </Modal>
            </div>
        );
    }
}

export default PlayerModal;