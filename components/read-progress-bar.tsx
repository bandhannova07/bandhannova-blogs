"use client"

import { useEffect, useState } from 'react';

export const ReadProgressBar = () => {
    const [progress, setProgress] = useState(0);

    const updateScrollProgress = () => {
        const currentScroll = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

        if (scrollHeight) {
            setProgress((currentScroll / scrollHeight) * 100);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', updateScrollProgress);
        return () => window.removeEventListener('scroll', updateScrollProgress);
    }, []);

    return (
        <div className="read-progress-container">
            <div
                className="read-progress-bar"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};
