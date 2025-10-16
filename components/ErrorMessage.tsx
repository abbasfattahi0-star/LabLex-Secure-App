
import React, { useState, useEffect } from 'react';

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className={`fixed bottom-5 right-5 bg-red-500 text-white py-3 px-6 rounded-lg shadow-lg transition-transform duration-500 ${visible ? 'translate-x-0' : 'translate-x-[calc(100%+2.5rem)]'}`}>
            <p>{message}</p>
        </div>
    );
};

export default ErrorMessage;
