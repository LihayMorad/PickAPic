import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Exif from 'exif-js';

import './Upload.css';

class Upload extends Component {

    state = {
        isExif: true, ////if exif data exists in the picture
        xCord: null,
        yCord: null,
        uploaded: false, ////states if the picture was even uploaded to trigger the redirection
        file: null
    }

    //// handler which activates when a picture is uploaded
    uploadedImageHandler = (event) => {
        event.persist();
        // event.preventDefault();

        if (event.target.files[0]) {
            const localStorageAccessToken = localStorage.getItem("access-token");
            if (localStorageAccessToken) {
                const accessToken = new URLSearchParams();
                accessToken.append('accessToken', localStorageAccessToken);

                axios({
                    method: 'POST',
                    url: 'http://localhost/webapplication1/CheckAccessToken',
                    headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    data: accessToken
                })
                    .then(response => {
                        // console.log("[CheckAccessToken] response.data - username: ", response.data);

                        let file = event.target.files[0];

                        ////exif function that extracts gps
                        if (file.type === "image/jpeg") {
                            Exif.getData(file, () => {
                                const lat = Exif.getTag(file, 'GPSLatitude');
                                const lng = Exif.getTag(file, 'GPSLongitude');

                                if (lat !== undefined && lng !== undefined)
                                    this.updateLatLng(lat, lng);
                                else
                                    this.setState({ isExif: false });
                            });
                            this.setState({
                                uploaded: true,
                                file: event.target.files[0]
                            });
                        }
                        else // file.type != JPG/JPEG
                            alert("Only 'JPG/JPEG' files are allowed to upload!");

                    })
                    .catch(error => {
                        alert("You have to be logged in to upload photos");
                    });
            }
            else { // no local storage token
                alert("You have to be logged in to upload photos");
            }
        }
    }

    componentDidUpdate() {
        // console.log('[Upload] componentDidUpdate', this.state);
    }

    ////updating the state with new lat lang values, checking if exif data inn the picture exists and noting that a oicture was uploaded
    updateLatLng = (Lat, Lng) => {
        const latFormatted = this.convertToNum(Lat);
        const lngFormatted = this.convertToNum(Lng);
        this.setState({
            xCord: latFormatted,
            yCord: lngFormatted,
            isExif: true
        });
    }

    ////function that converts the lat long arrays into single double values
    convertToNum = (number) => {
        return (number[0].numerator + number[1].numerator /
            (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator));
    };

    render() {
        return (
            <div>
                <label className={"btn, btnDanger"} htmlFor="my-file-selector"
                    id="uploadButton" title="Upload a picture">
                    <Input id="my-file-selector" type="file" accept="image/jpeg"
                        onChange={this.uploadedImageHandler} />
                    <FontAwesomeIcon icon={faCloudUploadAlt} /> Upload
                </label>
                {this.state.uploaded ? <Redirect to={{ // was Redirect *push* to...
                    pathname: '/details',
                    state: {
                        isexif: this.state.isExif,
                        xcord: this.state.xCord,
                        ycord: this.state.yCord,
                        image: this.state.file
                    }
                }} /> : null}
            </div>
        );
    }
}

export default Upload;

Input.propTypes = {
    Input: PropTypes.func
}

Redirect.propTypes = {
    state: PropTypes.object
}