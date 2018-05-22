import 'babel-polyfill';

import './App.css';

import React from 'react';
import {Router, Link, Route} from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

import About from './About';
import Home from './Home';
import Resources from './Resources';
import overdrive from '../images/overdrive.png';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <Router history={this.props.history}>
        <div className="App">
          {/* Top Bar */}
          <Navbar dark expand="sm">
            <NavbarBrand tag={Link} to="/">
              <h3>Houston Book Link</h3>
            </NavbarBrand>
            <NavbarToggler right="true" onClick={this.toggle}/>
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink tag={Link} to="/about">About</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/resources">Resources</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>

          {/* Body */}
          <div className="main-container">
            <Route exact path="/" component={Home}/>
            <Route path="/about" component={About}/>
            <Route path="/resources" component={Resources}/>
          </div>

          {/* Footer */}
          <footer className="footer">
            <div className="footer-contact-us">
              Questions? Comments?&nbsp;
              <a href="mailto:feedback@houstonbook.link" target="_top">
                Email us
              </a>!
            </div>
            <div className="footer-overdrive">
              <img src={overdrive}
                   alt="Powered by Overdrive Logo"/>
            </div>
          </footer>
        </div>
      </Router>
    )
  }
}

export default App
