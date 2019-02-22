import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Input, Button, Form, FormGroup, Label } from 'reactstrap';
import avatar from '../../../assets/loginRegister.png';
import './LoginForm.css';

class LoginForm extends Component {

    onSubmitHander = event => {
        // console.log('[localStorage] access-token', localStorage.getItem("access-token"));
        event.preventDefault();

        const username = event.target.txtUser.value;
        const loginInfo = new URLSearchParams();
        loginInfo.append('username', event.target.txtUser.value);
        loginInfo.append('password', event.target.txtPass.value);

        // console.log(event.target.txtUser.value, event.target.txtPass.value);

        axios({
            method: 'POST',
            url: 'http://localhost/webapplication1/Login',
            headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data: loginInfo
        })
            .then(response => {
                // console.log('response', response);
                localStorage.setItem('access-token', response.data);
                this.props.handleLoggedUser(username);
                alert("Hi " + username + ", you're logged in.");
            })
            .catch(error => {
                // console.error('error', error);
                alert("Wrong Username/Password! Please try again.");
            });
    }

    redirectToRegister = () => { this.props.handleFormChange('register'); }

    render() {

        return (
            <div className="loginBox">
                <img src={avatar} alt='login avatar' className="avatar" />
                <h1>Login</h1>
                <Form id="loginForm" onSubmit={this.onSubmitHander}>
                    <FormGroup className="mb-2 mb-sm-0">
                        <Label for="txtUser">Username</Label>
                        <Input id="txtUser" type="text" name="username"
                            placeholder="Enter your username" required />
                    </FormGroup>
                    <FormGroup className="mb-2 mb-sm-0">
                        <Label for="txtPass">Password</Label>
                        <Input id="txtPass" type="password" name="password"
                            placeholder="Enter your password" required />
                    </FormGroup>
                    <Button color="primary" name="submitLogin" type="submit">Login</Button>
                </Form>
                <p className="p1" onClick={this.redirectToRegister}>Don't have an account?</p>
            </div>
        );

    }

}

export default LoginForm;

LoginForm.propTypes = {
    handleFormChange: PropTypes.func,
    handleLoggedUser: PropTypes.func
}

Form.propTypes = {
    onSubmitHander: PropTypes.func
}