import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import firebase from 'firebase';

// NEW TEAM MODAL
// Opens when user needs to create a new team in the app

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

    // Create team captain in firebase auth
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
    
    // on successful creation of user, create a corresponding item in the database
    createUser(userID) {
        // Firebase root
        const dbRef = firebase.database().ref();
        // Team & captain info to be sent to Firebase
        const teamObject = {
            teamName: this.state.teamName,
            users: {
                captain: {
                    name: this.state.name,
                    email: this.state.email,
                    phone: this.state.phone,
                    gender: this.state.gender,
                    password: this.state.password,
                    uid: userID
                }
            }
        }
        dbRef.push(teamObject);

        // Empties out form to start fresh on reopen
        this.setState({
            modalIsOpen: false,
            name: '',
            email: '',
            phone: '',
            gender: '',
            password: '',
            passwordMatch: '',
            teamName: ''
        });
    }

    // save text input value in state
    handleChange(event) {
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
                <button onClick={this.openModal} className='addTeamButton'>Add Team</button>

                <Modal 
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    contentLabel="Create Team"
                    className="modalContainer"
                    overlayClassName="modalOverlay"
                    >

                    <h2 ref={subtitle => this.subtitle = subtitle} className="modalTitle">Create A New Team</h2>
                    <a onClick={this.closeModal} className="closeModalButton"><i className="fa fa-times" aria-hidden="true"></i></a>

                    <form action="" onSubmit={this.handleSubmit} className="modalForm">
                        <h2>Team Info:</h2>
                        <label htmlFor="teamName" className="hiddenLabel">Team Name:</label>
                        <input type="text" id="teamName" name="teamName" onChange={this.handleChange} value={this.state.teamName} placeholder="Team Name" required />

                        <h2>Your Info:</h2>
                        <label htmlFor="userName" className="hiddenLabel">Name:</label>
                        <input type="text" id="userName" name="name" onChange={this.handleChange} value={this.state.userName} placeholder="Name" required />

                        <label htmlFor="userEmail" className="hiddenLabel">Email:</label>
                        <input type="text" id="userEmail" name="email" onChange={this.handleChange} value={this.state.userEmail} placeholder="Email" required />

                        <label htmlFor="userPhone" className="hiddenLabel">Phone Number:</label>
                        <input type="text" id="userPhone" name="phone" onChange={this.handleChange} value={this.state.userPhone} placeholder="Your Phone Number" />

                        <p className="radioCategoryLabel">Gender:</p>
                        <div className="radioButtonWrapper">
                            <input type="radio" id="userGenderMale" name="gender" onChange={this.handleChange} value="male" required />
                            <label htmlFor="userGenderMale">Male</label>
                            <input type="radio" id="userGenderFemale" name="gender" onChange={this.handleChange} value="female" required />
                            <label htmlFor="userGenderFemale">Female</label>
                        </div>

                        <label htmlFor="userPassword" className="hiddenLabel">Password:</label>
                        <input type="password" id="userPassword" name="password" onChange={this.handleChange} value={this.state.userPassword} placeholder="Password" required />
                        <label htmlFor="passwordMatch" className="hiddenLabel">Confirm Password:</label>
                        <input type="password" id="passwordMatch" name="passwordMatch" onChange={this.handleChange} value={this.state.confirmPassword} placeholder="Confirm Password" required />
                        
                        <input type="submit" value="Create Team" className="submitButton" />
                    </form>
                </Modal>
            </div>
        );
    }
}
export default TeamModal;