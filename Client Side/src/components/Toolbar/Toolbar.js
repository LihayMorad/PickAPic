import React, { Component } from 'react';
import axios from 'axios';
import Logo from './Logo/Logo';
import SearchInput from './SearchInput/SearchInput';
import Upload from './Upload/Upload';
import Filters from './Filters/Filters';
import RadiusSlider from './RadiusSlider/RadiusSlider';
import LoginRegister from './LoginRegister/LoginRegister';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from 'reactstrap';

import './Toolbar.css';

class Toolbar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            isLoggedIn: false
        };
    }

    toggleMobileToolbar = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    componentDidMount() {

        // axios({
        //     method: 'GET',
        //     url: 'http://localhost/webapplication1/hasCookie',

        // })
        //     .then((response) => {
        //         console.log(response);
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     })
            
        // this.setState({
        //     // isLoggedIn: 
        // });

    }

    render() {
        // console.log("[Toolbar state]", this.state);
        return (
            <div>

                <Navbar color="dark" dark expand="xl" id="navbarMain">

                    {/* LOGO */} {/* SHOULD BE RENDRED ON ALL PAGES */}
                    <Logo />

                    <NavbarToggler onClick={this.toggleMobileToolbar} />

                    <Collapse isOpen={this.state.isOpen} navbar>

                        <Nav navbar className="mr-auto" >


                            {/* Search Location Input */}
                            <NavItem>
                                <SearchInput />
                            </NavItem>


                            {/* Categories (Filters) Button */}
                            <NavItem className="navBtn">
                                <Filters />
                            </NavItem>


                            {/* Search by radius */}
                            <NavItem className="navBtn">
                                <RadiusSlider />
                            </NavItem>


                            {/* Upload Picture Button  */}
                            <NavItem className="navBtn">
                                <Upload />
                            </NavItem>

                        </Nav>

                        {/* Login/Register Button  */} {/* SHOULD BE RENDRED ON ALL PAGES */}
                        <NavItem className="navBtn">
                            <LoginRegister loggedIn={this.state.isLoggedIn} />
                        </NavItem>

                    </Collapse>

                </Navbar>

            </div>

        );
    }
}

export default Toolbar;