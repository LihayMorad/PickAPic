import React from 'react';

import { CustomInput, Label } from 'reactstrap';

import './Filter.css';

const filter = (props) => {

    return (
        <Label className={"dropdown-item filtersDropdownLabel"}>
            <CustomInput type="checkbox" defaultChecked
                id={props.id} name={props.name}
                value={props.value} label={props.label} />
        </Label>
    );

}

export default filter;