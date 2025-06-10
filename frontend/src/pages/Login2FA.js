import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login2FA = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer l'email stocké lors de la première étape
    const storedEmail = sessionStorage.getItem('temp_email');
    if (!storedEmail) {
      // Si pas d'email, rediriger vers la page de login
      navigate('/');
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (code.length !== 6) {
      setError('Le code doit contenir 6 chiffres.');
      return;
    }

    try {
      const response = await fetch('/api/v1/auth/login/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access_token);
        sessionStorage.removeItem('temp_email'); // Nettoyer le stockage temporaire
        alert('Connexion réussie !');
        // Rediriger vers la page protégée (exemple : dashboard)
        navigate('/dashboard');
      } else {
        setError(data.message || 'Code invalide.');
      }
    } catch (err) {
      setError('Erreur réseau, veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <form
        onSubmit={handle2FASubmit}
        className="bg-white p-8 rounded shadow-md max-w-md w-full text-center"
      >
        <h2 className="text-2xl font-bold mb-6 text-green-700">Saisie du code 2FA</h2>
        {error && <p className="mb-4 text-red-600">{error}</p>}

        <p className="mb-6 text-gray-700">Email : <strong>{email}</strong></p>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          className="w-full p-2 border border-green-700 rounded mb-6 text-center text-black"
          placeholder="Entrez le code à 6 chiffres"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-700 text-white p-3 rounded hover:bg-green-800 transition"
        >
          Valider le code 2FA
        </button>
      </form>
    </div>
  );
};

export default Login2FA;
