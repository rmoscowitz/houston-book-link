import React from 'react';
import Autosuggest from 'react-autosuggest';

import sampleCoverImage from './DefaultBook.png'

// When suggestion is clicked, Autosuggest needs to populate the input element
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.title;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
    <div className="result row">
        <div className="col-2">
            <img src={suggestion.img_thumbnail || sampleCoverImage}
                 alt={suggestion.title}/>
        </div>
        <div className="result-details col-10">
            <span className="title">{suggestion.title}</span>
            <br/>
            <span>by&nbsp;</span>{suggestion.primary_creator_name}
            <br/>
            {suggestion.media_type}
        </div>
    </div>
);

class Search extends React.Component {
    constructor(props) {
        super(props);

        // Autosuggest is a controlled component.
        // This means that you need to provide an input value
        // and an onChange handler that updates this value (see below).
        // Suggestions also need to be provided to the Autosuggest,
        // and they are initially empty because the Autosuggest is closed.
        this.state = {
            value: '',
            suggestions: [],
        };
    }

    onChange = (event, {newValue}) => {
        this.setState({
            value: newValue
        });
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({value}) => {
        const selectedIds = this.props.selectedLibraries
            .filter(library => library.selected)
            .map(library => library.id);

        fetch(`/search?search=${encodeURIComponent(value)}&libraries=${selectedIds.join(',')}`)
            .then(response => {
                response.json().then(data => {
                    if (data.length) {
                        this.setState({
                            suggestions: data
                        }, () => {
                            // console.log(this.state.suggestions);
                        });
                    }
                })
            });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const {value, suggestions} = this.state;

        const inputProps = {
            placeholder: 'Search for e-books and audiobooks...',
            value,
            onChange: this.onChange
        };

        return (
            <div className="search-container">
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />
            </div>
        );
    }
}

export default Search;
