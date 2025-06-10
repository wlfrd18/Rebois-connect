import React from "react";
import LoginForm from "../components/LoginForm";
import SignInRedirect from "../components/SignInRedirect";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="p-4 text-greenvegetal font-bold text-2xl border-b border-green-300">
        Rebois-Connect
      </header>

      <main className="flex flex-grow">
        {/* About Us */}
        <section className="flex-1 p-8 bg-green-50 text-greenvegetal">
          <h2 className="text-4xl font-bold mb-4">À propos de Rebois-Connect</h2>
          <p>
            Rebois-Connect est une plateforme collaborative visant à reboiser
            les territoires en impliquant volontaires, mécènes et structures
            techniques pour un impact environnemental durable.
          </p>
          {/* Ajoute ici un contenu plus détaillé si besoin */}
        </section>

        {/* Login + Sign In */}
        <section className="flex-1 p-8 max-w-md mx-auto">
          <LoginForm />
          <SignInRedirect />
        </section>
      </main>

      <footer className="p-6 bg-green-100 text-greenvegetal text-center">
        <h3 className="font-semibold text-xl mb-2">Contactez-nous</h3>
        <p>Email : reboisconnect@gmail.com</p>
        <p>Téléphone : +33 7 84 74 29 71</p>
      </footer>
    </div>
  );
}
