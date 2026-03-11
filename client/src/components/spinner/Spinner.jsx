import React from 'react';
import './spinner.css'

function Spinner() {
    return (
        <div className="w-full h-screen fixed inset-0 flex justify-center items-center"
            style={{
                zIndex: '999',
                backgroundColor: '#00000018',
                backdropFilter: 'blur(20px)',
            }}
        >
            <div className="loader"></div>
        </div>
    )
}

export default Spinner;