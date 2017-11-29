import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import firebase from 'firebase';

// Firebase init


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
            userName: '',
            userEmail: '',
            userPhone: '',
            userGender: '',
            userPassword: '',
            passwordMatch: ''
        };

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    
    handleSubmit (event){
        event.preventDefault();
        const dbRef = firebase.database().ref();
        const teamObject = {
            teamName: this.state.teamName,
            users:{
                userName: this.state.userName,
                userEmail: this.state.userEmail,
                userPhone: this.state.userPhone,
                userGender: this.state.userGender,
                userPassword: this.state.userPassword
            }

        }
        console.log(teamObject);
        dbRef.push(teamObject);

    }
    handleBlur(event){
        this.setState({
            [event.target.id] : event.target.value
        });

    }
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
                    {/* <div>I am a modal</div> */}
                    <form action="" onSubmit={this.handleSubmit}>
                        <h2>Team Info:</h2>

                        <label htmlFor="teamName">Team Name:</label>
                        <input type="text" id="teamName" onBlur={this.handleBlur} />

                        <h2>Your Info:</h2>
                        <label htmlFor="userName">Name:</label>
                        <input type="text" id="userName" onBlur={this.handleBlur} />

                        <label htmlFor="userEmail">Email:</label>
                        <input type="text" id="userEmail" onBlur={this.handleBlur} />

                        <label htmlFor="userPhone">Phone Number:</label>
                        <input type="text" id="userPhone" onBlur={this.handleBlur} />

                        <p>Gender:</p>
                        <label htmlFor="userGenderMale">Male</label>
                        <input type="radio" id="userGenderMale" name="userGender" onBlur={this.handleBlur} />
                        <label htmlFor="userGenderFemale">Female</label>
                        <input type="radio" id="userGenderFemale" name="userGender" onBlur={this.handleBlur} />

                        <label htmlFor="userPassword">Password:</label>
                        <input type="password" id="userPassword" onBlur={this.handleBlur} />
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input type="password" id="userPassword" onBlur={this.handleBlur} />
                        <p></p>
                        <input type="submit" value="Submit" />
                    </form>
                </Modal>
            </div>
        );
    }
}
export default TeamModal;