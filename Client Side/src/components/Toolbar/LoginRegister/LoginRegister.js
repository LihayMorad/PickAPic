import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import LoginRegisterFormContainer from '../../../containers/LoginRegister/LoginRegisterFormContainer';

import axios from 'axios';

import './LoginRegister.css';

class LoginRegister extends Component {

    state = {
        modalIsOpen: false,
        isLogged: false,
        userLoggedIn: "",
        buttonText: "Login/Register"
    }

    toggleModal = () => {
        this.setState({ modalIsOpen: !this.state.modalIsOpen });
    }

    toggleUser = username => {
        if (username) {
            this.setState({
                modalIsOpen: false,
                isLogged: true,
                userLoggedIn: username,
                buttonText: " Logged as: " + username
            })
        }
    }

    componentWillMount() {
        // console.log('[LoginRegister] componentWillMount');

        const localStorageAccessToken = localStorage.getItem("access-token");
        if (localStorageAccessToken) {
            const accessToken = new URLSearchParams();
            accessToken.append('accessToken', localStorageAccessToken);

            // for (const param of accessToken) console.log('[LoginRegister]', param);
            axios({
                method: 'POST',
                url: 'http://localhost/webapplication1/CheckAccessToken',
                headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: accessToken
            })
                .then(response => {
                    // console.log("[CheckAccessToken] response.data - username: ", response.data);
                    // console.log(response);
                    this.toggleUser(response.data);
                })
                .catch(error => {
                    // console.error('[CheckAccessToken] ERROR ~~Login token not found~~', error);
                });
        }
    }

    componentDidUpdate() {
        // console.log('[LoginRegister] componentDidUpdate');
    }

    render() {

        return (
            <div>
                <Button
                    color="primary"
                    id="loginButton"
                    title="Login/Register"
                    onClick={this.toggleModal}>
                    <FontAwesomeIcon icon={faUser} /> {this.state.buttonText}
                </Button>

                <LoginRegisterFormContainer
                    isOpen={this.state.modalIsOpen}
                    toggleModal={this.toggleModal}
                    toggleUser={this.toggleUser} />
            </div>
        );

    }
}

export default LoginRegister;

LoginRegisterFormContainer.propTypes = {
    isOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
    toggleUser: PropTypes.func
}

Button.propTypes = {
    onClick: PropTypes.func
}