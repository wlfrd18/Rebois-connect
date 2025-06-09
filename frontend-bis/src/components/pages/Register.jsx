import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    téléphone: '',
    email: '',
    password: '',
    confirm: '',
    role: '', // 'volunteer', 'sponsor', 'tech_structure'
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!formData.role) {
      setError('Veuillez sélectionner un rôle');
      return;
    }

    // Simuler l'enregistrement (à remplacer avec appel backend)
    const newUser = {
      id: Date.now(),
      first_name: formData.first_name,
      last_name: formData.last_name,
      téléphone: formData.téléphone,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    // Sauvegarde temporaire (à remplacer avec une vraie base de données)
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', 'fake-token');

    navigate('/dashboard');
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Créer un compte</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700">Prénom</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Nom</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Téléphone</label>
            <input
              type="tel"
              name="téléphone"
              value={formData.téléphone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mt-2 text-sm text-gray-600">
            <label className="font-medium text-gray-700">Rôle (choix unique)</label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="volunteer"
                checked={formData.role === 'volunteer'}
                onChange={handleChange}
              />
              Je suis volontaire
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="sponsor"
                checked={formData.role === 'sponsor'}
                onChange={handleChange}
              />
              Je suis mécène
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="tech_structure"
                checked={formData.role === 'tech_structure'}
                onChange={handleChange}
              />
              Je suis structure technique
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
          >
            S'inscrire
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Déjà inscrit ?{' '}
          <Link to="/login" className="text-green-700 hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </section>
  );
}
