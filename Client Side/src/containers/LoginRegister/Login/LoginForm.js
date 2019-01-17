import React, { Component } from 'react';
import axios from 'axios';
import { Input, Button, Form, FormGroup, Label } from 'reactstrap';
import avatar from '../../../assets/loginRegister.png';
import './LoginForm.css';

class LoginForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      errormsg: null,
    };
  }

  onSubmitHander = (event) => {

    event.preventDefault();

    const loginInfo = new URLSearchParams();
    const user = event.target.txtUser.value;
    loginInfo.append('username', event.target.txtUser.value);
    loginInfo.append('password', event.target.txtPass.value);

    console.log(event.target.txtUser.value, event.target.txtPass.value);


    axios({
      method: 'POST',
      url: 'http://localhost/webapplication1/Login',
      headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: loginInfo
    })
      .then((response) => {
        console.log(response);
        alert("Successfully logged in!!");
        this.props.loggedUser(user);
        console.log(user);
      })
      .catch((error) => {
        console.log('error');
        alert("Wrong Username/Password! please try again.");
      });
  }

  redirectRegister = () => {
    this.props.changePage('register');
  }
  //// no more routing and linking in login simple pass of data between components (this form <--> wrapper)
  render() {

    return (
      <div className="loginBox">
        <img src={avatar} alt='login avatar' className="avatar" />
        <h1>Login</h1>
        <Form id="loginForm" onSubmit={this.onSubmitHander}>
          <FormGroup className="mb-2 mb-sm-0">
            <Label for="txtUser">Username</Label>
            <Input type="text" name="username" id="txtUser"
              placeholder="Enter your username" onChange={this.resetState} required />
          </FormGroup>
          <FormGroup className="mb-2 mb-sm-0">
            <Label for="txtPass">Password</Label>
            <Input type="password" name="password" id="txtPass"
              placeholder="Enter your password" onChange={this.resetState} required />
          </FormGroup>
          <Button color="primary" name="submitLogin" type="submit">Login</Button>
        </Form>
        <p className="p1" onClick={this.redirectRegister}>Don't have an account?</p>

      </div>
    );
  }

}

export default LoginForm;