import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Navigate, Route } from 'react-router-dom';
import Login from './components/login/Login';
import Main from './components/Main';
import Spinner from './components/spinner/Spinner';
import './App.css'

function App() {
  const [isLogin, setIsLogin] = useState(() => {
    return localStorage.getItem('isLogin') === 'true';
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isFadeOut, setIsFadeOut] = useState(false);

  const handleLogin = () => {
    setIsLogin(true);
    localStorage.setItem('isLogin', 'true')
  };

  useEffect(() => {
    const handleLoad = () => {
      setIsFadeOut(true);
      setTimeout(() => setIsLoading(false), 1000);
    };

    if (document.readyState === 'complete') {
      setIsLoading(false);
    } else {
      window.addEventListener('load', handleLoad);
    }
  }, []);

  if(isLoading) {
    return <Spinner isFadeOut={isFadeOut} />
  }

  return (
    <Router>
      <div className="w-full">
        <Routes>
          <Route path='/login' element={isLogin ? (<Navigate to='/' replace />) : (<Login onLogin={handleLogin} />)} />
          <Route path='/' element={isLogin ? (<Main />) : (<Navigate to='/login' />)} />
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
