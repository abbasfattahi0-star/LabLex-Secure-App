
import React, { useState, useEffect } from 'react';
import { VocabularyData, Level, WordData } from '../types';

interface ResultsDisplayProps {
    vocabularyData: VocabularyData;
    initialLevel: Level;
    onStartQuiz: () => void;
    onReset: () => void;
    onWordSelect: (wordData: WordData) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ vocabularyData, initialLevel, onStartQuiz, onReset, onWordSelect }) => {
    const [activeTab, setActiveTab] = useState<Level>(initialLevel);

    useEffect(() => {
        // If the initial level has no words, switch to the first level that does.
        if (vocabularyData[initialLevel]?.length === 0) {
            const firstTabWithContent = (Object.keys(vocabularyData) as Level[]).find(l => vocabularyData[l].length > 0);
            if(firstTabWithContent) setActiveTab(firstTabWithContent);
        }
    }, [vocabularyData, initialLevel]);

    const allWords = Object.values(vocabularyData).flat();

    const renderLevelContent = (level: Level) => {
        const words = vocabularyData[level] || [];
        if (words.length === 0) {
            return <p className="text-slate-400 text-center py-8">هیچ واژه‌ای در سطح {level} یافت نشد.</p>;
        }
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {words.map((word, index) => (
                    <button 
                        key={`${level}-${index}`} 
                        className="word-item text-center p-3 rounded-lg shadow-md border" 
                        onClick={() => onWordSelect(word)}>
                        <span className="font-semibold text-slate-200">{word.word.split('(')[0].trim()}</span>
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <button onClick={onReset} className="bg-slate-700 text-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-slate-600 transition">شروع دوباره</button>
            </div>
            
            <div className="flex border-b border-slate-700 mb-4 space-x-2 space-x-reverse">
                {(Object.keys(vocabularyData) as Level[]).map(level => (
                     <button key={level} onClick={() => setActiveTab(level)} className={`tab-btn px-4 py-2 -mb-px border-b-2 font-semibold transition text-slate-400 hover:text-slate-200 ${activeTab === level ? 'active' : 'border-transparent'}`}>
                        {level} ({vocabularyData[level].length})
                     </button>
                ))}
            </div>

            <div className="p-2">
                {renderLevelContent(activeTab)}
            </div>

            <div className="mt-8 text-center">
                {allWords.length >= 4 && (
                    <button onClick={onStartQuiz} className="bg-gradient-to-r from-teal-500 to-teal-700 text-white font-bold py-3 px-8 rounded-lg hover:from-teal-600 hover:to-teal-800 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition text-lg bounce-in">
                        شروع آزمون
                    </button>
                )}
            </div>
        </div>
    );
};

export default ResultsDisplay;
