import React from 'react';
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Register from './pages/Register';
import Activation from './pages/Activation';
import Login2FA from './pages/Login2FA';
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activate/:token" element={<Activation />} />
        <Route path="/login/2fa" element={<Login2FA />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
  );
};

export default App;
