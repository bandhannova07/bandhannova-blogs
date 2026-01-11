"use client";

import { useEffect } from 'react';

interface InContentAdProps {
    className?: string;
}

export function InContentAd({ className = "" }: InContentAdProps) {
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
        <div className={`w-full my-8 ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block', textAlign: 'center' }}
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-client="ca-pub-5780274856983314"
                data-ad-slot="6295063491"
            />
        </div>
    );
}
