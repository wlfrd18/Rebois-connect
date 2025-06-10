import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Activation = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Activation en cours...');
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: appeler API activation avec le token
    // fetch(`http://localhost:5000/api/activate/${token}`)
    //   .then(res => res.json())
    //   .then(data => setMessage(data.message))
    //   .catch(() => setError('Erreur lors de l’activation'));
    // Simulation :
    setTimeout(() => {
      if (token) setMessage('Compte activé avec succès !');
      else setError('Token invalide.');
    }, 1500);
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-6 text-greenvegetal">Activation de compte</h2>
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <p className="text-black">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Activation;
