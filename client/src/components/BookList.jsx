import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from './BookCard';
import GenreFilter from './GenreFilter';
import SearchBar from './SearchBar';

const BOOKS_PER_PAGE = 20;

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        // Fetch books from Open Library by subject for a large dataset
        const res = await axios.get('https://openlibrary.org/subjects/fiction.json?limit=200');
        const works = res.data.works || [];
        setBooks(works);
        setFilteredBooks(works);
        // Extract genres (subjects)
        const genreSet = new Set();
        works.forEach(book => {
          (book.subject || []).forEach(sub => genreSet.add(sub));
        });
        setGenres(Array.from(genreSet).sort());
      } catch (err) {
        setError('Failed to load books.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    let filtered = books;
    if (search) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        (book.authors && book.authors.some(a => a.name.toLowerCase().includes(search.toLowerCase())))
      );
    }
    if (selectedGenre) {
      filtered = filtered.filter(book => book.subject && book.subject.includes(selectedGenre));
    }
    setFilteredBooks(filtered);
    setPage(1);
  }, [search, selectedGenre, books]);

  const paginatedBooks = filteredBooks.slice((page - 1) * BOOKS_PER_PAGE, page * BOOKS_PER_PAGE);
  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Book List</h1>
      <SearchBar value={search} onChange={setSearch} />
      <GenreFilter genres={genres} value={selectedGenre} onChange={setSelectedGenre} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {paginatedBooks.map(book => (
          <BookCard key={book.key} book={book} />
        ))}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span style={{ margin: '0 1rem' }}>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default BookList; 