import React, { Component } from 'react';

import { connect } from 'react-redux';
import * as actionTypes from '../../../store/actions';

import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import LoginRegisterFormContainer from '../../../containers/LoginRegister/LoginRegisterFormContainer';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

import axios from 'axios';

import './LoginRegister.css';

class LoginRegister extends Component {

    state = {
        modalIsOpen: false,
        isLogged: false,
        userLoggedIn: this.props.loggedInUser,
        buttonText: "Login/Register"
    }

    logoutHandler = () => {
        if (this.props.loggedInUser && this.state.isLogged) {
            confirmAlert({
                title: 'Logout',
                message: 'Do you want to logout?',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => {
                            localStorage.removeItem('access-token');
                            this.setState({
                                buttonText: "Login/Register",
                                isLogged: false
                            }, () => this.props.onUserLoggedInChange(""));
                            return true;
                        }
                    },
                    {
                        label: 'No',
                        onClick: () => { return false; }
                    }
                ]
            })
        }

    }

    toggleModal = () => {
        this.logoutHandler();
        if (!this.state.isLogged && !this.props.loggedInUser) {
            this.setState({ modalIsOpen: !this.state.modalIsOpen });
        }
    }

    toggleUser = username => {
        if (username) {
            this.setState({
                modalIsOpen: false,
                isLogged: true,
                buttonText: " Logged as: " + username
            }, () => this.props.onUserLoggedInChange(username));
        }
    }

    componentDidMount() {
        const localStorageAccessToken = localStorage.getItem("access-token");
        if (localStorageAccessToken) {
            const accessToken = new URLSearchParams();
            accessToken.append('accessToken', localStorageAccessToken);

            axios({
                method: 'POST',
                url: 'http://localhost/webapplication1/CheckAccessToken',
                headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: accessToken
            })
                .then(response => {
                    this.toggleUser(response.data);
                })
                .catch(error => { });
        }
    }

    render() {

        return (
            <div>
                <Button color="primary" id="loginButton" title="Login/Register" onClick={this.toggleModal}>
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

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
    return {
        onUserLoggedInChange: (username) => dispatch({ type: actionTypes.CHANGE_LOGGED_IN_USER, username: username })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginRegister);

LoginRegisterFormContainer.propTypes = {
    isOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
    toggleUser: PropTypes.func
}

Button.propTypes = {
    onClick: PropTypes.func
}