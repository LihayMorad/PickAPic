import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Toolbar from '../../components/Toolbar/Toolbar';
import MapContainer from '../GoogleMap/MapContainer';
import Details from '../../containers/PictureDetails/PictureDetailsForm';

import './Layout.css';

class Layout extends Component {

    render() {

        return (
            <div>
                <Route component={Toolbar} />

                <Switch>
                    <Route exact path="/" component={MapContainer} />
                    <Route path="/details" component={Details} />
                </Switch>
            </div>
        );

    }

}

export default Layout;