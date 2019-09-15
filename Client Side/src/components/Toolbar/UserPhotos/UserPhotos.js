import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as actionTypes from '../../../store/actions';

import Toggle from 'react-toggle'; // https://github.com/aaronshaf/react-toggle
import { Label } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';

import './UserPhotos.css';

class UserPhotos extends Component {

    handleUserPhotos = (target) => {
        this.props.onUserPhotosChange(target.checked);
    }

    render() {

        return (
            this.props.loggedInUser && <div className={"navBtn"} title="Show only photos uploaded by me">
                <Label id={"userPhotosLabel"}>
                    <FontAwesomeIcon icon={faUserCheck} style={{ margin: "auto 5px" }} />
                    <Toggle
                        id="userPhotosToggle"
                        name="userPhotos"
                        value="userPhotos"
                        checked={this.props.showOnlyCurrentUserPhotos}
                        aria-label="show only my photos"
                        onChange={(e) => { this.handleUserPhotos(e.target); }} />
                </Label>
            </div>
        );
    }

}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
    return {
        onUserPhotosChange: (ischecked) => dispatch({ type: actionTypes.CHANGE_PHOTOS_TO_SHOW, isChecked: ischecked })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPhotos);

UserPhotos.propTypes = {
    showOnlyCurrentUserPhotos: PropTypes.bool,
    onUserPhotosChange: PropTypes.func
}

Toggle.propTypes = {
    onChange: PropTypes.func
}