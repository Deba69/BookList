# Book Review Platform

## Features
- Add new books
- View a list of all books with filters
- Write reviews for books
- Rate books (1 to 5 stars)
- View average rating per book

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (comes with Node.js)

### 1. Clone the repository
```bash
git clone https://github.com/Deba69/BookList.git
cd BookList
```

### 2. Install dependencies
#### For the client:
```bash
cd client
npm install
```
#### For the server:
```bash
cd ../server
npm install
```

### 3. Start the development servers
#### Start the backend server:
```bash
cd server
npm start
```
#### Start the frontend dev server (in a new terminal):
```bash
cd client
npm run dev
```

- The frontend will run on [http://localhost:5173](http://localhost:5173)
- The backend will run on [http://localhost:5000](http://localhost:5000)

## Architecture Decisions
- **Frontend:** React (Vite) with Context API for authentication and state management.
- **Backend:** Node.js with Express, using JWT for authentication.
- **In-memory storage** is used for users and books (no database yet).
- **REST API** endpoints for login, signup, and user info.
- **Pagination** and filtering are handled client-side for book lists.
- **JWT tokens** are stored in localStorage for persistent login.

## Known Limitations
- **No persistent database:** All users, books, and reviews are lost when the server restarts.
- **Passwords are stored in plain text** (for demo only; do not use in production).
- **No real email verification or password reset.**
- **No user roles or admin features.**
- **Book data is fetched from Open Library API and not user-submitted.**
- **Reviews and ratings are not yet implemented in the backend.**

## Future Improvements
- Add a real database (MongoDB, PostgreSQL, etc.) for persistent storage.
- Implement secure password hashing.
- Add endpoints and UI for adding books, reviews, and ratings.
- Add user profile and review management features.
- Improve error handling and validation. 