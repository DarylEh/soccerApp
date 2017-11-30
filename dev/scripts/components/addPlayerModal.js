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
                <button onClick={this.openModal}>+ Add Player</button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >

                    <h2 ref={subtitle => this.subtitle = subtitle}>Add New Player</h2>
                    <button onClick={this.closeModal}>close</button>

                    <form action="" onSubmit={this.handleSubmit}>
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" onChange={this.handleChange} value={this.state.name} required />

                        <label htmlFor="email">E-mail:</label>
                        <input type="text" id="email" name="email" onChange={this.handleChange} value={this.state.email} required />

                        <label htmlFor="phone">Phone #:</label>
                        <input type="text" id="phone" name="phone" onChange={this.handleChange} value={this.state.phone} required />

                        <p>Gender:</p>
                        <label htmlFor="genderMale">Male</label>
                        <input type="radio" id="genderMale" name="gender" onChange={this.handleChange} value="male" required />
                        <label htmlFor="genderFemale">Female</label>
                        <input type="radio" id="genderFemale" name="gender" onChange={this.handleChange} value="female" required />

                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" onChange={this.handleChange} value={this.state.password} required />

                        <label htmlFor="passwordMatch">Confirm password:</label>
                        <input type="password" id="passwordMatch" name="passwordMatch" onChange={this.handleChange} value={this.state.passwordMatch} required />

                        <input type="submit" value="Submit" />
                    </form>
                </Modal>
            </div>
        );
    }
}

export default PlayerModal;