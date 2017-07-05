import React from 'react'
import DebounceInput from 'react-debounce-input'

import loadingGIF from '../images/loading.gif'
import defaultBookCover from '../images/DefaultBook.png'

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
      loading: false,
      selectedLibraryIds: [],
    }
    this.renderSuggestion = this.renderSuggestion.bind(this)
  }

  // handles new props (selected library cards)
  componentWillReceiveProps(nextProps) {
    const newIds = nextProps.selectedLibraries
      .filter(library => library.selected)
      .map(library => library.id);

    this.setState({
      selectedLibraryIds: newIds,
      loading: this.state.selectedLibraryIds.length !== newIds.length
    }, this.loadSuggestions);
  }

  focus() {
    this.searchInput.focus()
  }

  onChange = (event) => {
    const value = event.target.value;
    this.setState({value, loading: true});
    this.loadSuggestions(value);
  }

  loadSuggestions = (newValue) => {
    const {value, selectedLibraryIds} = this.state;
    const search = value || newValue;

    if (selectedLibraryIds.length > 0 && search) {
      fetch(`/search?search=${encodeURIComponent(search)}&libraries=${selectedLibraryIds.join(',')}`)
        .then(response => {
          response.json().then(suggestions => {
            this.setState({suggestions, loading: false})
          })
        })
    } else {
      this.setState({ suggestions: [], loading: false})
    }
  }

  renderCheckoutInfo(locations) {
    return locations.map((location, index) => {
      return (
        <a key={index} href={location.overdrive_href}>Available at {location.library_name}<br /></a>
      )
    })
  }

  renderSuggestion(suggestion, index) {
    const checkout = locations => this.renderCheckoutInfo(locations);

    return (
      <li role="option" key={index} aria-selected="false">
        <div className="result row">
          <div className="col-2 img-col">
            <img src={suggestion.img_thumbnail || defaultBookCover}
                 alt={suggestion.title}/>
          </div>
          <div className="result-details col-5">
            <div className="title">{suggestion.title}</div>
            <div>by&nbsp;{suggestion.primary_creator_name}</div>
            <div>{suggestion.media_type}</div>
          </div>
          <div className="checkout-info col-4">
            { checkout(suggestion.locations) }
          </div>
        </div>
      </li>
    )
  }

  renderSuggestions(suggestions) {
    return suggestions.map((suggestion, index) => this.renderSuggestion(suggestion, index))
  }

  render() {
    const {value, suggestions, loading, selectedLibraryIds} = this.state;
    const results = this.renderSuggestions(suggestions);

    return (
      <div className="search-container"
           ref={(search) => {
            if (search) {
              this.searchInput = search.querySelector('input')
            }
          }}>
        <DebounceInput
          placeholder="Search for e-books and audiobooks..."
          minLength={2}
          debounceTimeout={300}
          onChange={this.onChange}/>

        <div className="loading-spinner">
          {loading ? <img className="media-object"
                        style={{ margin: "auto" }}
                        src={loadingGIF}
                        width="100"
                        alt="loading"/> : null}
        </div>

        <div className="no-results-message">
          {value && !suggestions.length && !loading && selectedLibraryIds.length > 0 ?
            <p>Oh no! No suggestions! Try changing your search.</p> : null }
        </div>

        <div className="no-libraries-message">
          {selectedLibraryIds.length === 0 ?
            <p>At least one library card must be selected to see results.</p> : null }
        </div>

        <ul className="results" role="listbox">
          {suggestions.length > 0 && !loading ? results : null}
        </ul>
      </div>
    )
  }
}

export default Search
