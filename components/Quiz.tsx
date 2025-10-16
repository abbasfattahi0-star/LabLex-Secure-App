
import React, { useState, useEffect, useCallback } from 'react';
import { WordData, QuizQuestion } from '../types';
import { motivationalQuotes } from '../constants';

interface QuizProps {
    words: WordData[];
    onQuizEnd: () => void;
}

const Quiz: React.FC<QuizProps> = ({ words, onQuizEnd }) => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState<QuizQuestion[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isFinished, setIsFinished] = useState(false);
    
    const generateQuiz = useCallback(() => {
        const shuffledWords = [...words].sort(() => 0.5 - Math.random());
        const quizQuestions: QuizQuestion[] = shuffledWords.map((correctWord) => {
            let options = [{ text: correctWord.definition, correct: true }];
            const distractors = words.filter(w => w.word !== correctWord.word).sort(() => 0.5 - Math.random()).slice(0, 3);
            distractors.forEach(d => options.push({ text: d.definition, correct: false }));
            options.sort(() => 0.5 - Math.random());
            return { word: correctWord.word, options, definition: correctWord.definition };
        });
        setQuestions(quizQuestions);
    }, [words]);

    useEffect(() => {
        generateQuiz();
    }, [generateQuiz]);

    const handleAnswerSelect = (optionText: string, isCorrect: boolean) => {
        setSelectedAnswer(optionText);
        if (isCorrect) {
            setScore(prev => prev + 1);
        } else {
            setIncorrectAnswers(prev => [...prev, questions[currentQuestionIndex]]);
        }

        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedAnswer(null);
            } else {
                setIsFinished(true);
            }
        }, 1500);
    };
    
    const restartQuiz = () => {
        setIsFinished(false);
        setScore(0);
        setCurrentQuestionIndex(0);
        setIncorrectAnswers([]);
        setSelectedAnswer(null);
        generateQuiz();
    };

    const renderQuizQuestion = () => {
        if (questions.length === 0) return <p>در حال آماده‌سازی آزمون...</p>;
        const question = questions[currentQuestionIndex];
        return (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-100">آزمون لغات</h2>
                    <p className="text-slate-300 font-semibold">سوال {currentQuestionIndex + 1} از {questions.length}</p>
                </div>
                <p className="text-2xl font-semibold my-6 text-center text-slate-100">کدام گزینه معنی صحیح کلمه "{question.word}" است؟</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options.map((option, index) => {
                        let buttonClass = 'quiz-option text-right w-full p-4 rounded-lg border-2 font-medium';
                        if (selectedAnswer) {
                            if (option.correct) buttonClass += ' correct';
                            else if (selectedAnswer === option.text) buttonClass += ' incorrect';
                        }
                        return (
                            <button key={index} onClick={() => handleAnswerSelect(option.text, option.correct)} disabled={!!selectedAnswer} className={buttonClass}>
                                {option.text}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };
    
    const renderQuizResults = () => {
        const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        const circumference = 2 * Math.PI * 40;
        const offset = circumference - (percentage / 100) * circumference;

        return (
            <div className="text-center py-8 fade-in">
                <h2 className="text-3xl font-bold mb-6 text-slate-100">آزمون تمام شد!</h2>
                <div className="relative w-40 h-40 mx-auto mb-6">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="stroke-current text-slate-700" strokeWidth="10" cx="50" cy="50" r="40" fill="transparent"></circle>
                        <circle className="stroke-current text-teal-400 transition-all duration-1000 ease-in-out" strokeWidth="10" cx="50" cy="50" r="40" fill="transparent" strokeLinecap="round" style={{ strokeDasharray: circumference, strokeDashoffset: offset, transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}></circle>
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-slate-100">{percentage}%</span>
                </div>
                <p className="text-xl text-slate-300 mb-8">
                   شما به <span className="font-bold text-teal-400">{score}</span> سوال از <span className="font-bold">{questions.length}</span> سوال پاسخ صحیح دادید.
                </p>
                <div className="my-8 border-t border-b border-slate-700 py-6">
                    <blockquote className="text-lg italic text-slate-300">"{randomQuote.quote}"</blockquote>
                    <p className="text-right mt-2 text-teal-400 font-semibold">- {randomQuote.author}</p>
                </div>
                <div className="flex justify-center gap-4">
                    <button onClick={restartQuiz} className="bg-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-700 transition">آزمون مجدد</button>
                    <button onClick={onQuizEnd} className="bg-slate-700 text-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-slate-600 transition">بازگشت به لیست لغات</button>
                </div>
                {incorrectAnswers.length > 0 && (
                    <div className="mt-10 pt-6 border-t border-slate-700 text-right">
                        <h3 className="text-xl font-bold mb-4 text-slate-200">مرور اشتباهات</h3>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {incorrectAnswers.map((q, i) => (
                                <div key={i} className="bg-slate-800/50 p-3 rounded-lg">
                                    <p className="font-bold text-teal-400">{q.word}</p>
                                    <p className="text-sm text-slate-300 mt-1">{q.definition}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fade-in">
            {isFinished ? renderQuizResults() : renderQuizQuestion()}
        </div>
    );
};

export default Quiz;
