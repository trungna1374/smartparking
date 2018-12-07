import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import { guestnav, usernav, officernav, securitynav, adminnav } from '../../_nav';

// routes config
import { guest, admin, user, officer, security } from '../../routes';
import DefaultAside from './DefaultAside';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';
import axios from 'axios';

class DefaultLayout extends Component {

  state = {
    fullname: "",
    username: "",
    role: "",
    routes: guest,
    nav: guestnav
  }

  componentDidMount() {
    axios
      .get("/login/check").then(res => {
        if (res.data.user) {
          this.setState({
            username: res.data.user.username,
            role: res.data.user.role,
            fullname: res.data.user.fullname

          })
          if (res.data.user.role === "user")
            this.setState({
              routes: user,
              nav: usernav
            })
          if (res.data.user.role === "officer")
            this.setState({
              routes: officer,
              nav: officernav
            })
          if (res.data.user.role === "security")
            this.setState({
              routes: security,
              nav: securitynav
            })
          if (res.data.user.role === "admin")
            this.setState({
              routes: admin,
              nav: adminnav
            })
        }
      })
  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <DefaultHeader username={this.state} />
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <AppSidebarNav navConfig={this.state.nav} {...this.props} />
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={this.state.routes} />
            <Container fluid>
              <Switch>
                {this.state.routes.map((route, idx) => {
                  return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                    <route.component {...props} />
                  )} />)
                    : (null);
                },
                )}
                <Redirect from="/" to="/map" />
              </Switch>
            </Container>
          </main>
          <AppAside fixed hidden>
            <DefaultAside />
          </AppAside>
        </div>
        <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
