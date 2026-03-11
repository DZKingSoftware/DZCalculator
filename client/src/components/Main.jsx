import React from "react";
import bgImage from '../assets/background/bgMain.jpg';
import Calculator from "./calculator/Calculator";

function Main() {
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
                        <Calculator />
                </div>
        </div>
    )
}

export default Main;