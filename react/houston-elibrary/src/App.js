import './App.css';
import React from 'react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import About from './About';
import Home from './Home';
import Menu from './Menu';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showNav: false,
        };
        this._onButtonClick = this._onButtonClick.bind(this);
    }

    _onButtonClick() {
        console.log('onbuttonclick');
        this.setState({
            showNav: !this.state.showNav
        });
        console.log(this.state)
    }

    render() {
        return (
            <Router>
                <div className="App">
                    <div className="App-header">
                        <h2>Houston E-Library Portal</h2>
                        <button className="menuButton" onClick={this._onButtonClick}>Menu</button>
                    </div>

                    { this.state.showNav ? <Menu /> : null }

                    <div id="main">
                        <Route exact path="/" component={Home}/>
                        <Route path ="/about" component={About}/>
                    </div>
                </div>
            </Router>
        )
    }

}

export default App


