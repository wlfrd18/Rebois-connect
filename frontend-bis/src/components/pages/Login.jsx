import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    téléphone: '',
    password: '',
    is_volunteer: false,
    is_sponsor: false,
    is_tech_structure: false,
  });

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const newUser = {
      ...formData,
      id: Date.now(),
    };

    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    navigate('/dashboard');
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-green-700">Créer un compte / Connexion</h2>

        <input type="text" name="first_name" placeholder="Prénom" value={formData.first_name} onChange={handleChange} className="border p-2 w-full rounded" />
        <input type="text" name="last_name" placeholder="Nom" value={formData.last_name} onChange={handleChange} className="border p-2 w-full rounded" />
        <input type="text" name="téléphone" placeholder="Téléphone" value={formData.téléphone} onChange={handleChange} className="border p-2 w-full rounded" />
        <input type="email" name="email" placeholder="Adresse e-mail" value={formData.email} onChange={handleChange} className="border p-2 w-full rounded" />
        <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} className="border p-2 w-full rounded" />

        <div className="flex flex-col gap-2 mt-2">
          <label><input type="checkbox" name="is_volunteer" checked={formData.is_volunteer} onChange={handleChange} /> Je suis volontaire</label>
          <label><input type="checkbox" name="is_sponsor" checked={formData.is_sponsor} onChange={handleChange} /> Je suis mécène</label>
          <label><input type="checkbox" name="is_tech_structure" checked={formData.is_tech_structure} onChange={handleChange} /> Je suis structure technique</label>
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Se connecter / Créer un compte
        </button>
      </form>
    </section>
  );
}
