import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Merci de remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch("auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setError(null);
        alert("Code 2FA envoyé par email.");

        // Stocker l'email temporairement pour la 2FA
        sessionStorage.setItem("temp_email", email);

        // Rediriger vers la page 2FA sans exposer l'email dans l'URL
        navigate("/login/2fa");
      } else {
        setError(data.message || "Erreur lors de la connexion.");
      }
    } catch (err) {
      setError("Erreur réseau, veuillez réessayer.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-green-700">Connexion</h2>

      {error && (
        <div className="mb-4 text-red-600 font-semibold">{error}</div>
      )}

      <label className="block mb-2 font-semibold text-black" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 border border-green-300 rounded mb-4"
        placeholder="Votre email"
      />

      <label className="block mb-2 font-semibold text-black" htmlFor="password">
        Mot de passe
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-2 border border-green-300 rounded mb-6"
        placeholder="Votre mot de passe"
      />

      <button
        type="submit"
        className="w-full bg-green-700 text-white p-3 rounded hover:bg-green-800 transition"
      >
        Se connecter
      </button>
    </form>
  );
}
