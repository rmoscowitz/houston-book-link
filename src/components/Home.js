import React from 'react'
import {Alert} from 'reactstrap';

import Card from './Card'
import Search from './Search'

import harrisCard from '../images/harris-co-cards.png'
import houstonCard from '../images/houston-card.png'

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: localStorage.getItem('birthdayAlertVisible') !== 'dismissed',
      libraries: [],
    }

    this.select = this.select.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  componentWillMount() {
    const getImagePath = (libraryId) => {
      const imagePaths = {
        1: houstonCard,
        2: harrisCard,
      }
      return imagePaths[libraryId]
    };

    fetch(`/libraries`)
    .then(response => {
      response.json().then(libraries => {
        this.setState({
          libraries: libraries.map(library => {
            return Object.assign(library, {
              selected: true,
              imagePath: getImagePath(library.id),
            });
          })
        });
      })
    });
  }

  select(libraryId, value) {
    const libraries = this.state.libraries.map(library => {
      if (library.id === libraryId) {
        library.selected = value;
      }
      return library;
    });
    this.setState({ libraries }, () => {
      this.searchRef.focus();
    });
  }

  onDismiss() {
    localStorage.setItem('birthdayAlertVisible', 'dismissed')
    this.setState({ visible: false })
  }

  renderCards(libraries) {
    return libraries.map((library, index) => (
      <Card key={index}
            imagePath={library.imagePath}
            imageAltText={library.name}
            libraryId={library.id}
            select={this.select}/>
    ));
  }

  render() {
    const cards = this.renderCards(this.state.libraries);

    return (
      <div>
        <Alert color="info" isOpen={this.state.visible} toggle={this.onDismiss}>
          Houston Book Link is one year old!&nbsp;
          <img alt="Birthday cake icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEiSURBVDhPpY9NSwJRFIbvX4n6H+IX1Z1B+g1FBJIT9LHxH7hyN6GWfW0jKXRjSkGTthHa1GRLwzbZLMvd2z3DoUkHumYvPHCee+Y9MOJn2onEKsGq9ZHcJZMz7Xj8g6BZ51wLohaWAgzNvzrXgrQikblWLPZMONHorM65NppUtuYRrFoPRS1BsGo9FF1h3EPRFcb9O5f7i2ajLL16aQGT0Cwb7/WSIbkuBD0M3BzgnUzE22NOHTEHXBeiljfQuVjB8LWAYb+I++oa3OaG8qKP27D8N9p99gvonC+jmjeDXzlel3iqZHB1kML14RK6Zxk8nKb9maCZ9jTTN92KBepwXYijtAScvT9BHa7/88CWffOybTuYkp7Y2XXklEd6m/bt/Bdk4N9VfhPurAAAAABJRU5ErkJggg=="/>
          &nbsp;Thank you <a href="http://sketchcity.org/">Sketch City</a> for continuing to support us!
        </Alert>

        <div>Choose your library cards...</div>

        <div className="card-container">
          {cards}
        </div>

        <Search selectedLibraries={this.state.libraries}
                ref={(search) => {
                  this.searchRef = search;
                }}/>
      </div>

    )
  }
}


export default Home;
