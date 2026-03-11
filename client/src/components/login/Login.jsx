import React, { useState, useEffect } from "react";
import bgImge from '../../assets/background/bg.jpg';
import successIcon from '../../assets/icons/check.png';
import errorIcon from '../../assets/icons/remove.png';
import './Login.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showMsg, setShowMsg] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');
        setShowMsg(false);

        if (username.trim() || password.trim()) {
            setSuccess('Login Successful!');
            setShowMsg(true);

            setTimeout(() => {
                onLogin();
            }, 2000);
        } else {
            setError('Invalid username or password');
            setShowMsg(true);
        }
    };
    useEffect(() => {
        if (showMsg && error) {
            const timer = setTimeout(() => {
                setShowMsg(false);
                setError('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showMsg, error]);

    return (
        <div className="min-h-screen w-ful" 
        style={{
            backgroundImage: `url(${bgImge})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        }}>
            <div className="bg-blur w-full h-screen flex flex-col justify-center items-center">
                <h1 className="text-yellow-400 text-3xl font-bold">DZKing Calculeshion</h1>
                <div className={`msg-alert
                bg-white transform duration-500 ease-in-out transition-all fixed border ${showMsg ? 'opacity-100 -translate-y-100' : 'opacity-0 -translate-y-130'
                    }`}>
                    <div className="">
                        {error && (
                            <div className="flex items-center font-bold">
                                {error} <img style={{ margin: '0 0 0 5px' }} width={25} src={errorIcon} alt="Error" />
                            </div>
                        )}

                        {success && (
                            <div className="flex items-center font-bold">{success} <img style={{ margin: '0 0 0 5px' }} width={25} src={successIcon} alt="Success" /></div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="w-2xl">
                    <div>
                        <label className="block text-lg text-green-500 font-medium">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="text-green-500 text-lg bg-black w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            style={{ 
                                padding: '5px 10px',
                             }}
                            placeholder="Username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-lg text-green-500 font-bold">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="text-green-500 bg-black text-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full rounded-lg"
                            style={{ 
                                padding: '5px 10px'
                             }}
                            placeholder="******"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-green-500/70 border-none rounded-xl w-full cursor-pointer text-white font-bold active:scale-1 no-copy"
                        style={{
                            margin: '20px 0 0 0',
                            padding: '7px',
                        }}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;