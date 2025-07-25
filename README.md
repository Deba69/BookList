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
- MongoDB Atlas account (for production)

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

### 3. Environment Variables
#### Backend (.env)
Create a `.env` file in the `server` directory:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```
- For local development, you can use `mongodb://localhost:27017/bookreviews`.
- For production (Render), use your MongoDB Atlas connection string.

#### Frontend
No special environment variables are required for Vercel, but you may want to set the backend API URL if it differs from local:
- In `client/src/context/AuthContext.jsx` and `client/src/components/BookList.jsx`, set the API URL to your Render backend URL (e.g., `https://your-backend.onrender.com/api`).

### 4. Start the development servers
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

## Production Deployment

### Backend (Render)
1. Push your code to GitHub.
2. Create a new Web Service on [Render](https://render.com/):
   - Connect your GitHub repo.
   - Set the build command: `npm install` (in `server` directory)
   - Set the start command: `npm start`
   - Set environment variables:
     - `MONGODB_URI` (from MongoDB Atlas)
     - `JWT_SECRET` (choose a strong secret)
     - `PORT` (usually 10000 or leave blank for Render default)
3. Deploy and note your backend URL (e.g., `https://your-backend.onrender.com`).

### MongoDB (Atlas)
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Whitelist Render's IPs or allow access from anywhere (for testing).
- Get your connection string and set it as `MONGODB_URI` in Render.

### Frontend (Vercel)
1. Push your code to GitHub.
2. Import your repo in [Vercel](https://vercel.com/).
3. Set the frontend build output to `client` (or set up a custom build step if needed).
4. Set the backend API URL in your frontend code to your Render backend URL.
5. Deploy!

## Architecture Decisions
- **Frontend:** React (Vite) with Context API for authentication and state management.
- **Backend:** Node.js with Express, using JWT for authentication.
- **MongoDB Atlas** for persistent storage of reviews.
- **REST API** endpoints for login, signup, user info, reviews, and ratings.
- **Pagination** and filtering are handled client-side for book lists.
- **JWT tokens** are stored in localStorage for persistent login.

## Known Limitations
- **Passwords are stored in plain text** (for demo only; do not use in production).
- **No real email verification or password reset.**
- **No user roles or admin features.**
- **Book data is fetched from Open Library API and not user-submitted.**
- **Reviews and ratings are not yet implemented in the backend for user-added books.**

## Future Improvements
- Implement secure password hashing.
- Add endpoints and UI for adding books, reviews, and ratings for user-submitted books.
- Add user profile and review management features.
- Improve error handling and validation. 