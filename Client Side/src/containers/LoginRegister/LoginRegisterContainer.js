import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import LoginForm from './Login/LoginForm';
import RegisterForm from './Register/RegisterForm';
import './LoginRegisterContainer.css';

class loginRegisterContainer extends Component {

    state = {
        username: "",
        currentPage: "login"
    }

    toggleUser = username => {
        console.log("[toggleUser]", username);
        const user = username;
        if (username) {
            this.props.toggleUsername(user);
        }
    }

    ////function to pass to child component for updating for the current page
    pageSwitchHandler = pageSwitch => {
        this.setState({ currentPage: pageSwitch });
    }

    ////function to pass to child component for updating for the logged user
    getLoggedUserHandler = loggedUser => {
        this.setState({ username: loggedUser });
        console.log(this.state.username);
    }

    ////using conditional rendering. routing is no longer needed
    render() {
        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={this.props.toggleModal}
                    centered >
                    
                    {/* <ModalHeader>{this.props.title}</ModalHeader> */}

                    <ModalBody>

                        {(this.state.currentPage === 'login') ?
                            <LoginForm changePage={this.pageSwitchHandler} loggedUser={this.toggleUser} />
                            :
                            <RegisterForm changePage={this.pageSwitchHandler} loggedUser={this.toggleUser} />}
                    </ModalBody>

                    <ModalFooter>
                        <Button color="secondary" outline onClick={this.props.toggleModal}>Close</Button>
                    </ModalFooter>

                </Modal>
            </div>
        );

    }
}

export default loginRegisterContainer;
