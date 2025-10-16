
import React, { useState, useCallback } from 'react';
import { AppView, Level, VocabularyData, WordData } from './types';
import Header from './components/Header';
import BackgroundEffects from './components/BackgroundEffects';
import LevelSelector from './components/LevelSelector';
import InputArea from './components/InputArea';
import LoadingSpinner from './components/LoadingSpinner';
import ResultsDisplay from './components/ResultsDisplay';
import Quiz from './components/Quiz';
import ErrorMessage from './components/ErrorMessage';
import { extractTextFromImage, analyzeText, getTextToSpeech } from './services/geminiService';
import { extractTextFromPdf } from './services/pdfService';
import WordModal from './components/WordModal';

const App: React.FC = () => {
    const [view, setView] = useState<AppView>(AppView.LEVEL_SELECT);
    const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
    const [vocabularyData, setVocabularyData] = useState<VocabularyData | null>(null);
    const [loadingText, setLoadingText] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [selectedWord, setSelectedWord] = useState<WordData | null>(null);

    const handleError = useCallback((message: string) => {
        console.error(message);
        setErrorMessage(message);
        setView(AppView.INPUT); 
        setTimeout(() => setErrorMessage(''), 4000);
    }, []);

    const handleLevelSelect = (level: Level) => {
        setSelectedLevel(level);
        setView(AppView.INPUT);
    };

    const startProcessing = async (textPromise: Promise<string | null>) => {
        setView(AppView.LOADING);
        try {
            const extractedText = await textPromise;
            if (!extractedText || extractedText.trim().length === 0) {
                handleError("متنی برای تحلیل یافت نشد.");
                return;
            }
            setLoadingText("هوش مصنوعی در حال تحلیل متن و استخراج واژگان است...");
            const analysisResult = await analyzeText(extractedText);
            setVocabularyData(analysisResult);
            setView(AppView.RESULTS);
        } catch (error) {
            handleError(error instanceof Error ? error.message : "خطای ناشناخته‌ای رخ داد.");
            handleReset();
        }
    };
    
    const handleProcessText = (text: string) => {
        setLoadingText("در حال آماده‌سازی متن...");
        startProcessing(Promise.resolve(text));
    };

    const handleProcessImage = (file: File) => {
        setLoadingText("در حال تبدیل تصویر به متن...");
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = (reader.result as string).split(',')[1];
            startProcessing(extractTextFromImage(base64Data));
        };
        reader.onerror = () => handleError("خطا در خواندن فایل تصویر.");
        reader.readAsDataURL(file);
    };

    const handleProcessPdf = (file: File, startPage: number, endPage: number) => {
        setLoadingText("در حال استخراج متن از PDF...");
        startProcessing(extractTextFromPdf(file, startPage, endPage));
    };

    const handleStartQuiz = () => {
        setView(AppView.QUIZ);
    };
    
    const handleQuizEnd = () => {
        setView(AppView.RESULTS);
    };

    const handleReset = () => {
        setView(AppView.LEVEL_SELECT);
        setSelectedLevel(null);
        setVocabularyData(null);
        setLoadingText('');
        setErrorMessage('');
        setSelectedWord(null);
    };

    const allWords = vocabularyData ? Object.values(vocabularyData).flat() : [];

    return (
        <div className="min-h-screen">
            <BackgroundEffects showFallingItems={view === AppView.LEVEL_SELECT} />
            <Header />
            <main className="container mx-auto p-4 md:pb-16 max-w-5xl">
                <div className="glass-card p-6 fade-in">
                    {view === AppView.LEVEL_SELECT && <LevelSelector onSelectLevel={handleLevelSelect} />}
                    {view === AppView.INPUT && (
                        <InputArea 
                            onProcessText={handleProcessText}
                            onProcessImage={handleProcessImage}
                            onProcessPdf={handleProcessPdf}
                            onError={handleError}
                        />
                    )}
                    {view === AppView.LOADING && <LoadingSpinner text={loadingText} />}
                    {view === AppView.RESULTS && vocabularyData && selectedLevel && (
                        <ResultsDisplay 
                            vocabularyData={vocabularyData} 
                            initialLevel={selectedLevel}
                            onStartQuiz={handleStartQuiz}
                            onReset={handleReset}
                            onWordSelect={setSelectedWord}
                        />
                    )}
                    {view === AppView.QUIZ && <Quiz words={allWords} onQuizEnd={handleQuizEnd} />}
                </div>
            </main>
            <footer className="text-center py-6 text-slate-500 text-sm">
                <p>تقدیم به شیوا فتاحی</p>
            </footer>
            {errorMessage && <ErrorMessage message={errorMessage} />}
            {selectedWord && (
                <WordModal 
                    wordData={selectedWord} 
                    onClose={() => setSelectedWord(null)}
                    getAudio={getTextToSpeech}
                />
            )}
        </div>
    );
};

export default App;
