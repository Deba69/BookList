import React from 'react';

const GenreFilter = ({ genres, value, onChange }) => (
  <select value={value} onChange={e => onChange(e.target.value)} style={{ margin: '0 1rem 1rem 0', padding: 4 }}>
    <option value=''>All Genres</option>
    {genres.map(genre => (
      <option key={genre} value={genre}>{genre}</option>
    ))}
  </select>
);

export default GenreFilter; 