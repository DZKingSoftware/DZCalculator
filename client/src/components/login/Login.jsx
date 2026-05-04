import React, { useState, useEffect } from "react";
import axios from 'axios';
import bgImge from '../../assets/background/bg.jpg';
import successIcon from '../../assets/icons/check.png';
import errorIcon from '../../assets/icons/remove.png';
import { getDeviceId } from "../utils/getDeviceId";
import hangingImg from '../../assets/hanging/hanging.png';
import { FaLock, FaLockOpen, FaUser, FaUserAltSlash } from 'react-icons/fa';
import './login.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showMsg, setShowMsg] = useState(false);
    const [getLogin, setGetLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState({ username: false, password: false });
    const [passwordType, setPasswordType] = useState(false);
    const [userType, setUserType] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');
        setShowMsg(false);
        setIsLoading(true)

        const valueInput = {
            username: !username.trim(),
            password: !password.trim()
        }

        setInputValue(valueInput);

        if (valueInput.username || valueInput.password) {
            return;
        }

        try {
            const deviceId = await getDeviceId();

            const response = await axios.post('https://dzcalculator-production.up.railway.app/api/login', {
                loginToken: username.trim(),
                passwordToken: password.trim(),
                deviceId: deviceId
            });

            if (response.data.success) {
                setSuccess(`Login in Success`);
                setShowMsg(true);

                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userName", response.data.name);
                localStorage.setItem("expiresAt", response.data.expiresAt);
                localStorage.setItem("isLoggedIn", 'true');

                setTimeout(() => {
                    onLogin(response.data.name);
                }, 2000)
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || `Login yoki Parol Noto'g'ri!`
            setError(errorMsg);
            setShowMsg(true);
            setGetLogin(true)
        } finally {
            setIsLoading(false)
        }
    };
    useEffect(() => {
        if (showMsg && error) {
            const timer = setTimeout(() => {
                const errorTime = setTimeout(() => {
                    setShowMsg(false);
                }, 2900);
                return () => clearTimeout(errorTime);
                setError('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showMsg, error]);

    return (
        <div className="min-h-screen w-full"
            style={{
                backgroundImage: `url(${bgImge})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}>
            <div className="bg-blur w-full h-screen flex flex-col justify-center items-center">
                <h1 className="text-yellow-400 text-3xl font-bold uppercase">Calculeshion</h1>
                <div className={`msg-alert
                bg-white transform duration-500 ease-in-out transition-all fixed border ${showMsg ? 'opacity-100 top-10' : 'opacity-0 -top-30'
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

                <form onSubmit={handleSubmit} className="w-[80%] sm:w-2xl gap-y-2 flex flex-col">
                    <div className="log-cont">
                        <label className=" block text-lg text-green-500 font-bold">
                            Username
                        </label>
                        <div className="group flex bg-black rounded-lg focus-within:border-green-500 border-2 border-transparent">
                            <input
                                type={userType ? 'password' : 'text'}
                                value={username}
                                onChange={(e) => { setUsername(e.target.value), setInputValue(prev => ({ ...prev, username: false })) }}
                                className="text-green-500 text-lg bg-black w-full rounded-lg outline-none"
                                style={{
                                    padding: '5px 10px',
                                }}
                                placeholder="Username"
                            />
                            <button className="text-green-500" type="button" onClick={() => setUserType(!userType)}>{userType ? <FaUserAltSlash /> : <FaUser />}</button>
                        </div>
                        {inputValue.username && (
                            <div className="text-red-500 text-sm font-bold text-shadow-xs text-shadow-black">Please Enter Login!</div>
                        )}
                    </div>

                    <div className="log-cont">
                        <label className="block text-lg text-green-500 font-bold">
                            Password
                        </label>
                        <div className={`group flex bg-black rounded-lg border-transparent border-2 focus-within:border-green-500`}>
                            <input
                                type={passwordType ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value), setInputValue(prev => ({ ...prev, password: false })) }}
                                className="text-green-500 bg-transparent text-lg outline-none w-full rounded-lg"
                                style={{
                                    padding: '5px 10px'
                                }}
                                placeholder="******"
                            />
                            <button type="button" onClick={() => setPasswordType(!passwordType)}>{passwordType ? <FaLockOpen className="text-green-500" /> : <FaLock className="text-green-500" />}</button>
                        </div>
                        {inputValue.password && (
                            <div className="text-red-500 text-sm font-bold text-shadow-xs text-shadow-black">Please Enter Password</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-green-500/70 border-none rounded-xl w-full cursor-pointer text-white font-bold active:scale-90 no-copy"
                        style={{
                            margin: '20px 0 0 0',
                            padding: '7px',
                        }}
                    >
                        {!success ? 'Login' : 'Loading...'}
                    </button>
                </form>
                <div className={`hanging fixed left-0 ${getLogin ? '-bottom-20' : '-bottom-200'} ease-in-out`} style={{ backgroundImage: `url(${hangingImg})` }}>
                    {getLogin && (
                        <div className="text-[#2E4F3E] md:text-[15px] text-[10px] w-[340px]">Don’t have a login and password yet? You can get them here! <br /> <a href="https://t.me/dzcalculation_bot"><button className="hanging-btn">Get</button></a></div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Login;