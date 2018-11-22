import React, { Component } from 'react';

import Filter from './Filter/Filter';
import {
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import './Filters.css';

const filters =
{
    AllFilters: {
        id: "AllFiltersID", name: "AllFilters",
        value: "AllFilters", label: "All Filters"
    },
    Panorama: {
        id: "PanoramaFilterID", name: "PanoramaFilter",
        value: "Panorama", label: "Panorama"
    },
    Sunrise: {
        id: "SunriseFilterID", name: "SunriseFilter",
        value: "Sunrise", label: "Sunrise"
    },
    Sea: {
        id: "SeaFilterID", name: "SeaFilter",
        value: "Sea", label: "Sea"
    },
    River: {
        id: "RiverFilterID", name: "RiverFilter",
        value: "River", label: "River"
    },
    Flowers: {
        id: "FlowersFilterID", name: "FlowersFilter",
        value: "Flowers", label: "Flowers"
    },
    Other: {
        id: "OtherFilterID", name: "OtherFilter",
        value: "Other", label: "Other"
    }
};



class Filters extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false
        };
    }

    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    render() {

        return (
            <div style={{ textAlign: "left" }}>

                <ButtonDropdown isOpen={this.state.dropdownOpen}
                    toggle={this.toggle}>
                    <DropdownToggle outline color="info" caret id="searchCategoriesButton">
                        <FontAwesomeIcon icon={faFilter} /> Categories</DropdownToggle>

                    <DropdownMenu id="filtersDropdown">
                        <DropdownItem header>Choose Map Filters</DropdownItem>
                        <Filter {...filters.AllFilters} />
                        <DropdownItem divider />
                        <Filter {...filters.Panorama} />
                        <Filter {...filters.Sunrise} />
                        <Filter {...filters.Sea} />
                        <Filter {...filters.River} />
                        <Filter {...filters.Flowers} />
                        <Filter {...filters.Other} />
                    </DropdownMenu>

                </ButtonDropdown>
            </div>
        );

    }


}

export default Filters;