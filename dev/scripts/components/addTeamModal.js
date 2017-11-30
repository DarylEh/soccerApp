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

class TeamModal extends React.Component {
    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
            teamName: '',
            name: '',
            email: '',
            phone: '',
            gender: '',
            password: '',
            passwordMatch: ''
        };

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.pushToFirebase = this.pushToFirebase.bind(this);
    }
    // User action: submit 'new team' form
    handleSubmit (event){
        event.preventDefault();
        if (this.state.password === this.state.passwordMatch) {
            this.pushToFirebase();
        } else {
            alert('Passwords do not match')
        }
    }
    pushToFirebase() {
        // Create a user for the person who just made a team
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((data) => {
                this.createUser(data.uid);
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    createUser(userID) {
        const dbRef = firebase.database().ref();
        const playerObject = {
            teamName: this.state.teamName,
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
    // User action: remove focus from form item
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
        this.subtitle.style.color = '#f00';
    }
    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    render() {
        return (
            <div>
                <button onClick={this.openModal}>+ Add Team</button>

                <Modal 
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                    >

                    <h2 ref={subtitle => this.subtitle = subtitle}>Team Name</h2>
                    <button onClick={this.closeModal}>close</button>

                    <form action="" onSubmit={this.handleSubmit}>
                        <h2>Team Info:</h2>
                        <label htmlFor="teamName">Team Name:</label>
                        <input type="text" id="teamName" name="teamName" onChange={this.handleChange} value={this.state.teamName} required />

                        <h2>Your Info:</h2>
                        <label htmlFor="userName">Name:</label>
                        <input type="text" id="userName" name="name" onChange={this.handleChange} value={this.state.userName} required />

                        <label htmlFor="userEmail">Email:</label>
                        <input type="text" id="userEmail" name="email" onChange={this.handleChange} value={this.state.userEmail} required />

                        <label htmlFor="userPhone">Phone Number:</label>
                        <input type="text" id="userPhone" name="phone" onChange={this.handleChange} value={this.state.userPhone} />

                        <p>Gender:</p>
                        <label htmlFor="userGenderMale">Male</label>
                        <input type="radio" id="userGenderMale" name="gender" onChange={this.handleChange} value="male" required />
                        <label htmlFor="userGenderFemale">Female</label>
                        <input type="radio" id="userGenderFemale" name="gender" onChange={this.handleChange} value="female" required />

                        <label htmlFor="userPassword">Password:</label>
                        <input type="password" id="userPassword" name="password" onChange={this.handleChange} value={this.state.userPassword} required />
                        <label htmlFor="passwordMatch">Confirm Password:</label>
                        <input type="password" id="passwordMatch" name="passwordMatch" onChange={this.handleChange} value={this.state.confirmPassword} required />
                        
                        <input type="submit" value="Submit" />
                    </form>
                </Modal>
            </div>
        );
    }
}
export default TeamModal;