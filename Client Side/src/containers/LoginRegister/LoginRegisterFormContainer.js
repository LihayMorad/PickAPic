import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import LoginForm from './Login/LoginForm';
import RegisterForm from './Register/RegisterForm';
import './LoginRegisterFormContainer.css';

class loginRegisterFormContainer extends Component {

    state = {
        currentPage: "login"
    }

    ////function to pass to child component for updating for the current page
    formSwitchHandler = currentPage => { this.setState({ currentPage: currentPage }); }

    ////using conditional rendering. routing is no longer needed
    render() {
        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={this.props.toggleModal}
                    centered >

                    <ModalBody>
                        {(this.state.currentPage === 'login') ?
                            <LoginForm
                                handleFormChange={this.formSwitchHandler}
                                handleLoggedUser={this.props.toggleUser} />
                            :
                            <RegisterForm
                                handleFormChange={this.formSwitchHandler}
                                handleLoggedUser={this.props.toggleUser} />}
                    </ModalBody>

                    <ModalFooter>
                        <Button color="secondary" outline onClick={this.props.toggleModal}>Close</Button>
                    </ModalFooter>

                </Modal>
            </div>
        );

    }
}

export default loginRegisterFormContainer;

loginRegisterFormContainer.propTypes = {
    isOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
    toggleUser: PropTypes.func
}

LoginForm.propTypes = {
    handleFormChange: PropTypes.func,
    handleLoggedUser: PropTypes.func
}

RegisterForm.propTypes = {
    handleFormChange: PropTypes.func,
    handleLoggedUser: PropTypes.func
}

Button.propTypes = {
    onClick: PropTypes.func
}

Modal.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
}