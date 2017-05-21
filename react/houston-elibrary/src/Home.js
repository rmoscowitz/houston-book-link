// import PropTypes from 'react'
import React from 'react'

import Card from './Card'

import harrisCard from './harris-co-cards.png'
import houstonCard from './houston-card.png'

class Home extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            harris: false,
            houston: false,
        }

        this.select = this.select.bind(this)
    }

    select(propName, value) {
        // console.log(propName, value);
        // this.setState();
    }

    render() {
        return (
            <div>
                <div>Choose your library cards...</div>

                <div className="card-container">
                    <Card imagePath={houstonCard}
                          imageAltText='Houston Public Library Card'
                          libraryId='houston'
                          select={this.select}/>
                    <Card imagePath={harrisCard}
                          imageAltText='Harris County Library Cards'
                          libraryId='harris'
                          select={this.select}/>
                </div>

                { /* search */ }
            </div>
        )
    }
}


export default Home;