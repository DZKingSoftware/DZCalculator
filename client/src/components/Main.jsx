import React, { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import bgImage from '../assets/background/bgMain.jpg';
import Calculator from "./calculator/Calculator";
import History from "./history/History";
import TimerDisplay from "./timer/timer";
import timeUp from '../assets/icons/remove.png';
import './Main.css';

function Main() {
    const [history, setHistory] = useState([]);
    const [showList, setShowList] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isTimer, setIsTimer] = useState('');

    const addToHistory = (a, b, op, res) => {
        if (isRecording !== 'Error') {
            const newItem = {
                operation: `${a} ${op} ${b}`,
                res: res
            }
            setHistory(prev => [newItem, ...prev]);
        };
    };

    const clearHistory = () => {
        setHistory([]);
    }

    const total = history.reduce((acc, item) => acc + Number(item.res), 0);

    return (
        <div className="w-full h-screen"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}>
            <div
                className="w-full h-screen"
                style={{
                    backgroundColor: '#00000034',
                    backdropFilter: 'blur(40px)'
                }}>
                <div
                    className={`fixed ease-in-out bg-white z-[104] font-bold transition-all duration-500 border left-1/2 -translate-x-1/2 ${isTimer === '00:00:00' ? 'opacity-100 top-10' : 'opacity-0 -top-30'}`}
                    style={{ padding: '7px 20px', borderRadius: '10px', }}
                >
                    <div className="flex items-center">Your Time is Up <img src={timeUp} style={{ margin: '0 0 0 5px' }} width={25} alt="" /></div>
                </div>
                <div
                    className={`fixed z-[102] md:w-[100px] w-fit text-center md:text-lg text-sm font-bold md:top-10 md:left-10 top-5 left-5 rounded-lg
                            ${isTimer <= "00:00:59" ? 'bg-red-400' : 'bg-green-400'}`}
                    style={{ padding: '10px' }}
                >
                    <TimerDisplay setIsTimer={setIsTimer} />
                </div>
                <Calculator
                    addToHistory={addToHistory}
                    toggleList={() => setShowList(!showList)}
                    showList={showList}
                    isRecording={isRecording}
                />
                <AnimatePresence mode="wait">
                    {showList && (
                        <motion.div
                            className=""
                            key='historyPanel'
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <History
                                history={history}
                                total={total}
                                isRecording={isRecording}
                                setIsRecording={setIsRecording}
                                toggleList={() => setShowList(!showList)}
                                clearHistory={clearHistory}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Main;