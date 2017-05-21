import './App.css';

import React from 'react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import About from './About';
import Home from './Home';
import FAQ from './FAQ';
import logo from './logo2.png';

class App extends React.Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <div className="App-header row">
                        <h2 className="col-6">
                            <img src={logo} className="App-logo" alt="logo" />
                            Houston E-Library Portal
                        </h2>
                        <ul className="col-5 nav nav-pills">
                            <li role="presentation"><a href="/">Home</a></li>
                            <li role="presentation"><a href="/about">About</a></li>
                            <li role="presentation"><a href="/faq">FAQ</a></li>
                        </ul>

                    </div>

                    <div id="main">
                        <Route exact path="/" component={Home}/>
                        <Route path="/about" component={About}/>
                        <Route path="/faq" component={FAQ}/>
                    </div>
                </div>
            </Router>
        )
    }

}

export default App


