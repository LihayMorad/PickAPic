import React from 'react';

import './LoginRegister.css';

import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';


const loginRegister = (props) => {

    return (
        <Button color="primary" id="loginButton"
            title="Login/Register" href="http://localhost/webapplication1/Login.html">
            <FontAwesomeIcon icon={faUserPlus} /> Login/Register
        </Button>
    );

}

export default loginRegister;