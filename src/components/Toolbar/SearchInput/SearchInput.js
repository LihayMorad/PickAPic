import React from 'react';

import { Input } from 'reactstrap';

import './SearchInput.css';

const searchInput = (props) => {

    return (
        <Input
            className={"searchInputAutoComplete"} type="search"
            name="email" placeholder="Enter a place to search"
            aria-label="Search" id="searchInputAutoComplete" />
    );

}

export default searchInput;