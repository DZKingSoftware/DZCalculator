import React, { useState, useEffect } from "react";
import bgImage from '../assets/background/bgMain.jpg';
import Calculator from "./calculator/Calculator";
import History from "./history/History";

function Main({ userName }) {
    const [history, setHistory] = useState([]);
    const [showList, setShowList] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

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
                        <Calculator 
                            addToHistory={addToHistory}
                            toggleList={() => setShowList(!showList)}
                            showList={showList}
                            isRecording={isRecording}
                        />
                        {showList && (
                            <History 
                                history={history}
                                total={total}
                                isRecording={isRecording}
                                setIsRecording={setIsRecording}
                                toggleList={() => setShowList(!showList)}
                                clearHistory={clearHistory}
                            />
                        )}
                </div>
        </div>
    )
}

export default Main;