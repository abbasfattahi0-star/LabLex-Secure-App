
import React, { useState, useRef } from 'react';
import PdfPageModal from './PdfPageModal';

interface InputAreaProps {
    onProcessText: (text: string) => void;
    onProcessImage: (file: File) => void;
    onProcessPdf: (file: File, startPage: number, endPage: number) => void;
    onError: (message: string) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onProcessText, onProcessImage, onProcessPdf, onError }) => {
    const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [textInput, setTextInput] = useState<string>('');
    const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
    const [pdfInfo, setPdfInfo] = useState<{ file: File, totalPages: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setFileName(file.name);

        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            onError("فرمت فایل پشتیبانی نمی‌شود. لطفاً یک فایل تصویر یا PDF انتخاب کنید.");
            setSelectedFile(null);
            setFileName('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleProcessClick = async () => {
        if (!selectedFile) {
            onError("لطفا یک فایل را انتخاب کنید.");
            return;
        }

        if (selectedFile.type.startsWith('image/')) {
            onProcessImage(selectedFile);
        } else if (selectedFile.type === 'application/pdf') {
            try {
                const loadingTask = window.pdfjsLib.getDocument(await selectedFile.arrayBuffer());
                const pdf = await loadingTask.promise;
                setPdfInfo({ file: selectedFile, totalPages: pdf.numPages });
                setIsPdfModalOpen(true);
            } catch (error) {
                onError("خطا در بارگذاری فایل PDF.");
            }
        }
    };

    const handleProcessText = () => {
        if (!textInput.trim()) {
            onError("لطفا متنی را برای تحلیل وارد کنید.");
            return;
        }
        onProcessText(textInput);
    };

    return (
        <>
            <div className="max-w-lg mx-auto">
                <div className="flex border-b border-slate-700 mb-6">
                    <button className={`tab-btn-input flex-1 py-2 font-semibold border-b-2 text-slate-400 hover:text-slate-200 transition ${activeTab === 'file' ? 'active' : ''}`} onClick={() => setActiveTab('file')}>بارگذاری فایل</button>
                    <button className={`tab-btn-input flex-1 py-2 font-semibold border-b-2 text-slate-400 hover:text-slate-200 transition ${activeTab === 'text' ? 'active' : ''}`} onClick={() => setActiveTab('text')}>ورود متن</button>
                </div>

                {activeTab === 'file' && (
                    <div>
                        <h2 className="text-2xl font-bold text-center mb-4 text-slate-100">بارگذاری فایل</h2>
                        <p className="text-center text-slate-400 mb-6">یک فایل تصویر (JPG, PNG) یا PDF انتخاب کنید.</p>
                        <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-teal-400 transition-all duration-300">
                            <input type="file" id="file-input" ref={fileInputRef} accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
                            <label htmlFor="file-input" className="cursor-pointer text-teal-400 font-semibold text-lg">
                                برای انتخاب فایل کلیک کنید
                            </label>
                            <p className="text-slate-400 mt-2">{fileName}</p>
                        </div>
                        <button onClick={handleProcessClick} disabled={!selectedFile} className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white font-bold py-3 px-4 rounded-xl mt-6 hover:from-teal-600 hover:to-teal-800 transition duration-300 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed shadow-lg">
                            پردازش
                        </button>
                    </div>
                )}

                {activeTab === 'text' && (
                    <div>
                        <h2 className="text-2xl font-bold text-center mb-4 text-slate-100">ورود دستی متن</h2>
                        <p className="text-center text-slate-400 mb-6">متن انگلیسی مورد نظر خود را در کادر زیر وارد کنید.</p>
                        <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} className="w-full h-40 bg-slate-800 text-slate-200 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" placeholder="متن انگلیسی خود را اینجا وارد کنید..."></textarea>
                        <button onClick={handleProcessText} className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white font-bold py-3 px-4 rounded-xl mt-6 hover:from-teal-600 hover:to-teal-800 transition duration-300 shadow-lg">
                            پردازش متن
                        </button>
                    </div>
                )}
            </div>
            {isPdfModalOpen && pdfInfo && (
                <PdfPageModal
                    totalPages={pdfInfo.totalPages}
                    onClose={() => setIsPdfModalOpen(false)}
                    onProcess={(start, end) => {
                        onProcessPdf(pdfInfo.file, start, end);
                        setIsPdfModalOpen(false);
                    }}
                    onError={onError}
                />
            )}
        </>
    );
};

export default InputArea;
