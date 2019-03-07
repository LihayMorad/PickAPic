import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Exif from 'exif-js';
import Dropzone from 'react-dropzone';

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
    handleImageUpload = (file) => {
        // console.log('event: ', file[0]);

        if (file[0]) {
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
                    .then(response => { // logged in
                        // console.log("[CheckAccessToken] response.data - username: ", response.data);

                        if (file[0].type === "image/jpeg") { ////exif library that extracts gps data
                            Exif.getData(file[0], () => {

                                const lat = Exif.getTag(file[0], 'GPSLatitude');
                                const lng = Exif.getTag(file[0], 'GPSLongitude');
                                if (lat !== undefined && lng !== undefined) {
                                    const latFormatted = this.convertToNum(lat);
                                    const lngFormatted = this.convertToNum(lng);
                                    this.setState({
                                        isExif: true,
                                        xCord: latFormatted,
                                        yCord: lngFormatted
                                    });
                                } else {
                                    this.setState({
                                        isExif: false,
                                    });
                                }
                            });
                            this.setState({
                                uploaded: true,
                                file: file[0]
                            });
                        } else // file.type != JPG/JPEG
                            alert("Only 'JPG/JPEG' files are allowed to upload!");
                    })
                    .catch(error => {
                        alert("You have to be logged in to upload photos");
                    });
            } else { // no local storage token
                alert("You have to be logged in to upload photos");
            }
        } else { // no file
            alert("No file has been chosen, please try again.")
        }
    }

    ////function that converts the lat long arrays into single double values
    convertToNum = (number) => {
        return (number[0].numerator + number[1].numerator /
            (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator));
    };

    render() {
        return (
            <div>
                <Dropzone
                    multiple={false}
                    onDrop={this.handleImageUpload}
                    accept="image/*">
                    {({ getRootProps, getInputProps }) => (
                        <label
                            {...getRootProps()} className={"btn, btnDanger"} htmlFor="my-file-selector"
                            id="uploadButton" title="Upload a picture">

                            <Input {...getInputProps()} id="my-file-selector" type="file" accept="image/jpeg"
                                onChange={(event) => {
                                    // event.persist();
                                    this.handleImageUpload(event.target.files);
                                }} ></Input>
                            <FontAwesomeIcon icon={faCloudUploadAlt} /> Upload
                </label>
                    )}
                </Dropzone>
                {
                    this.state.uploaded ? <Redirect to={{ // was Redirect *push* to...
                        pathname: '/details',
                        state: {
                            isexif: this.state.isExif,
                            xcord: this.state.xCord,
                            ycord: this.state.yCord,
                            image: this.state.file
                        }
                    }} /> : null
                }
            </div >
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