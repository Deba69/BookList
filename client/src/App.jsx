import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import BookDetails from './pages/BookDetails';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path='/' element={<BookList />} />
      <Route path='/books/*' element={<BookDetails />} />
    </Routes>
  );
}

export default App;
