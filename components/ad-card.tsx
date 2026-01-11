"use client";

import { useEffect } from 'react';

interface AdCardProps {
    className?: string;
}

export function AdCard({ className = "" }: AdCardProps) {
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            }
        } catch (error) {
            console.error('AdSense error:', error);
        }
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
