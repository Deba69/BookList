import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  const coverId = book.cover_id;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : 'https://via.placeholder.com/128x193?text=No+Cover';
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, width: 180 }}>
      <Link to={`/books${book.key}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img src={coverUrl} alt={book.title} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 4 }} />
        <h3 style={{ fontSize: 18, margin: '8px 0 4px' }}>{book.title}</h3>
        <div style={{ fontSize: 14, color: '#555' }}>
          {book.authors && book.authors.map(a => a.name).join(', ')}
        </div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
          {book.subject && book.subject.slice(0, 2).join(', ')}
        </div>
      </Link>
    </div>
  );
};

export default BookCard; 