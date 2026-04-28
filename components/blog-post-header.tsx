"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function BlogPostHeader() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== "undefined") {
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    // Scrolling down
                    setIsVisible(false);
                } else {
                    // Scrolling up
                    setIsVisible(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        window.addEventListener("scroll", controlNavbar);
        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [lastScrollY]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Error sharing:", err);
            }
        }
    };

    return (
        <div className={cn(
            "sticky top-0 z-50 transition-transform duration-500",
            isVisible ? "translate-y-0" : "-translate-y-full"
        )}>
            <div className="glass border-b border-white/10 backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                    <Link href="/#blogs">
                        <Button variant="ghost" className="gap-2 md:gap-3 font-black uppercase tracking-widest text-[9px] md:text-xs hover:bg-primary/10 hover:text-primary transition-all rounded-full px-3 md:px-6">
                            <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            <span className="hidden sm:inline">Back to Knowledge Hub</span>
                            <span className="sm:hidden">Back</span>
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2 md:gap-4">
                        <ThemeToggle />
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleShare}
                            className="rounded-full hover:bg-primary/10 w-10 h-10 md:w-14 md:h-14"
                        >
                            <Share2 className="h-5 w-5 md:h-7 md:w-7 text-primary" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
