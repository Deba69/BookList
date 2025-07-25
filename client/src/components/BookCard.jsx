import React from 'react';
import { Link } from 'react-router-dom';

// Helper to generate a random rating between 1 and 5 (inclusive, one decimal place)
function getRandomRating(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = key.charCodeAt(i) + ((hash << 5) - hash);
  const random = Math.abs(Math.sin(hash)) * 4 + 1; // 1 to 5
  return Math.round(random * 10) / 10;
}

const BookCard = ({ book }) => {
  const coverId = book.cover_id;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : 'https://via.placeholder.com/128x193?text=No+Cover';
  const rating = getRandomRating(book.key);
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="book-card" style={{
      border: '1px solid #ccc',
      borderRadius: 8,
      padding: 12,
      paddingBottom: 56, // Reserve space for rating
      width: 180,
      background: '#232323',
      color: '#fff',
      boxShadow: '0 2px 8px #0002',
      display: 'flex',
      flexDirection: 'column',
      height: 350,
      justifyContent: 'flex-start',
      position: 'relative',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}>
      <Link to={`/books${book.key}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <img src={coverUrl} alt={book.title} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 4 }} />
        <h3 style={{ fontSize: 18, margin: '8px 0 4px', minHeight: 44 }}>{book.title}</h3>
        <div style={{ fontSize: 14, color: '#bbb', minHeight: 20 }}>
          {book.authors && book.authors.map(a => a.name).join(', ')}
        </div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 4, minHeight: 16 }}>
          {book.subject && book.subject.slice(0, 2).join(', ')}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{
          fontSize: 28,
          color: '#FFD700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          position: 'absolute',
          left: 12,
          bottom: 12,
        }}>
          {Array(fullStars).fill().map((_, i) => <span key={i}>★</span>)}
          {halfStar && <span>★</span>}
          {Array(emptyStars).fill().map((_, i) => <span key={i}>☆</span>)}
          <span style={{ color: '#fff', fontSize: 20, marginLeft: 8 }}>{rating.toFixed(1)}</span>
        </div>
      </Link>
    </div>
  );
};

export default BookCard; 