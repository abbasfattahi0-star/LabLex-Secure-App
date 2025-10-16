
import React, { useState } from 'react';

interface PdfPageModalProps {
    totalPages: number;
    onClose: () => void;
    onProcess: (startPage: number, endPage: number) => void;
    onError: (message: string) => void;
}

const PdfPageModal: React.FC<PdfPageModalProps> = ({ totalPages, onClose, onProcess, onError }) => {
    const [startPage, setStartPage] = useState('1');
    const [endPage, setEndPage] = useState(Math.min(3, totalPages).toString());
    const [visible, setVisible] = useState(true);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const handleProcess = () => {
        const start = parseInt(startPage);
        const end = parseInt(endPage);

        if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
            onError("محدوده صفحات نامعتبر است.");
            return;
        }
        if ((end - start + 1) > 3) {
            onError("محدوده انتخابی نمی‌تواند بیشتر از ۳ صفحه باشد.");
            return;
        }
        onProcess(start, end);
    };

    return (
        <div className={`modal fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className="glass-card w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-center mb-4 text-slate-100">پردازش PDF</h2>
                <p className="text-center text-slate-300 mb-6">فایل شما <span className="font-bold text-teal-400">{totalPages}</span> صفحه دارد. محدوده مورد نظر برای استخراج لغات را وارد کنید.</p>
                <div className="flex items-center justify-center gap-4">
                    <label htmlFor="start-page" className="text-slate-300">از صفحه:</label>
                    <input type="number" id="start-page" value={startPage} onChange={e => setStartPage(e.target.value)} min="1" max={totalPages} className="number-input w-20 bg-slate-800 text-slate-200 border border-slate-600 rounded-lg p-2 text-center" />
                    <label htmlFor="end-page" className="text-slate-300">تا صفحه:</label>
                    <input type="number" id="end-page" value={endPage} onChange={e => setEndPage(e.target.value)} min="1" max={totalPages} className="number-input w-20 bg-slate-800 text-slate-200 border border-slate-600 rounded-lg p-2 text-center" />
                </div>
                <p className="text-xs text-slate-400 mt-3 text-center">توجه: برای اطمینان از بهترین عملکرد، شما می‌توانید در هر مرحله حداکثر ۳ صفحه را انتخاب کنید.</p>
                <button onClick={handleProcess} className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white font-bold py-3 px-4 rounded-lg mt-6 hover:from-teal-600 hover:to-teal-800 transition">شروع پردازش</button>
            </div>
        </div>
    );
};

export default PdfPageModal;
