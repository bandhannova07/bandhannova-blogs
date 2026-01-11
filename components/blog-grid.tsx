"use client";

import { BlogCard } from "@/components/blog-card";
import { AdCard } from "@/components/ad-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Blog } from "@/lib/supabase/types";
import { FileQuestion } from "lucide-react";

interface BlogGridProps {
    posts: Blog[];
    loading?: boolean;
}

const AD_FREQUENCY = 3; // Show ad after every 3 cards

export function BlogGrid({ posts, loading = false }: BlogGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-64 w-full rounded-lg" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                ))}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-16 space-y-4">
                <FileQuestion className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                <h3 className="text-xl md:text-2xl font-semibold">No blogs found</h3>
                <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
                    Try adjusting your search or filter to find what you're looking for.
                </p>
            </div>
        );
    }

    // Insert ads between blog cards
    const itemsWithAds: (Blog | { type: 'ad'; id: string })[] = [];
    posts.forEach((post, index) => {
        itemsWithAds.push(post);
        // Add ad after every AD_FREQUENCY cards (but not after the last card)
        if ((index + 1) % AD_FREQUENCY === 0 && index !== posts.length - 1) {
            itemsWithAds.push({ type: 'ad', id: `ad-${index}` });
        }
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {itemsWithAds.map((item, index) => {
                if ('type' in item && item.type === 'ad') {
                    return (
                        <div key={item.id} className="sm:col-span-2 lg:col-span-3">
                            <AdCard />
                        </div>
                    );
                }

                return (
                    <div
                        key={item.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <BlogCard post={item as Blog} />
                    </div>
                );
            })}
        </div>
    );
}
