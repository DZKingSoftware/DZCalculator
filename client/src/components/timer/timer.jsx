import React, { useState, useEffect } from "react";

function TimerDisplay({ setIsTimer }) {
    const [timer, setTimer] = useState('');
    const [isExpiring, setIsExpiring] = useState(false);

    useEffect(() => {
        const expiryDate = localStorage.getItem('expiresAt');
        if (!expiryDate) return;

        const intervalId = setInterval(() => {
            const now = new Date().getTime();
            const expiration = new Date(expiryDate).getTime();
            const distance = expiration - now;

            if (distance <= 0) {
                clearInterval(timer);
                setTimer('00:00:00');
                setIsExpiring(true);

                setTimeout(() => {
                    window.location.reload();
                }, 1700);
            } else {
                const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((distance % (1000 * 60)) / 1000);

                const f = (n) => n < 10 ? `0${n}` : n;
                const alarm = `${f(h)}:${f(m)}:${f(s)}`;

                setTimer(alarm)

                if (setIsTimer) {
                    setIsTimer(alarm)
                }
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <div className={`${timer <= "00:00:59" ? "text-black" : "text-white"}`}>{timer || `00:00:00`}</div>
    )
}

export default TimerDisplay;