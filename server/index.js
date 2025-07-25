const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = 'supersecretkey';

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/bookreviews', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const reviewSchema = new mongoose.Schema({
  bookKey: { type: String, required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);

// In-memory user store (for demo only)
const users = {};

// Signup endpoint
app.post('/api/signup', (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'All fields required' });
  }
  if (users[username]) {
    return res.status(409).json({ error: 'User already exists' });
  }
  users[username] = { username, password, email };
  const token = jwt.sign({ username, email }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { username, email } });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username, email: user.email }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { username, email: user.email } });
});

// Auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Get current user
app.get('/api/me', auth, (req, res) => {
  res.json({ user: req.user });
});

// Get reviews for a book
app.get('/api/books/:bookKey/reviews', async (req, res) => {
  const { bookKey } = req.params;
  const reviews = await Review.find({ bookKey }).sort({ createdAt: -1 });
  res.json(reviews);
});

// Add a review for a book
app.post('/api/books/:bookKey/reviews', auth, async (req, res) => {
  const { bookKey } = req.params;
  const { rating, comment } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ error: 'Rating and comment required' });
  }
  const review = new Review({
    bookKey,
    username: req.user.username,
    rating,
    comment,
  });
  await review.save();
  res.status(201).json(review);
});

// Delete a review (only by the user who wrote it)
app.delete('/api/books/:bookKey/reviews/:reviewId', auth, async (req, res) => {
  const { bookKey, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  if (review.username !== req.user.username) {
    return res.status(403).json({ error: 'Not allowed to delete this review' });
  }
  await review.deleteOne();
  res.json({ success: true });
});

// Get average ratings for multiple books
app.post('/api/books/average-ratings', async (req, res) => {
  const { bookIds } = req.body;
  if (!Array.isArray(bookIds)) return res.status(400).json({ error: 'bookIds required' });
  const ratings = {};
  for (const bookId of bookIds) {
    const reviews = await Review.find({ bookKey: bookId });
    if (reviews.length > 0) {
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      ratings[bookId] = Number(avg.toFixed(2));
    } else {
      ratings[bookId] = null;
    }
  }
  res.json(ratings);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
