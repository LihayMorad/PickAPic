import React, { Component } from 'react';

import { Route, Switch } from 'react-router-dom';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import LoginForm from './Login/LoginForm';
import RegisterForm from './Register/RegisterForm';

import './LoginRegisterContainer.css';

class loginRegisterContainer extends Component {

    state = {
        username: ""
    }

    toggleUser = username => {
        console.log("[toggleUser]", username);
        const user = username;
        if (username) {
            this.props.toggleUsername(user);
        }
    }

    render() {

        return (
            <div id="divmo">
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={this.props.toggleModal} >

                    {/* <ModalHeader>{this.props.title}</ModalHeader> */}

                    <ModalBody>

                        <Switch>
                            <Route exact path="/" name="login"
                                render={(props) => <LoginForm {...props} toggleUsername={this.toggleUser} />}
                            />
                            <Route path="/register" name="register"
                                render={(props) => <RegisterForm {...props} toggleUsername={this.toggleUser} />}
                            />
                        </Switch>

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
