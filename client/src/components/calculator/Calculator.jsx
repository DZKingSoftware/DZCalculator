import React, { useState } from "react";
import { RxDotFilled } from 'react-icons/rx';
import { FaDeleteLeft } from 'react-icons/fa6';
import { FaXmark } from "react-icons/fa6";
import { TiDivideOutline } from 'react-icons/ti';
import { TiPlusOutline } from "react-icons/ti";
import { TiMinusOutline } from 'react-icons/ti';
import { FaEquals } from "react-icons/fa6";
import './calculator.css';

function Calculator() {
    const [display, setDisplay] = useState('0');
    const [prevValue, setPrevValue] = useState(null);
    const [operator, setOperator] = useState(null);
    const [waitingForOperad, setWaitingForOperad] = useState(false);

    const handleNumber = (num) => {
        if (waitingForOperad) {
            setDisplay(String(num));
            setWaitingForOperad(false);
        } else {
            setDisplay(display === '0' ? String(num) : display + num);
        }
    };

    const handleDecimal = () => {
        if (waitingForOperad) {
            setDisplay('0.');
            setWaitingForOperad(false);
        } else if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const handleOperator = (op) => {
        const inputValue = parseFloat(display);

        if (prevValue === null) {
            setPrevValue(inputValue);
        } else if (operator) {
            const result = calculate(prevValue, inputValue, operator);
            setDisplay(String(result));
            setPrevValue(result);
        }

        setOperator(op);
        setWaitingForOperad(true);
    };

    const calculate = (a, b, op) => {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b !== 0 ? a / b : 'Error';
            default: return b;
        }
    };

    const handleEqual = () => {
        if (operator && prevValue !== null) {
            const inputValue = parseFloat(display);
            const result = calculate(prevValue, inputValue, operator);
            setDisplay(String(result));

            setPrevValue(null);
            setOperator(null);
            setWaitingForOperad(true);
        }
    };

    const handleClear = () => {
        setDisplay('0');
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperad(false);
    };

    const handleDelete = () => {
        if (display.length > 1) {
            setDisplay(display.slice(0, -1));
        } else {
            setDisplay('0');
        }
    };

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className="rounded-xl"
                style={{
                    backdropFilter: 'blur(30px)',
                    backgroundColor: '#00ff005',
                    padding: '10px'
                }}
            >
                <div className="w-full font-bold text-4xl text-yellow-300 h-15 flex items-center rounded-t-xl"
                    style={{
                        padding: '5px 10px',
                        backgroundColor: '#fff1'
                    }}
                >
                    {display}
                </div>
                <div className="flex md:w-auto w-full">
                    <div className="md:w-xl w-full grid grid-cols-3 gap-4" style={{ margin: '10px 0 0 0' }}>
                        <button style={{ backgroundColor: '#630B0B', color: 'white', border: '2px solid orange' }} onClick={handleClear}>C</button>
                        <button style={{ backgroundColor: '#DE7E43', border: '2px solid yellow', color: 'white' }} onClick={handleDelete}><FaDeleteLeft /></button>
                        <button className="operators" onClick={() => handleOperator('/')}><TiDivideOutline /></button>

                        <button className="number-cal" onClick={() => handleNumber('7')}>7</button>
                        <button className="number-cal" onClick={() => handleNumber('8')}>8</button>
                        <button className="number-cal" onClick={() => handleNumber('9')}>9</button>

                        <button className="number-cal" onClick={() => handleNumber('4')}>4</button>
                        <button className="number-cal" onClick={() => handleNumber('5')}>5</button>
                        <button className="number-cal" onClick={() => handleNumber('6')}>6</button>

                        <button className="number-cal" onClick={() => handleNumber('1')}>1</button>
                        <button className="number-cal" onClick={() => handleNumber('2')}>2</button>
                        <button className="number-cal" onClick={() => handleNumber('3')}>3</button>

                        <button className="number-cal" onClick={() => handleNumber('0')}>0</button>
                        <button className="number-cal" onClick={handleDecimal}><RxDotFilled /></button>
                        <button style={{ backgroundColor: '#E1FA00', border: '2px solid lime', color: 'green' }} onClick={handleEqual}><FaEquals /></button>
                    </div>
                    <div className="w-30 grid grid-cols-1 gap-4 md:h-auto"
                        style={{ margin: '10px 0 0 10px' }}
                    >
                        <button className="operators" onClick={() => handleOperator('*')}><FaXmark /></button>
                        <button className="operators" onClick={() => handleOperator('-')}><TiMinusOutline /></button>
                        <button className="operators" onClick={() => handleOperator('+')}><TiPlusOutline /></button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Calculator;