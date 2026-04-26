import Image from "next/image";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AffiliateLink } from "@/lib/blog-service";

export function AffiliateWidget({ affiliates }: { affiliates: AffiliateLink[] }) {
    if (!affiliates || affiliates.length === 0) return null;

    return (
        <div className="relative h-full flex flex-col gap-[30vh]">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary/60 px-2 sticky top-32 z-20 bg-background/80 backdrop-blur-sm py-2">
                Featured Selections
            </h3>
            
            {affiliates.map((item, i) => (
                <div 
                    key={i} 
                    className="sticky transition-all duration-700 z-10"
                    style={{ top: `${160 + (i * 20)}px` }}
                >
                    <div className="group glass p-4 rounded-[2rem] border-white/10 hover:border-primary/30 transition-all duration-500 shadow-xl overflow-hidden relative bg-background/50">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative space-y-4">
                            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/5 shadow-inner">
                                <Image 
                                    src={item.thumbnail} 
                                    alt={item.title} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <h4 className="text-sm font-black leading-tight line-clamp-2 min-h-[2.5rem]">
                                    {item.title}
                                </h4>
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="block">
                                    <Button className="w-full rounded-xl py-5 font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg group-hover:shadow-primary/20">
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                        Buy Now
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {/* AdSense Placeholder - also sticky at the bottom of the stack */}
            <div className="sticky top-[70vh] z-0">
                <div className="glass h-[300px] rounded-[2.5rem] border-white/10 flex items-center justify-center relative overflow-hidden bg-white/5">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <ExternalLink className="w-6 h-6 text-primary/40" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">AdSense Space</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
