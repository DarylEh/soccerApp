import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import firebase from 'firebase';

class LoginModal extends React.Component {
    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
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
        
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((results) => {
                this.props.getCurrentUserEmail(this.state.email);
                this.setState({
                    modalIsOpen: false,
                })
                //this.props.getCurrentUserEmail(this.state.email);
            })
            .catch((error) => {
                alert(error.message)
            })
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
                    onAfterOpen={this.afterOpenModal}
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