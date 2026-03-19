import React from "react";
import { motion } from "framer-motion";
import { FaXmark } from "react-icons/fa6";
import './history.css';

function History({ total, history, isRecording, setIsRecording, toggleList, clearHistory }) {
    return (
        <div className="bg-black/20 w-full h-screen flex justify-center items-center fixed inset-0 z-[100] backdrop-blur-sm" style={{ padding: '10px' }}>
            <motion.div initial={{ maxHeight: 0 }} animate={{ maxHeight: 700 }} transition={{ duration: 0.6, ease: 'easeInOut' }} className="relative bg-green-800/60 md:w-lg w-full md:max-h-170 md:h-170 h-110 min-h-70 flex flex-col overflow-hidden rounded-md" style={{ padding: '10px' }}>
                <div className="flex justify-between items-center" style={{ padding: '5px 0' }}>
                    <h1 className="text-yellow-300 md:text-3xl text-lg font-bold" style={{ margin: '0 0 10px 0' }}>Hisob Kitob Tarixi</h1>

                    <button onClick={toggleList} className="border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white"><FaXmark /></button>
                </div>
                <div className=" text-white">
                    {history.length === 0 ? (
                        <div className="flex justify-center items-center">
                            <h1 className="font-bold text-yellow-500 md:text-2xl text-lg">Hisob Tarixi Yo'q...</h1>
                        </div>
                    ) : (
                        <div className="table-con max-h-75 md:max-h-135 min-h-60">
                            <table className="w-full text-left table-fixed font-bold md:text-lg text-sm border-collapse overflow-hidden">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Amal</th>
                                        <th>Natija</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-yellow-500/50">
                                    {history.map((item, index) => (
                                        <tr className="bg-green-800 border-t-2 border-yellow-500" key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.operation}</td>
                                            <td>{item.res}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div className="absolute flex justify-between items-center w-full left-0 right-0 bottom-2 z-[101]" style={{ padding: '0 10px' }}>
                    <div className="flex flex-col text-white">
                        <span className="text-sm font-bold text-yellow-300">Jami Natija:</span>
                        <span className="md:text-xl text-sm font-bold">{total}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={clearHistory}
                            className="border-2 border-red-500 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white"
                        >Clear</button>
                        <button
                            onClick={() => setIsRecording(!isRecording)}
                            className={`border-2 font-bold rounded-md ${isRecording ? 'border-red-700 text-red-500 hover:bg-red-500 hover:text-white' : 'border-yellow-300 text-green-300 hover:bg-green-400 hover:text-yellow-300'}`}
                        >{isRecording ? 'STOP' : 'START'}</button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default History;