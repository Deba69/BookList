const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const SECRET = 'supersecretkey';

app.use(cors());
app.use(bodyParser.json());

// In-memory user store
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
