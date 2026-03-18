import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Navigate, Route } from 'react-router-dom';
import Login from './components/login/Login';
import Main from './components/Main';
import Spinner from './components/spinner/Spinner';
import './App.css'

function App() {
  const [isLogin, setIsLogin] = useState(() => {
    return !!localStorage.getItem('token')
  });
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFadeOut, setIsFadeOut] = useState(false);

  const handleLogin = (name) => {
    setUserName(name)
    setIsLogin(true);
  };

  useEffect(() => {
    const checkTokenExpiry = () => {
      const expiresAt = localStorage.getItem('expiresAt');
      const token = localStorage.getItem('token');

      if (token && expiresAt) {
        const now = new Date().getTime();
        const expiryTime = new Date(expiresAt).getTime() + 2000;

        if (now >= expiryTime) {
          console.warn("Vaqt Tugadi...");
          localStorage.clear();
          setIsLogin(false);
        }
      }
    };

    checkTokenExpiry();

    const interval = setInterval(checkTokenExpiry, 10000);

    return () => clearInterval(interval);
  }, [isLogin])

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

  if (isLoading) {
    return <Spinner isFadeOut={isFadeOut} />;
  }

  return (
    <Router>
      <div className="w-full">
        <Routes>
          {/* <Route path='/login' element={isLogin ? (<Navigate to='/' replace />) : (<Login onLogin={handleLogin} />)} />
          <Route path='/' element={isLogin ? (<Main />) : (<Navigate to='/login' />)} />
          <Route path='*' element={<Navigate to='/login' replace />} /> */}
          <Route path='/' element={<Main />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
