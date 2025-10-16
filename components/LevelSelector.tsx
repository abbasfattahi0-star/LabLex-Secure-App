
import React from 'react';
import { Level } from '../types';

interface LevelSelectorProps {
    onSelectLevel: (level: Level) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelectLevel }) => {
    return (
        <div id="level-selection-screen" className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-slate-100 shimmer">شروع یادگیری</h2>
            <p className="text-slate-400 mb-8">ابتدا سطح مورد نظر خود را برای شروع انتخاب کنید:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <button onClick={() => onSelectLevel('مقدماتی')} className="btn-level bg-gradient-to-br from-green-400 to-green-600 text-white font-bold py-10 px-4 rounded-2xl shadow-lg text-2xl pulse-glow">
                    <div className="flex flex-col items-center">
                        <span>مقدماتی</span>
                        <span className="text-sm mt-2 opacity-80">برای تازه‌کارها</span>
                    </div>
                </button>
                <button onClick={() => onSelectLevel('متوسط')} className="btn-level bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold py-10 px-4 rounded-2xl shadow-lg text-2xl pulse-glow" style={{animationDelay: '0.5s'}}>
                    <div className="flex flex-col items-center">
                        <span>متوسط</span>
                        <span className="text-sm mt-2 opacity-80">برای یادگیرندگان فعال</span>
                    </div>
                </button>
                <button onClick={() => onSelectLevel('پیشرفته')} className="btn-level bg-gradient-to-br from-purple-500 to-purple-700 text-white font-bold py-10 px-4 rounded-2xl shadow-lg text-2xl pulse-glow" style={{animationDelay: '1s'}}>
                    <div className="flex flex-col items-center">
                        <span>پیشرفته</span>
                        <span className="text-sm mt-2 opacity-80">برای حرفه‌ای‌ها</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default LevelSelector;
