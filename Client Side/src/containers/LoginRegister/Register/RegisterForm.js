import React, { Component } from 'react';
import axios from 'axios';
import { Input, Button, Form, FormGroup, Label } from 'reactstrap';
import avatar from '../../../assets/loginRegister.png';
import './RegisterForm.css';

class RegisterForm extends Component {

    onSubmitHander = (event) => {

        event.preventDefault();

        const username = event.target.txtUser.value;
        const registerInfo = new URLSearchParams();
        registerInfo.append('username', event.target.txtUser.value);
        registerInfo.append('password', event.target.txtPass.value);

        // console.log(event.target.txtUser.value, event.target.txtPass.value);

        axios({
            method: 'POST',
            url: 'http://localhost/webapplication1/Registration',
            headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data: registerInfo
        })
            .then((response) => {
                // console.log('response', response);
                localStorage.setItem('access-token', response.data);
                this.props.handleLoggedUser(username);
                alert("Hi, " + username + ", you have been successfully registered! You're logged in.");
            })
            .catch((error) => {
                // console.error('error', error);
                alert("Username Already Exists! Please try again.")
            });
    }

    redirectToLogin = () => { this.props.handleFormChange('login'); }

    render() {

        return (
            <div className="registerBox">
                <img src={avatar} alt='register avatar' className="avatar" />
                <h1>Register</h1>
                <Form id="registerForm" onSubmit={this.onSubmitHander}>
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
                    <Button color="primary" name="submitRegister" type="submit">Register</Button>
                </Form>
                <p className="p1" onClick={this.redirectToLogin}>Already A User?</p>
            </div>
        );
    }
}

export default RegisterForm;