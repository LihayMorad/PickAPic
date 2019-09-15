import React from 'react';
import PropTypes from 'prop-types';

import Toggle from 'react-toggle'; // https://github.com/aaronshaf/react-toggle
import { Label } from 'reactstrap';

import './Filter.css';
import 'react-toggle/style.css';

const filter = (props) => {

    return (
        <Label className={"dropdown-item filtersDropdownLabel"}>
            <Toggle
                {...props}
                aria-label={props.label}
            />
            <span>{props.label}</span>
        </Label>
    );

}

export default filter;

filter.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    label: PropTypes.string,
    checked: PropTypes.bool,
    onClick: PropTypes.func
}