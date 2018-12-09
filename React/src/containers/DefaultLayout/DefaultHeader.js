import React, { Component } from 'react';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';
import axios from 'axios'

import {  AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  state = {
    username: "",
    fullname: ""
  }

  _handleLogOut = () => {
    axios
      .get("/logout").then(res => {
        console.log(res.data)
      })
      .catch(err => console.log(err))
  }


  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    const display1 = this.props.username.username ? (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: 'smartparkingfull.png', width: 100, height: 30, alt: 'Smart Parking' }}
          minimized={{ src: 'smartparking.png', width: 30, height: 30, alt: 'S' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink href="/">Dashboard</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href={this.props.username.role==="user"?"#/updateprofileUser/"+this.props.username.username:"#/userregister"}>Users</NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          {/* <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-location-pin"></i></NavLink>
          </NavItem> */}
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <div className="name-header">
                <h5>Hello, {this.props.username.fullname}</h5>
              </div>
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem href={this.props.username.role==="user"?"#/updateprofileUser/"+this.props.username.username:"#/updateprofileStaff/"+this.props.username.username}><i className="fa fa-bell-o"></i> Updates Profile<Badge color="info"></Badge></DropdownItem>
              <DropdownItem href="#/updatepassword"><i className="fa fa-bell-o"></i> Change Password<Badge color="info"></Badge></DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={this._handleLogOut} href='/'><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>

        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    ) : (
        <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: 'smartparkingfull.png', width: 100, height: 30, alt: 'Smart Parking' }}
          minimized={{ src: 'smartparking.png', width: 30, height: 30, alt: 'S' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink href="/">Dashboard</NavLink>
          </NavItem>
        </Nav>

          <Nav className="ml-auto" navbar>
          <NavItem className="px-3">
            <NavLink href="#/login">Sign in</NavLink>
          </NavItem>

        </Nav>


        </React.Fragment>

      );

    return <div className="app-header navbar row">
      {display1}
    </div>
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
