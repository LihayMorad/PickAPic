import React from 'react';

import { NavbarBrand } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
// import { Link } from 'react-router-dom';

const logo = (props) => {

    return (
        // <Link to="/" style={{ color: 'white', cursor: 'pointer' }}> 
        <NavbarBrand href='/'>
            <FontAwesomeIcon
                style={{ fontSize: '30px' }}
                icon={faImages}
            /> PickAPic
        </NavbarBrand>
        // </Link> 

    );

}

export default logo;