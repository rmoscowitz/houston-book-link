import React from 'react';
import {
    Link
} from 'react-router-dom';

class Home extends React.Component {

    render() {
        return (
            <div className="sidenav">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
            </div>
        )
    }

}

export default Home;