"use client";

import { ExternalLink } from "lucide-react";

export function GoogleAdCard() {
    return (
        <div className="group relative glass p-6 rounded-[2rem] border-white/10 hover:border-primary/30 transition-all duration-500 shadow-xl overflow-hidden bg-background/40 min-h-[250px] flex flex-col justify-between">
            {/* Ad Badge */}
            <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-widest text-primary">
                    Sponsored
                </span>
                <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[8px] text-muted-foreground opacity-50">i</div>
            </div>

            {/* Ad Content */}
            <div className="space-y-3">
                <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent border border-white/5 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                    <span className="text-2xl font-black text-primary/20 tracking-tighter uppercase italic">BandhanNova Ads</span>
                </div>
                <div className="space-y-2">
                    <h4 className="text-sm font-black leading-tight text-foreground/80">
                        Unlock Premium AI Tools with BandhanNova Plus
                    </h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                        Join 10k+ students architecting their future with our advanced intelligence platform.
                    </p>
                </div>
            </div>

            {/* Link */}
            <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all cursor-pointer">
                    Learn More
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-primary/50" />
            </div>

            {/* Hover Glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all duration-700" />
        </div>
    );
}
