import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const BookDetails = () => {
  const location = useLocation();
  // Extract everything after /books as the key
  const bookKey = location.pathname.replace('/books', '');
  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        // Ensure bookKey starts with a slash
        const key = bookKey.startsWith('/') ? bookKey : `/${bookKey}`;
        const res = await axios.get(`https://openlibrary.org${key}.json`);
        setBook(res.data);
        // Fetch author details if available
        if (res.data && res.data.authors && res.data.authors.length > 0) {
          const authorPromises = res.data.authors.map(async (a) => {
            try {
              const authorRes = await axios.get(`https://openlibrary.org${a.author.key}.json`);
              return authorRes.data;
            } catch {
              return null;
            }
          });
          const authorData = await Promise.all(authorPromises);
          setAuthors(authorData.filter(Boolean));
        } else {
          setAuthors([]);
        }
        console.log('Book details:', res.data);
      } catch (err) {
        setError('Failed to load book details.');
        setBook(null);
        setAuthors([]);
        console.error('Book details error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookKey]);

  useEffect(() => {
    console.log('Book:', book);
    console.log('Authors:', authors);
    console.log('Error:', error);
  }, [book, authors, error]);

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Loading book details...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>;
  if (!book) return <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>No book found.</div>;

  // Get cover image
  const coverId = book.covers && book.covers.length > 0 ? book.covers[0] : null;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : 'https://via.placeholder.com/200x300?text=No+Cover';

  // Get description
  const description = book.description
    ? typeof book.description === 'string'
      ? book.description
      : book.description.value
    : 'No description available.';

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: 20, border: '1px solid #ddd', borderRadius: 8, background: '#222', color: '#fff' }}>
      <Link to='/' style={{ color: '#61dafb' }}>← Back to list</Link>
      <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
        <img src={coverUrl} alt={book.title} style={{ width: 200, height: 300, objectFit: 'cover', borderRadius: 4 }} />
        <div>
          <h1>{book.title}</h1>
          <div style={{ margin: '8px 0' }}>
            <strong>Authors:</strong>{' '}
            {authors.length > 0
              ? authors.map(a => a.name).join(', ')
              : 'Unknown'}
          </div>
          <div style={{ margin: '8px 0' }}>
            <strong>Subjects:</strong>{' '}
            {book.subjects ? book.subjects.slice(0, 5).join(', ') : 'N/A'}
          </div>
          <div style={{ margin: '8px 0' }}>
            <strong>First Published:</strong> {book.first_publish_date || 'Unknown'}
          </div>
          <div style={{ margin: '16px 0' }}>
            <strong>Description:</strong>
            <div style={{ marginTop: 4 }}>{description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails; 