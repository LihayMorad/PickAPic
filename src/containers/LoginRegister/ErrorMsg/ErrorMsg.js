import React from 'react';
import './ErrorMsg.css';

const ErrorMsg = (props) => {

    return (<p className='ErrorMsg'>{props.errormsg}</p>);

};

export default ErrorMsg;