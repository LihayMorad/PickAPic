import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Button } from 'reactstrap';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

import { post } from 'axios';

import './PictureDetailsForm.css';

const mapStyle = {
    position: 'absolute',
    width: '100%',
}

const mapContainerStyle = {
    width: '100%',
    height: '40%'
}

class pictureDetailsForm extends Component {

    state = {
        filter: "Other", // default
        description: "",
        redirect: false
    }

    handleDescriptionChange = event => { this.setState({ description: event.target.value }); }

    handleFilterChange = event => { this.setState({ filter: event.target.value }); }

    handleFileUpload = () => {
        // console.log('pictureDetailsForm -> fileUpload ->  this.props.location.state', this.props.location.state);

        const url = 'http://localhost/webapplication1/Upload';
        const formData = new FormData();
        formData.append('file', this.props.location.state.image);
        formData.append('exifData', this.props.location.state.isexif);
        if (this.props.location.state.isexif) { // image have GPS data
            this.setState({
                photoLocation: {
                    lat: this.props.location.state.xcord,
                    lng: this.props.location.state.ycord
                }
            });
            formData.append('xCord', this.props.location.state.xcord); //lat
            formData.append('yCord', this.props.location.state.ycord); //lng
        }
        else { // image doesn't have GPS data
            if (this.state.photoLocation) {
                formData.append('xCord', this.state.photoLocation.lat); //lat
                formData.append('yCord', this.state.photoLocation.lng); //lng
            }
            else {
                alert("Photo's GPS location wasn't provided, please click on the map where the photo was taken.");
                return;
            }
        }
        formData.append('filterData', this.state.filter);
        formData.append('description', this.state.description);
        formData.append('accessToken', localStorage.getItem("access-token"));

        const config = { headers: { 'content-type': 'multipart/form-data' } };

        // for (let pair of formData.entries()) {
        //     console.log(pair[0] + ': ' + pair[1]);
        // }

        post(url, formData, config)
            .then(res => {
                this.setState({ redirect: true }, () => alert("Upload successfully"));
            })
            .catch(error => { alert(error.request.responseText); });
    }

    onMapClicked = (mapProps, map, clickEvent) => {
        // console.log('pictureDetailsForm -> onMapClicked -> mapProps', mapProps);
        // console.log('pictureDetailsForm -> onMapClicked -> map', map);
        const photoLocation = {
            lat: clickEvent.latLng.lat(),
            lng: clickEvent.latLng.lng()
        }
        // console.log('pictureDetailsForm -> onMapClicked -> photoLocation', photoLocation);
        this.setState({ photoLocation }, () => {
            // console.log(this.state); 
        });
    }

    render() {
        // console.log("pictureDetailsForm -> render -> isexif:", this.props.location.state);

        let googleMap = "";
        let marker = "";
        let redirectToMap = "";

        if (!this.props.location.state.isexif) {
            if (this.state.photoLocation) { // if user choose location on the map
                marker = <Marker
                    name={'Photo location'}
                    onClick={this.onMarkerClick}
                    position={this.state.photoLocation} />;
            }
            googleMap = <Map
                google={this.props.google}
                style={mapStyle}
                containerStyle={mapContainerStyle}
                initialCenter={{ lat: 32.109333, lng: 34.855499 }} // Tel Aviv, Israel
                zoom={3}
                onReady={this.onMapReady}
                onClick={this.onMapClicked} >
                {marker}
            </Map>;
        }
        if (this.state.redirect) {
            // console.log("this.state.redirect");
            redirectToMap = <Redirect to={{ // was: Redirect *push* to...
                pathname: '/',
                state: { photoLocation: this.state.photoLocation }
            }} />;
        }

        return (
            <div className="detailsPage">
                <h1>Description Page</h1>

                <div className="detailsDiv">

                    {this.props.location.state.image && <img className={"imgPreview"} alt={"preview"}
                        src={URL.createObjectURL(this.props.location.state.image)}></img>}

                    <label htmlFor="photoDescription" className="detailsLabel">Enter photo description:</label>
                    <input type="text" id="photoDescription" name="Description" className="descriptionInput"
                        placeholder="Enter photo description" onChange={this.handleDescriptionChange} />

                    <label htmlFor="filtersOptions" className="detailsLabel">Choose photo filter:</label>
                    <select id="filtersOptions" name="filtersOptions" className="filtersInput"
                        defaultValue="Other" onChange={this.handleFilterChange}>
                        <option value="Panorama">Panorama</option>
                        <option value="Sunrise">Sunrise</option>
                        <option value="Sea">Sea</option>
                        <option value="River">River</option>
                        <option value="Grass">Grass</option>
                        <option value="Flowers">Flowers</option>
                        <option value="Other">Other</option>
                    </select>

                    <Button color="primary" value="Upload" className="uploadBtn"
                        onClick={this.handleFileUpload}>Upload </Button>
                </div>

                {googleMap}

                {redirectToMap}

            </div>
        );
    }
}

export default (GoogleApiWrapper({ apiKey: "AIzaSyBimObDCzrKYyVo9t9K1vZEqT7BmIvOCis" })(pictureDetailsForm));

pictureDetailsForm.propTypes = {

}

Map.propTypes = {
    google: PropTypes.object,
    initialCenter: PropTypes.object,
    zoom: PropTypes.number,
    onReady: PropTypes.func,
    onClick: PropTypes.func,
    style: PropTypes.object,
    containerStyle: PropTypes.object
}

Marker.propTypes = {
    onClick: PropTypes.func,
    position: PropTypes.object
}

Button.propTypes = {
    onClick: PropTypes.func
}