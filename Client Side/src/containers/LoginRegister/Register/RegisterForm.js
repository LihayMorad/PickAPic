import React, { Component } from 'react';

import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';

import { Input, Button, Form, FormGroup, Label } from 'reactstrap';

import avatar from '../../../assets/loginRegister.png';

import './RegisterForm.css';

class RegisterForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errormsg: null
        };

    }

    onSubmitHander = (event) => {

        event.preventDefault();

        const registerInfo = new URLSearchParams();
        const username = event.target.txtUser.value;
        registerInfo.append('username', event.target.txtUser.value);
        registerInfo.append('password', event.target.txtPass.value);

        axios({
            method: 'post',
            url: 'http://localhost/webapplication1/Registration',
            headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data: registerInfo
        })
            .then((response) => {
                console.log(response);
                alert("Successfully registered, you are logged in now.")
                this.props.toggleUsername(username);
            })
            .catch((error) => {
                console.log(error);
                alert("Username Already Exists! Please try again.")
            });
    }

    resetState = () => {
        this.setState({ errormsg: null });
    }

    render() {

        return (

            <div className="registerBox">
                <img src={avatar} alt='register avatar' className="avatar" />
                <h1>Register</h1>

                <Form id="registerForm" onSubmit={this.onSubmitHander}>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="txtUser" className="mr-sm-2">Username</Label>
                        <Input type="text" name="username" id="txtUser"
                            placeholder="Enter your username" onChange={this.resetState} required />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="txtPass" className="mr-sm-2">Password</Label>
                        <Input type="password" name="password" id="txtPass"
                            placeholder="Enter your password" onChange={this.resetState} required />
                    </FormGroup>
                    <Button color="primary" name="submitRegister">Register</Button>
                </Form>

                <Link id="moveToLoginBtn" to='/'>
                    <p>Already a user?</p>
                </Link>
            </div>

        );
    }
}

export default withRouter(RegisterForm);