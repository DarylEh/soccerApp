import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import firebase from 'firebase';

// LOGIN MODAL
// Opens when user needs to log in

class LoginModal extends React.Component {
    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // User action: submit 'new team' form
    handleSubmit(event) {
        event.preventDefault();
        
        // sign the user in with firbase auth
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((results) => {
                // Pass current user's email back to know who is clicking buttons etc
                this.props.getCurrentUserEmail(this.state.email);
                this.setState({
                    modalIsOpen: false,
                })
            })
            .catch((error) => {
                alert(error.message)
            })
    }
    
    // Save form input value in state
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
                <button onClick={this.openModal}>Login</button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="Login"
                    className="modalContainer"
                    overlayClassName="modalOverlay"
                >

                    <h2 ref={subtitle => this.subtitle = subtitle} className="modalTitle titleBottomMargin">Login:</h2>
                    <a onClick={this.closeModal} className="closeModalButton"><i className="fa fa-times" aria-hidden="true"></i></a>

                    <form action="" onSubmit={this.handleSubmit} className="modalForm">
                        <label htmlFor="email" className="hiddenLabel">E-mail:</label>
                        <input type="text" id="email" name="email" onChange={this.handleChange} value={this.state.email} placeholder="Email" required />

                        <label htmlFor="password" className="hiddenLabel">Password:</label>
                        <input type="password" id="password" name="password" onChange={this.handleChange} value={this.state.password} placeholder="Password" required />

                        <input type="submit" value="Login" />
                    </form>
                </Modal>
            </div>
        );
    }
}

export default LoginModal;