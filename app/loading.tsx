"use client";

import { Loader2, Sparkles, Brain } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-colors duration-500">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 dark:bg-primary/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] rounded-full animate-pulse delay-700" />

            <div className="relative flex flex-col items-center gap-8">
                {/* Logo & Spinner Container */}
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-black/5 dark:border-white/5 flex items-center justify-center backdrop-blur-3xl bg-black/[0.02] dark:bg-white/[0.02] shadow-2xl relative overflow-hidden group">
                        {/* Rotating Ring */}
                        <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin duration-[1.5s]" />
                        
                        {/* Inner Pulsing Circle */}
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                            <Brain className="h-8 w-8 text-primary opacity-80" />
                        </div>
                    </div>
                    
                    {/* Floating Particles */}
                    <div className="absolute -top-4 -right-4 animate-bounce delay-300">
                        <Sparkles className="h-5 w-5 text-primary/40" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 animate-bounce delay-1000">
                        <Sparkles className="h-4 w-4 text-blue-500/30" />
                    </div>
                </div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <h2 className="text-sm font-black uppercase tracking-[0.4em] text-foreground animate-pulse">
                        Architecting Intelligence
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                    </div>
                </div>

                {/* Technical Meta (Subtle) */}
                <div className="absolute -bottom-24 w-max px-6 py-2 rounded-full border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] backdrop-blur-sm">
                    <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.2em]">
                        Cluster Status: <span className="text-primary/60">Optimizing Neural Nodes</span>
                    </p>
                </div>
            </div>

            {/* Bottom Progress Bar (Subtle) */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-black/[0.02] dark:bg-white/[0.02] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-transparent via-primary to-transparent w-[30%] animate-[shimmer_2s_infinite]" 
                     style={{
                        animationName: 'shimmer',
                        animationDuration: '2s',
                        animationTimingFunction: 'linear',
                        animationIterationCount: 'infinite'
                     }}
                />
            </div>
        </div>
    );
}
