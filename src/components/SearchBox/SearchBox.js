import React, { useState } from 'react';
import './SearchBox.css';
import PropTypes from 'prop-types'

const SearchBox = ({ searchSubmit }) => {

    const [query, setQuery] = useState('');


    const handleQueryStringChange = (e) => {
        setQuery(e.target.value);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Fetch weather data for:', query);
        searchSubmit(query);
    }

    return (
        <div className="form-container">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    name="searchBox"
                    id="searchBox"
                    placeholder="Enter City or Zipcode"
                    onChange={handleQueryStringChange} />
                <span
                    className="search-button fa fa-search"
                    onClick={handleSearch}></span>
            </form>
        </div>
    );
}


SearchBox.propTypes = {
    searchSubmit: PropTypes.func
}

export default SearchBox;