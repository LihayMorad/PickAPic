import React from 'react';

import { NavbarBrand } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';

const logo = (props) => {

    return (
        <NavbarBrand href='/'>
            <FontAwesomeIcon
                style={{ fontSize: '30px' }}
                icon={faImages}
            /> PickAPic
        </NavbarBrand>
    );

}

export default logo;