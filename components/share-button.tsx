"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
    title: string;
    text: string;
    url: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleShare}
            className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/5 border border-white/10 hover:bg-primary/10 hover:text-primary transition-all group"
        >
            <Share2 className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform" />
        </Button>
    );
}
