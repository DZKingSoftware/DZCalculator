import React from 'react';
import './spinner.css'

function Spinner({ isFadeOut }) {
    return (
        <div className={`cont-spinner w-full h-screen fixed inset-0 flex justify-center items-center ${isFadeOut ? 'fade-out' : ''}`}>
            <div className="loader"></div>
        </div>
    )
}

export default Spinner;