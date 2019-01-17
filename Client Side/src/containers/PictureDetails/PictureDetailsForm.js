import React, { Component } from 'react';
import { post } from 'axios';

class pictureDetailsForm extends Component {

    state = {
        filter: "Other",
        description: ""
    }

    componentDidUpdate() { console.log('this.state: ', this.state); }

    handleDescription = (event) => { this.setState({ description: event.target.value }) }

    handleChange = (event) => { this.setState({ filter: event.target.value }) }

    fileUpload = () => {

        console.log(this.props.location.state.image);

        const url = 'http://localhost/webapplication1/Upload';
        const formData = new FormData();
        formData.append('file', this.props.location.state.image);
        formData.append('exifData', this.props.location.state.isexif);
        formData.append('xCord', this.props.location.state.xcord);
        formData.append('ycord', this.props.location.state.ycord);
        formData.append('filterData', this.state.filter);
        formData.append('description', this.state.description);
        const config = { headers: { 'content-type': 'multipart/form-data' } }

        return post(url, formData, config)
    }


    render() {

        return (
            <div>
                <h1>Description Page</h1>
                <p>Description</p>
                <input type="text" id="photoDescription" name="" placeholder="Enter photo description" onChange={this.handleDescription} />

                <div id="filtersOptionsDiv">Choose photo filter:</div>
                <select id="filtersOptions" name="filtersOptions" defaultValue={"Other"} onChange={this.handleChange}>
                    <option value="Panorama">Panorama</option>
                    <option value="Sunrise">Sunrise</option>
                    <option value="Sea">Sea</option>
                    <option value="River">River</option>
                    <option value="Grass">Grass</option>
                    <option value="Flowers">Flowers</option>
                    <option value="Other">Other</option>
                </select>

                <button onClick={this.fileUpload}>Upload </button>
            </div>
        );
    }
}

export default pictureDetailsForm;