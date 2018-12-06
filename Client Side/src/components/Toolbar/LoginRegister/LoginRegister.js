import React, { Component } from 'react';

import './LoginRegister.css';

import Link from 'react-router-dom';

import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import LoginRegisterContainer from '../../../containers/LoginRegister/LoginRegisterContainer';

class LoginRegister extends Component {

    state = {
        modalIsOpen: false,
        view: 'Login',
        isLogged: false,
        userLogged: "",
        buttonText: "Login/Register"
    }

    toggleModal = () => {
        this.setState({
            modalIsOpen: !this.state.modalIsOpen
        });
    }

    toggleUser = username => {
        if (username) {
            const user = username;
            this.setState({
                userLogged: user,
                modalIsOpen: !this.state.modalIsOpen,
                buttonText: "Logged as: " + user
            })
        }
    }

    componentDidMount() {
        console.log('LoginRegister [componentDidMount]');
        if (this.props.loggedIn) {
            const isLogged = this.props.loggedIn;
            this.setState({
                isLogged: isLogged
            })
        }
    }

    componentDidUpdate() {
        console.log('LoginRegister [componentDidUpdate]');
    }

    render() {
        // console.log('LoginRegister [render]');
        // console.log(this.state);

        // const buttonText = this.state.isLogged ? "Logged as " + this.state.userLogged : "Login/Register";
        return (
            <div>
                <Button color="primary" id="loginButton"
                    title="Login/Register" onClick={this.toggleModal}>
                    <FontAwesomeIcon icon={faUser} /> {this.state.buttonText}
                </Button>
                <LoginRegisterContainer
                    title={this.state.view}
                    isOpen={this.state.modalIsOpen}
                    toggleModal={this.toggleModal}
                    toggleUsername={this.toggleUser}
                />
            </div>
        );

    }
}

export default LoginRegister;