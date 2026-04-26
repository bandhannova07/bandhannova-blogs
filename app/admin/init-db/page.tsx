
'use client';

import { useState } from 'react';
import { initDatabase } from '@/lib/blog-service';

export default function InitDBPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleInit = async () => {
        setStatus('loading');
        try {
            await initDatabase();
            setStatus('success');
            setMessage('Database tables initialized successfully in BFOBS!');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Failed to initialize database');
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">BFOBS Initialization</h1>
            <p className="mb-4 text-gray-400">
                This will create the necessary tables in your sharded Turso databases via the BFOBS Proxy.
            </p>
            
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <button
                    onClick={handleInit}
                    disabled={status === 'loading'}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
                >
                    {status === 'loading' ? 'Initializing...' : 'Initialize Tables'}
                </button>

                {status === 'success' && (
                    <div className="mt-4 p-4 bg-emerald-900/30 border border-emerald-500/50 text-emerald-400 rounded-lg">
                        {message}
                    </div>
                )}

                {status === 'error' && (
                    <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg">
                        {message}
                    </div>
                )}
            </div>

            <div className="mt-8 text-sm text-gray-500">
                <h2 className="font-semibold mb-2">Note:</h2>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Ensure <code>BFOBS_TOKEN</code> is set in <code>.env.local</code></li>
                    <li>The <code>blogs</code> table will be created if it doesn't exist.</li>
                    <li>This uses the <code>bandhannova-blogs</code> product slug.</li>
                </ul>
            </div>
        </div>
    );
}
