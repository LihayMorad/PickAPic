import React from 'react';

import { Input } from 'reactstrap';

import './SearchInput.css';

const searchInput = (props) => {

    return (
        <Input
            className={"searchInputAutoComplete"} type="search"
            name="email" placeholder="Search a place"
            aria-label="Search" id="searchInputAutoComplete" />
    );

}

export default searchInput;