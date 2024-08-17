import React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Signup from './auth/Signup';
import WebSocketClient from './components/WebSocketClient';
import PrivateRoute from './auth/PrivateRoute';
import { ToastContainer } from "react-toastify";
import Navbar from './components/Navbar';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<PrivateRoute><WebSocketClient /></PrivateRoute>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </Router>
    <ToastContainer />
    </>
  );
};

export default App;
