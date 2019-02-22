import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './Layout.css';
import Toolbar from '../../components/Toolbar/Toolbar';
import MapContainer from '../GoogleMap/MapContainer';
import Details from '../../containers/PictureDetails/PictureDetailsForm';

class Layout extends Component {
    ////routing is currently done only in layout as it should

    render() {

        return (
            <div>
                <Toolbar />

                <Switch>
                    <Route exact path="/" component={MapContainer} />
                    <Route path="/details" component={Details} />
                </Switch>
            </div>
        );

    }

}

export default Layout;