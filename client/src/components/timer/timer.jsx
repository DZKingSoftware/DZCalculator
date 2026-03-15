import React, { useState, useEffect } from "react";

function TimerDisplay() {
    const [timer, setTimer] = useState('');
    const [isExpiring, setIsExpiring] = useState(false);

    useEffect(() => {
        const expiryDate = localStorage.getItem('expiresAt');
        if (!expiryDate) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const expiration = new Date(expiryDate).getTime();
            const distance = expiration - now;

            if (distance <= 0) {
                clearInterval(timer);
                setTimer('00:00:00');
                setIsExpiring(true);

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((distance % (1000 * 60)) / 1000);

                const f = (n) => n < 10 ? `0${n}` : n;
                setTimer(`${f(h)}:${f(m)}:${f(s)}`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [])

    return (
        <div>{timer || `00:00:00`}</div>
    )
}

export default TimerDisplay;