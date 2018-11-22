import React, { Component } from 'react';

import './Layout.css';

import Toolbar from '../../components/Toolbar/Toolbar';

class Layout extends Component {

    // state = {
    //     name: "or"
    // }

    render() {
        return (
            <div>
                <Toolbar/>

                {/* <Pages /> */}
            </div>
        );
    }

}

export default Layout;