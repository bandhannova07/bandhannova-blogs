"use client";

import { useEffect, useRef } from 'react';

interface AdCardProps {
    className?: string;
}

let adsPushed = false;

export function AdCard({ className = "" }: AdCardProps) {
    const adLoaded = useRef(false);

    useEffect(() => {
        if (adLoaded.current) return;

        const timer = setTimeout(() => {
            try {
                if (typeof window !== 'undefined' && !adsPushed) {
                    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                    adLoaded.current = true;
                }
            } catch (error) {
                // Silently handle AdSense errors
            }
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`w-full ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-5780274856983314"
                data-ad-slot="7053611398"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
}
