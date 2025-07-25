import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import BookList from './components/BookList';
import BookDetails from './pages/BookDetails';
import SignIn from './pages/SignIn';
import { AuthProvider } from './context/AuthContext';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useAuth } from './context/AuthContext';

function App() {
  const [count, setCount] = useState(0)
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 64 }}><span style={{ color: '#FFD700' }}>Loading books...</span></div>;
  }

  return (
    <>
      <div className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ fontWeight: 'bold', fontSize: 24 }}>Book App</div>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: 16 }}>Hello, <b>{user.username}</b></span>
              <button onClick={signOut}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/signin" style={{ marginRight: 16 }}>
                <button>Login</button>
              </Link>
              <Link to="/signup">
                <button>Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
      <Routes>
        <Route path='/' element={<BookList />} />
        <Route path='/books/*' element={<BookDetails />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignIn signupMode={true} />} />
      </Routes>
    </>
  );
}

export default App;
