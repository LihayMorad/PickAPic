import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import Exif from 'exif-js';
import './Upload.css';

////upload is no longer state-less its a class now
class Upload extends Component {

    state = {
        isExif: false, ////if exif data exists in the picture
        xCord: null,
        yCord: null,
        uploaded: false ////states if the picture was even uploaded to trigger the redirection
    }

    //// handler which activates when a picture is uploaded
    uploadedImageHandler = (event) => {
        console.log("Upload [uploadedImageHandler]");
         event.preventDefault();
        let file = event.target.files[0];

        ////exif function that extracts gps
        if (file.type === "image/jpeg") {
            Exif.getData(file, () => {
                var lat = Exif.getTag(file, 'GPSLatitude');
                var lng = Exif.getTag(file, 'GPSLongitude');

                if (lat !== undefined && lng !== undefined) {
                    this.updateLatLng(lat, lng);
                };
            });
            this.setState({
                uploaded: true
            });
        }
    }

    componentDidMount() {
        console.log('Upload [componentDidMount]');
    }

    componentDidUpdate() {
        console.log('Upload [componentDidUpdate]', this.state);
    }

    ////updating the state with new lat lang values, checking if exif data inn the picture exists and noting that a oicture was uploaded
    updateLatLng = (Lat, Lng) => {

        const latFormatted = this.convertToNum(Lat);
        const lngFormatted = this.convertToNum(Lng);
        this.setState({ xCord: latFormatted, yCord: lngFormatted, isExif: true });

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
               { this.state.uploaded ? (<Redirect push to="/details" />) : null}
            </div>
        );

    }
}

export default Upload;