import React from 'react';
import './spinner.css'

function Spinner() {
    return (
        <div className="w-full h-screen fixed inset-0 z-99">
            <div className="loader"></div>
        </div>
    )
}

export default Spinner;