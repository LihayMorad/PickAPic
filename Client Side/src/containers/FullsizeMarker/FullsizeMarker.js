import React, { PureComponent } from 'react';

import axios from 'axios';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import './FullsizeMarker.css';


class FullsizeMarker extends PureComponent {

    // componentDidMount() {
    //     console.log('[FullsizeMarker] componentDidMount');
    // }

    state = {
        photoURL: "",
        username: "",
        description: "",
        uploaddate: "",
        filter: ""
    }

    componentDidUpdate() {
        console.log('[FullsizeMarker] componentDidUpdate');
        // console.log('[FullsizeMarker] this.props.activeMarker', this.props.activeMarker.markerId);

    }

    getPhotoDetails = () => {
        const imgID = this.props.activeMarker.markerId;
        axios('http://localhost/webapplication1/api/photodetails/' + imgID)
            .then((response) => {
                // console.table(response.data[0]);
                if (response.data[0]) { this.handleData(response.data[0]) }
            });
    }

    handleData = (photoData) => {
        const photodetails = {
            photoURL: "http://localhost/webapplication1/api/image/" + this.props.activeMarker.markerId,
            username: photoData.username,
            description: photoData.description,
            uploaddate: photoData.uploaddate,
            filter: photoData.filter,
        };
        this.setState({ ...photodetails });
    }

    render() {
        console.log('[FullsizeMarker] render');

        this.getPhotoDetails();

        return (
                <Modal

                    isOpen={this.props.isOpen}
                    toggle={this.props.toggleModal}
                    centered>

                    <ModalHeader>
                        {this.state.description}
                        <Button size="sm" className={"modalHeaderCloseBtn"} color="secondary" onClick={this.props.toggleModal}>X</Button>
                    </ModalHeader>

                    <ModalBody>
                        <img className={"img-fluid modalBodyImg"} src={this.state.photoURL} alt="full screen photo"></img>
                    </ModalBody>

                    <ModalFooter>
                        <div className={"ModalFooterDetailsRow"}>
                            <div className={"detailElem"}><strong>Uploaded by: </strong>{this.state.username}</div>
                            <div className={"detailElem"}><strong>Uploaded at: </strong>{this.state.uploaddate}</div>
                            <div className={"detailElem"}><strong>Filter: </strong>{this.state.filter}</div>

                            <div className={"modalFooterCloseBtn"}>
                                <Button color="secondary" onClick={this.props.toggleModal}>Close</Button>
                            </div>
                        </div>
                    </ModalFooter>

                </Modal>
        );
    }

}

export default FullsizeMarker;