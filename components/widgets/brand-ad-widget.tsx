import { Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BrandAd } from "@/lib/blog-service";

export function BrandAdWidget({ ads }: { ads: BrandAd[] }) {
    if (!ads || ads.length === 0) return null;

    return (
        <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary/60 px-2">Brand Spotlight</h3>
            <div className="space-y-6">
                {ads.map((ad, i) => (
                    <div key={i} className="relative group rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl bg-black aspect-[9/16]">
                        {/* Video Background */}
                        <video 
                            src={ad.video_url} 
                            autoPlay 
                            muted 
                            loop 
                            playsInline 
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                        />
                        
                        {/* Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-6">
                            <div className="space-y-2 transform group-hover:-translate-y-2 transition-transform duration-500">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-primary fill-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Sponsored</span>
                                </div>
                                <h4 className="text-2xl font-black tracking-tight text-white leading-tight">
                                    {ad.title}
                                </h4>
                            </div>
                            
                            <a href={ad.cta_link} target="_blank" rel="noopener noreferrer" className="block transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                <Button className="w-full rounded-2xl py-7 font-black uppercase tracking-widest text-xs gap-3 shadow-[0_20px_40px_rgba(32,149,243,0.3)] bg-primary hover:bg-primary/90">
                                    <Play className="w-4 h-4 fill-current" />
                                    {ad.cta_text}
                                </Button>
                            </a>
                        </div>
                        
                        {/* Glass border effect */}
                        <div className="absolute inset-0 border-[8px] border-white/5 pointer-events-none rounded-[2.5rem]" />
                    </div>
                ))}
            </div>
            
            {/* AdSense Space */}
            <div className="glass p-8 rounded-[2.5rem] border-white/10 space-y-4">
                <div className="h-40 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 text-center px-4">Commercial Space Reserved</span>
                </div>
            </div>
        </div>
    );
}
