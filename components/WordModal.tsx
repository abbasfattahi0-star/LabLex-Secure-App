
import React, { useState, useEffect } from 'react';
import { WordData } from '../types';

interface WordModalProps {
    wordData: WordData;
    onClose: () => void;
    getAudio: (word: string) => Promise<{ audioData: string, mimeType: string }>;
}

const WordModal: React.FC<WordModalProps> = ({ wordData, onClose, getAudio }) => {
    const [visible, setVisible] = useState(false);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    
    useEffect(() => {
        setVisible(true);
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const base64ToArrayBuffer = (base64: string) => {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    };

    const pcmToWav = (pcmData: Int16Array, numChannels: number, sampleRate: number) => {
        const buffer = new ArrayBuffer(44 + pcmData.length * 2);
        const view = new DataView(buffer);
        const writeString = (view: DataView, offset: number, string: string) => { for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i)); };
        const blockAlign = numChannels * 2;
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + pcmData.length * 2, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * blockAlign, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, pcmData.length * 2, true);
        for (let i = 0; i < pcmData.length; i++) view.setInt16(44 + i * 2, pcmData[i], true);
        return new Blob([view], { type: 'audio/wav' });
    };

    const playPronunciation = async () => {
        setIsAudioLoading(true);
        try {
            const { audioData, mimeType } = await getAudio(wordData.word);
            if (audioData && mimeType.startsWith("audio/")) {
                const sampleRateMatch = mimeType.match(/rate=(\d+)/);
                const sampleRate = sampleRateMatch ? parseInt(sampleRateMatch[1], 10) : 24000;
                const pcm16 = new Int16Array(base64ToArrayBuffer(audioData));
                const wavBlob = pcmToWav(pcm16, 1, sampleRate);
                const audioUrl = URL.createObjectURL(wavBlob);
                new Audio(audioUrl).play();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsAudioLoading(false);
        }
    };
    
    return (
        <div className={`modal fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={handleClose}>
            <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-teal-400">{wordData.word}</h2>
                        <p className="text-lg text-slate-400 mt-1">{wordData.pronunciation} - {wordData.literalMeaning}</p>
                    </div>
                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-100 text-3xl">&times;</button>
                </div>
                <div className="flex items-center mb-6">
                    <button id="play-audio-btn" onClick={playPronunciation} disabled={isAudioLoading} className="p-2 rounded-full hover:bg-slate-700 transition disabled:opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    </button>
                    {isAudioLoading && <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-teal-500 ml-3"></div>}
                </div>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-lg text-slate-300 border-b-2 border-slate-700 pb-2 mb-2">توضیحات</h3>
                        <p className="text-slate-400 leading-relaxed">{wordData.definition}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-300 border-b-2 border-slate-700 pb-2 mb-2">مثال</h3>
                        <p className="text-slate-200 bg-slate-800/50 p-4 rounded-lg leading-relaxed" style={{direction: 'ltr', textAlign: 'left'}}>{wordData.example}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-300 border-b-2 border-slate-700 pb-2 mb-2">ترجمه مثال</h3>
                        <p className="text-slate-400 bg-slate-800/50 p-4 rounded-lg leading-relaxed">{wordData.exampleTranslation}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WordModal;
