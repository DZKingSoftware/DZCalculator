import React, { useState, useRef } from "react";
import html2canvas from 'html2canvas';
import { FaPen, FaCheck, FaXmark, FaDownload, FaCircleXmark, FaX } from 'react-icons/fa6';
import bgImage from '../../assets/background/bg.jpg';
import xIcon from '../../assets/icons/remove.png';
import './checkmodal.css';

function CheckModul({ history, total, onClose }) {
    const checkRef = useRef(null);
    const [rowNames, setRowNames] = useState({});
    const [editingIndex, setEditingIndex] = useState(null);
    const [tempValue, setTempValue] = useState('');

    const downloadCheck = async () => {
        const element = checkRef.current;

        const canvas = await html2canvas(element, {
            backgroundColor: '#fff',
            scale: 2,
            logging: false,
            useCORS: true
        });

        const data = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = data;
        link.download = `Check-${new Date().getTime()}.png`;
        link.click();
    }

    const startEditing = (index, currentName) => {
        setEditingIndex(index);
        setTempValue(currentName) || '';
    };

    const saveName = (index) => {
        setRowNames({ ...rowNames, [index]: tempValue });
        setEditingIndex(null);
    };

    return (
        <div className="fixed z-[105] w-full h-screen inset-0 bg-no-repeat bg-center" style={{ background: `url(${bgImage})`, backgroundSize: 'cover' }}>
            <div className="flex items-center flex-col md:bg-black/30 h-screen md:backdrop-blur-2xl justify-center bg-black/70 md:text-lg text-sm" style={{ padding: '10px' }}>
                <div
                    ref={checkRef}
                    className="bg-green-800/70 text-white xl:w-3xl md:w-2xl"
                    style={{
                        padding: '10px'
                    }}
                >
                    <div>
                        <p className="font-bold">Sana: {new Date().toLocaleString()}</p>
                        <h1 className="font-bold">Check</h1>
                        <p className="font-bold">ID: {Math.floor(Math.random() * 10000)}</p>
                    </div>
                    <table className="w-full table-fixed">
                        <thead className="">
                            <tr className="border-b-1">
                                <th className="w-[10%] text-left">#</th>
                                <th className="w-[40%] text-left">Nomi</th>
                                <th className="w-[30%] text-right">Soni, Narxi</th>
                                <th className="w-[20%] text-right">Jami</th>
                            </tr>
                        </thead>
                        {history.length === 0 ? (
                            <div className="text-center flex items-center absolute top-10 left-[50%] translate-x-[-50%] bg-white text-black font-bold md:text-lg text-sm rounded-lg" style={{ padding: '5px 20px' }}>Check Tarixi Yo'q.. <img src={xIcon} style={{ margin: '0 0 0 10px' }} width={25} alt="" /></div>
                        ) : (
                            <tbody className="font-bold">
                                {history.map((item, index) => (
                                    <tr key={index} className="border-b-2 text-start">
                                        <td className="text-left">{index + 1}</td>
                                        <td className="text-left">
                                            {editingIndex === index ? (
                                                <div className="flex items-center">
                                                    <input
                                                        className="w-[70%] border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 md:text-lg md:font-bold text-sm"
                                                        type="text"
                                                        autoFocus
                                                        value={tempValue}
                                                        onChange={(e) => setTempValue(e.target.value)}
                                                    />
                                                    <button className="icons-btn" onClick={() => saveName(index)} ><FaCheck className="icons-style" /></button>
                                                    <button className="icons-btn" onClick={() => setEditingIndex(null)}><FaXmark className="icons-style" /></button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center group">
                                                    <span>{rowNames[index] || 'Nomlanmagan'}</span>
                                                    <button
                                                        className="icons-btn ic"
                                                        onClick={() => {
                                                            setEditingIndex(index);
                                                            setTempValue(rowNames[index] || '')
                                                        }}
                                                    ><FaPen className="icons-style" /></button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="text-right">{item.operation}</td>
                                        <td className="text-right">{String(item.res).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                    <div className="flex items-center" style={{ margin: '10px 0' }}>
                        <span className="font-bold">Jami:</span>
                        <span className="font-bold md:text-2xl text-sm" style={{ margin: '0 0 0 5px' }}>{total}</span>
                    </div>
                </div>
                <div className="flex gap-2 items-center" style={{ margin: '10px 0' }}>
                    <button
                        className="border-2 border-transparent hover:border-yellow-300"
                        onClick={downloadCheck}
                    ><FaDownload className="text-yellow-300 text-xl" /></button>
                    <button
                        className="border-2 border-transparent hover:border-red-500"
                        onClick={onClose}
                    ><FaX className="text-red-500 text-xl" /></button>
                </div>
            </div>
        </div>
    )
};

export default CheckModul;