import React from 'react';

import { Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

import './Upload.css';

const upload = (props) => {

    return (
        <label className={"btn, btnDanger"} htmlFor="my-file-selector"
            id="uploadButton" title="Login to upload a picture">
            <Input id="my-file-selector" type="file" accept="image/*"></Input>
            <FontAwesomeIcon icon={faCloudUploadAlt} /> Upload
        </label>
    );

}

export default upload;