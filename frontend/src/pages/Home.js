import React from "react";
import LoginForm from "./LoginForm";
import SignInRedirect from "../components/SignInRedirect";
import { FaHandsHelping } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { RiShieldCheckLine } from "react-icons/ri";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="p-4 text-greenvegetal font-bold text-2xl border-b border-green-300">
        Rebois-Connect
      </header>

      <main className="flex flex-grow">
        {/* Section À propos avec fond et cartes */}
        <section
          className="flex-1 p-8 bg-green-50 text-greenvegetal relative"
          style={{
            backgroundImage: `url("/homepage.png")`, // copie l’image dans /public/images/
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md">
            <h2 className="text-4xl font-bold mb-4">À propos de Rebois-Connect</h2>
            <p>
              Rebois-Connect est une plateforme collaborative visant à reboiser
              les territoires en impliquant volontaires, mécènes et structures
              techniques pour un impact environnemental durable.
            </p>
          </div>

          {/* Cartes */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Volontaires */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <FaHandsHelping className="text-3xl text-greenvegetal mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Volontaires</h3>
              <p>
                Proposez vos terrains pour des projets de reboisement et
                participez à la reforestation.
              </p>
            </div>

            {/* Mécènes */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <GiReceiveMoney className="text-3xl text-greenvegetal mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Mécènes</h3>
              <p>
                Financez des projets vérifiés et suivez votre impact
                environnemental en temps réel.
              </p>
            </div>

            {/* Structures techniques */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <RiShieldCheckLine className="text-3xl text-greenvegetal mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Structures techniques</h3>
              <p>
                Accompagnez les projets sur le terrain et assurez leur réussite
                technique.
              </p>
            </div>
          </div>
        </section>

        {/* Connexion */}
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
