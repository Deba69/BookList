import React from 'react';

const SearchBar = ({ value, onChange }) => (
  <input
    type='text'
    placeholder='Search by title or author...'
    value={value}
    onChange={e => onChange(e.target.value)}
    style={{ margin: '0 1rem 1rem 0', padding: 4, width: 250 }}
  />
);

export default SearchBar; 