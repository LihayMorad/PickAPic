import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actionTypes from '../../../store/actions';

import Filter from './Filter/Filter';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import './Filters.css';

const AllFiltersFilter = { id: "AllFiltersID", name: "AllFilters", value: "AllFilters", label: "All Filters" };
let filters = [
    { id: "PanoramaFilterID", name: "PanoramaFilter", value: "Panorama", label: "Panorama" },
    { id: "SunriseFilterID", name: "SunriseFilter", value: "Sunrise", label: "Sunrise" },
    { id: "SeaFilterID", name: "SeaFilter", value: "Sea", label: "Sea" },
    { id: "RiverFilterID", name: "RiverFilter", value: "River", label: "River" },
    { id: "GrassID", name: "GrassFilter", value: "Grass", label: "Grass" },
    { id: "FlowersFilterID", name: "FlowersFilter", value: "Flowers", label: "Flowers" },
    { id: "OtherFilterID", name: "OtherFilter", value: "Other", label: "Other" }
];

class Filters extends Component {

    state = {
        dropdownOpen: false,
    };

    toggle = () => { this.setState({ dropdownOpen: !this.state.dropdownOpen }); }

    handleFilterChange = filter => { this.props.onFiltersChange(filter.value, filter.checked); }

    render() {

        return (
            <div>

                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle outline color="info" caret id="searchCategoriesButton">
                        <FontAwesomeIcon icon={faFilter} />Categories
                    </DropdownToggle>

                    <DropdownMenu id="filtersDropdown">
                        <DropdownItem header>Choose Map Filters</DropdownItem>
                        <Filter {...AllFiltersFilter} checked={this.props.filtersArray[AllFiltersFilter.value]} onClick={e => { this.handleFilterChange(e.target) }} />
                        <DropdownItem divider />
                        {filters.map((filter) => <Filter key={filter.id} {...filter}
                            checked={this.props.filtersArray[filter.value]}
                            onClick={e => { this.handleFilterChange(e.target); }} />)}
                    </DropdownMenu>
                </ButtonDropdown>

            </div >
        );
    }

}

const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = dispatch => {
    return {
        onFiltersChange: (filterName, isChecked) => dispatch({ type: actionTypes.CHANGE_FILTERS, filterName: filterName, isChecked: isChecked })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);

Filters.propTypes = {
    onFiltersChange: PropTypes.func,
    filtersArray: PropTypes.object,
}

Filter.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    label: PropTypes.string,
    checked: PropTypes.bool,
    onClick: PropTypes.func
}

ButtonDropdown.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func
}