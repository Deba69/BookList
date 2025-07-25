import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from './BookCard';
import './BookList.css';

const API_URL = 'http://localhost:5000/api';
// Curated genres and their matching keywords
const GENRE_MAP = [
  { name: 'Horror', keywords: ['horror', 'ghost', 'supernatural', 'vampire', 'monster'] },
  { name: 'Romance', keywords: ['romance', 'love', 'relationships', 'romantic'] },
  { name: 'Science', keywords: ['science', 'scientific', 'physics', 'chemistry', 'biology'] },
  { name: 'Thriller', keywords: ['thriller', 'suspense', 'crime', 'detective', 'spy', 'espionage'] },
  { name: 'Mystery', keywords: ['mystery', 'whodunit', 'investigation'] },
  { name: 'History', keywords: ['history', 'historical', 'ancient', 'medieval', 'war', 'revolution'] },
  { name: 'Geography', keywords: ['geography', 'travel', 'places', 'world', 'earth', 'map'] },
  { name: 'Educational', keywords: ['education', 'textbook', 'school', 'learning', 'study', 'guide', 'reference'] },
  { name: 'Fantasy', keywords: ['fantasy', 'magic', 'dragon', 'wizard', 'fairy', 'mythical'] },
  { name: 'Adventure', keywords: ['adventure', 'quest', 'journey', 'exploration', 'expedition'] },
  { name: 'Biography', keywords: ['biography', 'memoir', 'autobiography', 'life', 'personal'] },
  { name: 'Children', keywords: ['children', 'kids', 'juvenile', 'young', 'fairy tale', 'picture book'] },
  { name: 'Classic', keywords: ['classic', 'literature', 'masterpiece'] },
  { name: 'Comics', keywords: ['comic', 'graphic novel', 'manga'] },
  { name: 'Poetry', keywords: ['poetry', 'poem', 'verse'] },
  { name: 'Drama', keywords: ['drama', 'play', 'theatre', 'theater'] },
  { name: 'Self-Help', keywords: ['self-help', 'motivation', 'inspiration', 'personal development'] },
  { name: 'Religion', keywords: ['religion', 'spiritual', 'faith', 'bible', 'quran', 'torah'] },
  { name: 'Health', keywords: ['health', 'wellness', 'fitness', 'medicine', 'medical'] },
  { name: 'Business', keywords: ['business', 'economics', 'finance', 'management', 'entrepreneur'] },
];

function mapSubjectsToGenres(subjects = []) {
  const genres = new Set();
  const lowerSubjects = subjects.map(s => s.toLowerCase());
  GENRE_MAP.forEach(({ name, keywords }) => {
    if (keywords.some(keyword => lowerSubjects.some(sub => sub.includes(keyword)))) {
      genres.add(name);
    }
  });
  return Array.from(genres);
}

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [curatedGenres, setCuratedGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const BOOKS_PER_PAGE = 20;
  const [avgRatings, setAvgRatings] = useState({});

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://openlibrary.org/subjects/fiction.json?limit=200');
        const works = res.data.works || [];
        // Map each book to curated genres
        const booksWithGenres = works.map(book => ({
          ...book,
          curatedGenres: mapSubjectsToGenres(book.subject || [])
        }));
        setBooks(booksWithGenres);
        // Collect all curated genres present in the books
        const genreSet = new Set();
        booksWithGenres.forEach(book => book.curatedGenres.forEach(g => genreSet.add(g)));
        setCuratedGenres(Array.from(genreSet).sort());

        // Fetch average ratings for all books
        const bookIds = booksWithGenres.map(b => b.key.replace(/^\/works\//, ''));
        const ratingsRes = await axios.post(`${API_URL}/books/average-ratings`, { bookIds });
        setAvgRatings(ratingsRes.data);
      } catch (err) {
        setError('Failed to load books.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  let filteredBooks = books;
  if (selectedGenre) {
    filteredBooks = filteredBooks.filter(book => book.curatedGenres.includes(selectedGenre));
  }
  if (search) {
    filteredBooks = filteredBooks.filter(book =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      (book.authors && book.authors.some(a => a.name.toLowerCase().includes(search.toLowerCase())))
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice((page - 1) * BOOKS_PER_PAGE, page * BOOKS_PER_PAGE);

  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));

  // Reset to page 1 when filters/search change
  useEffect(() => { setPage(1); }, [selectedGenre, search]);

  if (loading) return <div className="booklist-loading">Loading books...</div>;
  if (error) return <div className="booklist-error">{error}</div>;

  return (
    <div className="booklist-root">
      <h1 className="booklist-title">Book List</h1>
      <div className="booklist-controls">
        <div className="dropdown">
          <button className="dropbtn">{selectedGenre ? selectedGenre : 'Genres'} ▼</button>
          <div className="dropdown-content">
            <div onClick={() => setSelectedGenre('')}>All Genres</div>
            {curatedGenres.map(genre => (
              <div key={genre} onClick={() => setSelectedGenre(genre)}>{genre}</div>
            ))}
          </div>
        </div>
        <input
          className="booklist-search"
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="booklist-grid">
        {paginatedBooks.map(book => (
          <BookCard key={book.key} book={book} avgRating={avgRatings[book.key.replace(/^\/works\//, '')]} />
        ))}
      </div>
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
        <button onClick={handlePrev} disabled={page === 1}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={handleNext} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default BookList; 