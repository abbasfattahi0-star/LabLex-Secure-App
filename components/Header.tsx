
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="relative text-center text-white py-16 md:py-20 px-4">
            <div className="floating">
                <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{textShadow: '0 2px 15px rgba(0,0,0,0.5)', background: 'linear-gradient(90deg, #5eead4, #a78bfa, #5eead4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Lab Lex</h1>
            </div>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-slate-300 mt-2">مترجم هوشمند واژگان علوم پایه</p>
            <div className="absolute top-10 right-10 w-4 h-4 sparkle"></div>
            <div className="absolute top-20 left-20 w-3 h-3 sparkle" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-10 left-10 w-5 h-5 sparkle" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 right-20 w-2 h-2 sparkle" style={{animationDelay: '1.5s'}}></div>
        </header>
    );
};

export default Header;
