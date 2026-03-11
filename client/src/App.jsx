import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Navigate, Route } from 'react-router-dom';
import Login from './components/login/Login';
import Main from './components/Main';
import './App.css'

function App() {
  const [isLogin, setIsLogin] = useState(false);

  const handleLogin = () => {
    setIsLogin(true);
  };

  return (
    <Router>
      <div className="w-full">
        <Routes>
          <Route path='/login' element={isLogin ? (<Navigate to='/' replace />) : (<Login onLogin={handleLogin} />)} />
          <Route path='/' element={isLogin ? (<Main />) : (<Navigate to='/login' />)} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
