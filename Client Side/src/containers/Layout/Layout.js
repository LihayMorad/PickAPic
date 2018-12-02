import React, { Component } from 'react';

import './Layout.css';

import Toolbar from '../../components/Toolbar/Toolbar';
import MapContainer from '../GoogleMap/MapContainer';

class Layout extends Component {

    render() {
        return (
            <div>
                <Toolbar />
                <MapContainer /> 
                {/* <Pages /> */}
            </div>
        );
    }

}

export default Layout;