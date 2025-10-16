
import React, { useEffect } from 'react';
import { scienceTerms } from '../constants';

interface BackgroundEffectsProps {
    showFallingItems: boolean;
}

const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({ showFallingItems }) => {

    useEffect(() => {
        const bg = document.getElementById('global-bg');
        if (!bg || bg.children.length > 0) return; // Prevent re-adding lines on re-renders

        for (let i = 0; i < 15; i++) {
            const line = document.createElement('div');
            line.className = 'animated-line';
            line.style.left = `${Math.random() * 100}%`;
            line.style.width = `${Math.random() * 150 + 80}px`;
            line.style.animationDuration = `${Math.random() * 12 + 18}s`;
            line.style.animationDelay = `${Math.random() * 15}s`;
            line.style.opacity = (Math.random() * 0.3 + 0.1).toString();
            bg.appendChild(line);
        }
    }, []);

    useEffect(() => {
        if (!showFallingItems) return;

        const container = document.getElementById('falling-container');
        if (!container) return;
        const colors = ['#5eead4', '#a78bfa', '#67e8f9', '#c084fc', '#2dd4bf'];
        
        const intervalId = setInterval(() => {
            if (!document.hidden) {
                const itemEl = document.createElement('div');
                itemEl.className = 'falling-item';
                itemEl.textContent = scienceTerms[Math.floor(Math.random() * scienceTerms.length)];
                itemEl.style.left = `${Math.random() * 100}vw`;
                itemEl.style.animationDuration = `${Math.random() * 10 + 10}s`;
                itemEl.style.fontSize = `${Math.random() * 1 + 1}rem`;
                itemEl.style.color = colors[Math.floor(Math.random() * colors.length)];
                container.appendChild(itemEl);

                setTimeout(() => {
                    itemEl.remove();
                }, 20000);
            }
        }, 500);

        return () => {
            clearInterval(intervalId);
            if (container) container.innerHTML = '';
        };
    }, [showFallingItems]);

    return (
        <>
            <div id="global-bg"></div>
            <div id="falling-container" className="fixed inset-0 z-0 overflow-hidden pointer-events-none"></div>
        </>
    );
};

export default BackgroundEffects;
