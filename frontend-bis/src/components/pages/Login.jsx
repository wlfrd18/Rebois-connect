// src/components/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === 'test@example.com' && password === 'motdepasse') {
      localStorage.setItem('token', 'fake-jwt-token');
      navigate('/dashboard');
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Connexion</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ton.email@exemple.com"
            />
          </div>

          <div>
            <label className="block text-gray-700">Mot de passe</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
          >
            Se connecter
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-green-700 hover:underline">
            Créez un compte
          </Link>
        </p>
      </div>
    </section>
  );
}
