"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GoogleAdCard } from "./widgets/google-ad-card";

interface AffiliateLink {
    thumbnail: string;
    link: string;
    title: string;
}

interface BrandAd {
    video_url: string;
    title: string;
    cta_text: string;
    cta_link: string;
}

interface SectionLayout {
    heading: string;
    left: {
        type: "affiliate" | "adsense" | "nothing";
        affiliate?: AffiliateLink;
    };
    right: {
        type: "brand_ad" | "affiliate" | "adsense" | "nothing";
        brand_ad?: BrandAd;
        affiliate?: AffiliateLink;
    };
}

interface SectionedBlogContentProps {
    contentHtml: string;
    sectionLayouts?: SectionLayout[];
}

/**
 * Splits the blog HTML by <h2> tags into sections.
 * Each section contains the content from one <h2> to the next <h2>.
 * The intro (before first H2) is its own section.
 */
function splitContentBySections(html: string): string[] {
    // Split by <h2 tags, keeping the delimiter
    const parts = html.split(/(?=<h2[\s>])/i);
    return parts.filter(p => p.trim().length > 0);
}

export function SectionedBlogContent({ contentHtml, sectionLayouts = [] }: SectionedBlogContentProps) {
    const sections = splitContentBySections(contentHtml);

    return (
        <div className="space-y-0">
            {sections.map((sectionHtml, index) => {
                // Intro is index 0. H2 sections start from index 1.
                // sectionLayouts[0] maps to the first H2 section (index 1).
                const layout = index > 0 ? sectionLayouts[index - 1] : null;

                return (
                    <div
                        key={index}
                        className="relative grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] xl:gap-12 gap-8"
                    >
                        {/* LEFT SIDEBAR Slot */}
                        <div className="hidden lg:block relative">
                            {index === 0 ? (
                                /* Intro section — show a subtle label */
                                <div className="sticky top-32 pb-8">
                                    <div className="glass rounded-[2rem] p-8 border-white/10 bg-primary/5 text-center space-y-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                            <ExternalLink className="w-5 h-5 text-primary/50" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                                            Featured Selections
                                        </p>
                                    </div>
                                </div>
                            ) : layout ? (
                                <div className="sticky top-32 pb-8">
                                    {layout.left.type === "affiliate" && layout.left.affiliate ? (
                                        <div className="group glass p-5 rounded-[2rem] border-white/10 hover:border-primary/30 transition-all duration-500 shadow-xl overflow-hidden relative bg-background/60">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                            <div className="relative space-y-4">
                                                <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/5 shadow-inner">
                                                    <Image src={layout.left.affiliate.thumbnail} alt={layout.left.affiliate.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                </div>
                                                <div className="space-y-3">
                                                    <h4 className="text-sm font-black leading-tight line-clamp-2 min-h-[2.5rem]">{layout.left.affiliate.title}</h4>
                                                    <a href={layout.left.affiliate.link} target="_blank" rel="noopener noreferrer" className="block">
                                                        <Button className="w-full rounded-xl py-5 font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg group-hover:shadow-primary/20 transition-shadow">
                                                            <ShoppingCart className="w-3.5 h-3.5" />
                                                            View Product
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ) : layout.left.type === "adsense" ? (
                                        <GoogleAdCard />
                                    ) : (
                                        /* Nothing / Empty Space */
                                        <div className="h-20" />
                                    )}
                                </div>
                            ) : null}
                        </div>

                        {/* CENTER: Blog Section Content */}
                        <div
                            className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none dark:prose-invert
                            prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground
                            prose-p:text-base md:prose-p:text-xl prose-p:leading-[1.8] prose-p:font-medium prose-p:text-foreground/80
                            prose-strong:text-primary prose-strong:font-black
                            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-3xl md:prose-img:rounded-[2rem] prose-img:shadow-2xl prose-img:border prose-img:border-white/10
                            prose-code:text-primary prose-code:bg-primary/5 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg
                            prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:p-6 md:prose-blockquote:p-8 prose-blockquote:rounded-r-2xl md:prose-blockquote:rounded-r-[2rem]
                            "
                            dangerouslySetInnerHTML={{ __html: sectionHtml }}
                        />

                        {/* RIGHT SIDEBAR Slot */}
                        <div className="hidden lg:block relative">
                            {layout && (
                                <div className="sticky top-32 pb-8">
                                    {layout.right.type === "brand_ad" && layout.right.brand_ad ? (
                                        <div className="glass p-1 rounded-[2.6rem] border-white/10 overflow-hidden shadow-2xl relative group bg-background/60">
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                            <div className="relative aspect-[9/16] w-full rounded-[2.5rem] overflow-hidden border border-white/5">
                                                <video 
                                                    src={layout.right.brand_ad.video_url} 
                                                    autoPlay 
                                                    loop 
                                                    muted 
                                                    playsInline 
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                <div className="absolute bottom-8 left-8 right-8 space-y-4">
                                                    <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 rounded-full px-4 py-1 text-[8px] font-black uppercase tracking-[0.2em]">
                                                        Sponsored
                                                    </Badge>
                                                    <h4 className="text-white text-lg font-black leading-tight">
                                                        {layout.right.brand_ad.title}
                                                    </h4>
                                                    <a href={layout.right.brand_ad.cta_link} target="_blank" rel="noopener noreferrer">
                                                        <Button className="w-full rounded-2xl py-6 font-black uppercase tracking-widest text-[10px] gap-2 shadow-[0_10px_30px_rgba(32,149,243,0.3)] bg-primary text-white border-none">
                                                            {layout.right.brand_ad.cta_text}
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ) : layout.right.type === "affiliate" && layout.right.affiliate ? (
                                        <div className="group glass p-5 rounded-[2rem] border-white/10 hover:border-primary/30 transition-all duration-500 shadow-xl overflow-hidden relative bg-background/60">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                            <div className="relative space-y-4">
                                                <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/5 shadow-inner">
                                                    <Image src={layout.right.affiliate.thumbnail} alt={layout.right.affiliate.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                </div>
                                                <div className="space-y-3">
                                                    <h4 className="text-sm font-black leading-tight line-clamp-2 min-h-[2.5rem]">{layout.right.affiliate.title}</h4>
                                                    <a href={layout.right.affiliate.link} target="_blank" rel="noopener noreferrer" className="block">
                                                        <Button className="w-full rounded-xl py-5 font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg group-hover:shadow-primary/20 transition-shadow">
                                                            <ShoppingCart className="w-3.5 h-3.5" />
                                                            View Product
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ) : layout.right.type === "adsense" ? (
                                        <GoogleAdCard />
                                    ) : (
                                        /* Nothing / Empty Space */
                                        <div className="h-20" />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
