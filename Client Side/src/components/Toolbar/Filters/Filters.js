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

class Filters extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false
        };
    }

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {

        const AllFilters = { id: "AllFiltersID", name: "AllFilters", value: "AllFilters", label: "All Filters" };
        const filters = [
            { id: "PanoramaFilterID", name: "PanoramaFilter", value: "Panorama", label: "Panorama" },
            { id: "SunriseFilterID", name: "SunriseFilter", value: "Sunrise", label: "Sunrise" },
            { id: "SeaFilterID", name: "SeaFilter", value: "Sea", label: "Sea" },
            { id: "RiverFilterID", name: "RiverFilter", value: "River", label: "River" },
            { id: "FlowersFilterID", name: "FlowersFilter", value: "Flowers", label: "Flowers" },
            { id: "OtherFilterID", name: "OtherFilter", value: "Other", label: "Other" }
        ].map((filter) => <Filter key={filter.id} {...filter} />);

        return (
            <div>

                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle outline color="info" caret id="searchCategoriesButton">
                        <FontAwesomeIcon icon={faFilter} /> Categories</DropdownToggle>

                    <DropdownMenu id="filtersDropdown">
                        <DropdownItem header>Choose Map Filters</DropdownItem>
                        <Filter {...AllFilters} />
                        <DropdownItem divider />
                        {filters}
                    </DropdownMenu>
                </ButtonDropdown>

            </div >
        );

    }

}

export default Filters;