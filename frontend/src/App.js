import React from 'react';
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Register from './pages/Register';
import Activation from './pages/Activation';
import Login2FA from './pages/Login2FA';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activate/:token" element={<Activation />} />
        <Route path="/login/2fa" element={<Login2FA />} />
      </Routes>
  );
};

export default App;
