import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import bgImage from '../assets/background/bgMain.jpg';
import Calculator from "./calculator/Calculator";
import History from "./history/History";
import TimerDisplay from "./timer/timer";
import CheckModul from "./checkmodule/checkmodal";
import timeUp from '../assets/icons/remove.png';

function Main() {
    const [showList, setShowList] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [showCheck, setShowCheck] = useState(false);
    const [isTimer, setIsTimer] = useState('');
    const [swipedRow, setSwipedRow] = useState(null);
    const [notification, setNotification] = useState([]);
    const [history, setHistory] = useState(() => {
        const savedHistory = localStorage.getItem('calculatorHistory');
        return savedHistory ? JSON.parse(savedHistory) : [];
    });
    const [rowNames, setRowNames] = useState(() => {
        const saved = localStorage.getItem('rowNames');
        return saved ? JSON.parse(saved) : {};
    });

    const addToHistory = (a, b, op, res) => {
        if (isRecording !== 'Error') {
            const newItem = {
                id: Date.now(),
                operation: `${a} ${op} ${b}`,
                res: res
            };

            const newHistory = [newItem, ...history];

            setHistory(newHistory);

            localStorage.setItem('calculatorHistory', JSON.stringify(newHistory));
        };
    };

    const deleteFromHistory = (itemToDelete) => {
        const newHistory = history.filter((item) => item.id !== itemToDelete.id);
        setHistory(newHistory);
        localStorage.setItem('calculatorHistory', JSON.stringify(newHistory));

        const newNames = { ...rowNames };
        delete newNames[itemToDelete.id];
        setRowNames(newNames);
        localStorage.setItem('rowNames', JSON.stringify(newNames));

        setSwipedRow(null);
    };

    const clearHistory = () => {
        localStorage.removeItem('calculatorHistory');
        setHistory([]);
    };

    const saveName = (id, newName) => {
        const newNames = { ...rowNames, [id]: newName };
        setRowNames(newNames);
        localStorage.setItem('rowNames', JSON.stringify(newNames));
    }

    const total = history.reduce((acc, item) => acc + Number(item.res), 0);

    const formattedTotal = String(total).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    const addNotification = (msg) => {
        const id = Date.now();
        const newNotification = { id, msg };
        setNotification((prev) => [...prev, newNotification]);

        setTimeout(() => {
            setNotification((prev) => prev.filter((n) => n.id !== id));
        }, 2000);
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if(innerWidth < 678) return;
            if (e.key === 'CapsLock') {
                const newState = !isRecording;

                setIsRecording(newState);

                const msg = newState ? 'Recording Started' : 'Recording Stopped';
                addNotification(msg);
            } else if(e.key === 'h' || e.key === 'H') {
                setShowList((prev) => !prev);
            } else if (e.key === ' ') {
                clearHistory();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isRecording, setIsRecording]);

    return (
        <div className="w-full h-screen"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}>
            <div
                className="w-full h-screen md:backdrop-blur-[30px] md:[-webkit-backdrop-filter:blur(30px)] [-webkit-backdrop-filter:blur(none)] backdrop-blur-none md:bg-[#00000034] bg-[#00000070]">
                <div
                    className={`fixed ease-in-out bg-white z-[10000] font-bold transition-all duration-500 border left-1/2 -translate-x-1/2 ${isTimer === '00:00:00' ? 'opacity-100 top-10' : 'opacity-0 -top-30'}`}
                    style={{ padding: '7px 20px', borderRadius: '10px', }}
                >
                    <div className="flex items-center">Your Time is Up <img src={timeUp} style={{ margin: '0 0 0 5px' }} width={25} alt="" /></div>
                </div>
                <div
                    className={`fixed z-[202] md:w-[100px] w-fit text-center md:text-lg text-sm font-bold md:top-10 md:left-10 top-5 left-5 rounded-lg
                            ${isTimer <= "00:00:59" ? 'bg-red-400' : 'bg-green-400'}`}
                    style={{ padding: '10px' }}
                >
                    <TimerDisplay setIsTimer={setIsTimer} />
                </div>
                <AnimatePresence>
                    {notification.map((n) => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, y: -70 }}
                            animate={{ opacity: 1, y: 40 }}
                            exit={{ opacity: 0, y: -70 }}
                            style={{ padding: '7px 20px', borderRadius: '10px' }}
                            className="fixed z-[110] bg-white font-bold text-black left-[50%] -translate-x-[50%]"
                        >
                            {n.msg}
                        </motion.div>
                    ))}
                </AnimatePresence>
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
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <History
                                history={history}
                                total={formattedTotal}
                                isRecording={isRecording}
                                setIsRecording={setIsRecording}
                                toggleList={() => setShowList(!showList)}
                                clearHistory={clearHistory}
                                openCheck={() => setShowCheck(true)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <div>
                    {showCheck && (
                        <CheckModul
                            history={history}
                            total={formattedTotal}
                            onClose={() => setShowCheck(false)}
                            onDelete={deleteFromHistory}
                            swipedRow={swipedRow}
                            setSwipedRow={setSwipedRow}
                            saveName={saveName}
                            rowNames={rowNames}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Main;