import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignIn = ({ signupMode = false }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (signupMode) {
        if (username.trim() && password.trim() && email.trim()) {
          await signUp(username.trim(), password.trim(), email.trim());
          navigate('/');
        } else {
          setError('All fields required');
        }
      } else {
        if (username.trim() && password.trim()) {
          await signIn(username.trim(), password.trim());
          navigate('/');
        } else {
          setError('All fields required');
        }
      }
    } catch (err) {
      setError('Invalid credentials or user already exists');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', background: '#232323', color: '#fff', padding: 32, borderRadius: 8 }}>
      <h2>{signupMode ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 4, border: '1px solid #444', background: '#181818', color: '#fff' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 4, border: '1px solid #444', background: '#181818', color: '#fff' }}
        />
        {signupMode && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 4, border: '1px solid #444', background: '#181818', color: '#fff' }}
          />
        )}
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: 10, borderRadius: 4, background: '#FFD700', color: '#232323', fontWeight: 'bold', border: 'none' }} disabled={loading}>
          {loading ? (signupMode ? 'Signing Up...' : 'Signing In...') : (signupMode ? 'Sign Up' : 'Sign In')}
        </button>
      </form>
    </div>
  );
};

export default SignIn; 