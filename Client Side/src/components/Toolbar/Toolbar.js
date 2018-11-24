import React, { Component } from 'react';

import './Toolbar.css';

import Logo from './Logo/Logo';
import SearchInput from './SearchInput/SearchInput';
import Upload from './Upload/Upload';
import Filters from './Filters/Filters';
import RadiusSlider from './RadiusSlider/RadiusSlider';
import LoginRegister from './LoginRegister/LoginRegister';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from 'reactstrap';

class Toolbar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <div>

                <Navbar color="dark" dark expand="xl" id="navbarMain">

                    {/* LOGO */} {/* SHOULD BE RENDRED ON ALL PAGES */}
                    <Logo />

                    <NavbarToggler onClick={this.toggle} />

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
                            <LoginRegister />
                        </NavItem>

                    </Collapse>

                </Navbar>

            </div>

        );
    }
}

export default Toolbar;