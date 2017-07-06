import React from 'react'
import DebounceInput from 'react-debounce-input'

import loadingGIF from '../images/loading.gif'
import defaultBookCover from '../images/DefaultBook.png'
import harrisCard from '../images/harris-co-cards.png'
import houstonCard from '../images/houston-card.png'

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
    this.goToOverdrive = this.goToOverdrive.bind(this)
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
          response.json().then(data => {
            const noDups = data.filter((book, index, self) => self.findIndex(other => other.id === book.id) === index);
            this.setState({suggestions: noDups, loading: false})
          })
        })
    } else {
      this.setState({ suggestions: [], loading: false})
    }
  }

  goToOverdrive(result) {
    if (result) {
      window.open(result.overdrive_href, '_blank');
    }
  }

  renderResult(result, card, show) {
    return (
      <div className='col-6'
           onClick={ () => { this.goToOverdrive(result) } }>
        { show && result ?
          <div className='checkout-details'>
            <img src={card} alt={result.library_name}/>
            <div className={ result.availability.available ? 'bold' : 'italic'}>
              {result.availability.available ? 'Check Out' : 'Place Hold'}
            </div>
          </div>
          : null }
      </div>
    )
  }

  renderCheckoutColumn(results) {
    const houstonResult = results.find(result => result.library_id === 1);
    const harrisResult = results.find(result => result.library_id === 2);

    const showHouston = this.state.selectedLibraryIds.indexOf(1) !== -1;
    const showHarris = this.state.selectedLibraryIds.indexOf(2) !== -1;

    return (
      <div className='row'>

        {/* offset column, since col-xs-offset doesn't work */}
        {!showHarris ? <div className="col-6"></div> : null}

        {this.renderResult(houstonResult, houstonCard, showHouston)}
        {this.renderResult(harrisResult, harrisCard, showHarris)}

      </div>
    )
  }

  renderSuggestion(suggestion, index) {
    return (
      <li role="option" key={index} aria-selected="false">
        <div className="result row">
          <div className="img-col col-3 col-md-2">
            <img src={suggestion.img_thumbnail || defaultBookCover}
                 alt={suggestion.title}/>
          </div>
          <div className="result-details col-6">
            <div className="title" dangerouslySetInnerHTML={{__html: suggestion.title}}></div> {/* TODO - don't be dangerous */}
            <div className="author">by&nbsp;{suggestion.primary_creator_name}</div>
            <div>{suggestion.media_type}</div>
          </div>
          <div className="checkout-info col-3 col-md-4">
            { this.renderCheckoutColumn(suggestion.locations) }
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
