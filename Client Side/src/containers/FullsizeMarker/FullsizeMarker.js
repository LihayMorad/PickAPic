import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import './FullsizeMarker.css';

class FullsizeMarker extends PureComponent {

    state = {
        photoURL: "",
        username: "",
        description: "",
        uploaddate: "",
        filter: ""
    }

    getPhotoDetails = () => {
        const imgID = this.props.activeMarker.markerId;
        axios('http://localhost/webapplication1/api/photodetails/' + imgID)
            .then((response) => {
                if (response.data[0]) { this.handleData(response.data[0]) }
            });
    }

    handleData = (photoData) => {
        const photodetails = {
            photoURL: "http://localhost/webapplication1/api/image/" + this.props.activeMarker.markerId,
            username: photoData.username,
            description: photoData.description,
            uploaddate: photoData.uploaddate,
            filter: this.props.activeMarker.filter,
            manualGPS: photoData.manualgps
        };
        this.setState({ ...photodetails });
    }

    handleDeletePhoto = () => {
        const mapParams = {};

        const accessToken = localStorage.getItem("access-token");
        mapParams.accessToken = accessToken;
        mapParams.imgID = this.props.activeMarker.markerId;

        if (accessToken) { // user is logged in
            axios('http://localhost/webapplication1/api/deletePhotoById/', { params: mapParams })
                .then(response => {
                    if (response.status === 200) {
                        alert("Photo has been deleted successfully");
                        this.props.toggleModal();
                        this.props.toggleIdle();
                    }
                })
                .catch(error => {
                    alert("The was a problem with deleting the photo. Photo deletion available only for its owner!");
                });
        }
        else { // user isn't logged in
            alert("You must be logged in to delete a photo!");
        }
    }

    render() {

        if (this.props.isOpen)
            this.getPhotoDetails();

        return (

            <Modal className={"modal-fullscreen"}
                isOpen={this.props.isOpen}
                toggle={this.props.toggleModal}
                centered>

                <ModalHeader
                    style={{ border: 'none' }}
                    toggle={this.props.toggleModal}>
                    {this.state.description}
                </ModalHeader>

                <ModalBody>
                    <img id={"modalIMG"} className={"img-fluid"} src={this.state.photoURL} alt="full screen"></img>
                </ModalBody>

                <ModalFooter style={{ border: 'none' }}>
                    <div id={"ModalFooterDetailsRow"}>
                        <div className={"detailElem"}><strong>Uploaded by: </strong>{this.state.username}</div>
                        <div className={"detailElem"}><strong>Uploaded at: </strong>{this.state.uploaddate}</div>
                        <div className={"detailElem"}><strong>Filter: </strong>{this.state.filter}</div>
                        <div className={"detailElem"}><strong>ManualGPS: </strong>{this.state.manualGPS ? "Yes" : "No"}</div>

                        <Button className={"modalFooterCloseBtn"}
                            color="danger"
                            title="Delete this photo"
                            onClick={() => {
                                if (window.confirm("Are you sure you want to delete this photo permanently?"))
                                    this.handleDeletePhoto();
                            }}><FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </div>
                </ModalFooter>

            </Modal>
        );
    }

}

export default FullsizeMarker;

FullsizeMarker.propTypes = {
    FullsizeMarker: PropTypes.object,
    isOpen: PropTypes.bool,
    toggleModal: PropTypes.func
}