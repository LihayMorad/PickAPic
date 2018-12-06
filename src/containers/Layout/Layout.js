import React, { Component } from 'react';
// import { Route, Switch } from 'react-router-dom';

// import './Layout.css';

import Toolbar from '../../components/Toolbar/Toolbar';
import MapContainer from '../GoogleMap/MapContainer';

class Layout extends Component {

    render() {

        return (
            <div>
                <Toolbar />
                <MapContainer />


                {/* <Switch> */}
                    {/* <Route exact path="/" component={MapContainer} /> */}
                    {/* <Route path="/photoupload" component={Photoupload} /> */}
                {/* </Switch> */}

                {/* <Pages /> */}
            </div>
        );
        
    }

}

export default Layout;