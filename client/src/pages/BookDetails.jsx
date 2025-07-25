import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const mockReviews = [
  { id: 1, user: 'alice', rating: 4.5, text: 'Loved this book!' },
  { id: 2, user: 'bob', rating: 3.0, text: 'It was okay.' },
  { id: 3, user: 'carol', rating: 5.0, text: 'A masterpiece.' },
];

const API_URL = 'http://localhost:5000/api';

const BookDetails = () => {
  const location = useLocation();
  const bookKey = location.pathname.replace('/books', '');
  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const key = bookKey.startsWith('/') ? bookKey : `/${bookKey}`;
        const res = await axios.get(`https://openlibrary.org${key}.json`);
        setBook(res.data);
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
      } catch (err) {
        setError('Failed to load book details.');
        setBook(null);
        setAuthors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookKey]);

  const bookId = bookKey.replace(/^\/works\//, ''); // removes '/works/' from the start

  // Fetch reviews from backend
  useEffect(() => {
    setLoadingReviews(true);
    axios.get(`${API_URL}/books/${bookId}/reviews`)
      .then(res => setReviews(res.data))
      .catch(() => setReviews([]))
      .finally(() => setLoadingReviews(false));
  }, [bookId]);

  const handleAddReviewClick = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setShowForm(true);
  };

  // Add review to backend
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/books/${bookId}/reviews`,
        { rating: reviewRating, comment: reviewText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews([res.data, ...reviews]);
      setShowForm(false);
      setReviewText('');
      setReviewRating(5);
    } catch {
      alert('Failed to submit review.');
    }
  };

  // Delete review from backend
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/books/${bookId}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch {
      alert('Failed to delete review.');
    }
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Loading book details...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>;
  if (!book) return <div style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>No book found.</div>;

  const coverId = book.covers && book.covers.length > 0 ? book.covers[0] : null;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : 'https://via.placeholder.com/200x300?text=No+Cover';
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
      <div style={{ marginTop: 32 }}>
        <h2>Reviews</h2>
        <button
          onClick={handleAddReviewClick}
          style={{ background: '#FFD700', color: '#232323', fontWeight: 'bold', border: 'none', borderRadius: 4, padding: '8px 20px', marginBottom: 16, cursor: 'pointer' }}
        >
          Add Review
        </button>
        {showForm && (
          <form onSubmit={handleReviewSubmit} style={{ marginBottom: 24, background: '#181818', padding: 16, borderRadius: 8 }}>
            <div style={{ marginBottom: 8 }}>
              <label style={{ marginRight: 8 }}>Rating:</label>
              <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))} style={{ fontSize: 16, padding: 4, borderRadius: 4 }}>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Write your review..."
              rows={3}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #444', background: '#232323', color: '#fff', marginBottom: 8 }}
            />
            <button type="submit" style={{ background: '#FFD700', color: '#232323', fontWeight: 'bold', border: 'none', borderRadius: 4, padding: '8px 20px', cursor: 'pointer' }}>
              Submit
            </button>
          </form>
        )}
        <div>
          {loadingReviews ? (
            <div style={{ color: '#bbb' }}>Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div style={{ color: '#bbb' }}>No reviews yet.</div>
          ) : (
            reviews.map(r => (
              <div key={r._id} style={{ background: '#181818', marginBottom: 12, padding: 12, borderRadius: 6, position: 'relative' }}>
                <div style={{ color: '#FFD700', fontSize: 18, marginBottom: 4 }}>
                  {Array(Math.floor(r.rating)).fill().map((_, i) => <span key={i}>★</span>)}
                  {r.rating % 1 >= 0.5 && <span>★</span>}
                  {Array(5 - Math.ceil(r.rating)).fill().map((_, i) => <span key={i}>☆</span>)}
                  <span style={{ color: '#fff', fontSize: 14, marginLeft: 8 }}>{r.rating.toFixed(1)}</span>
                </div>
                <div style={{ color: '#fff', fontWeight: 'bold' }}>{r.username}</div>
                <div style={{ color: '#ccc', marginTop: 4 }}>{r.comment}</div>
                {user && r.username === user.username && (
                  <button onClick={() => handleDeleteReview(r._id)} style={{ position: 'absolute', top: 8, right: 8, background: 'transparent', color: '#FFD700', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails; 