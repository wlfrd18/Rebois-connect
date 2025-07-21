// src/components/SignInRedirect.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function SignInRedirect() {
  return (
    <div className="mt-4 text-center">
      <p className="mb-2 text-greenvegetal">Pas encore de compte ?</p>
      <Link
        to="/register"
        className="inline-block px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        S’inscrire
      </Link>
    </div>
  );
}
