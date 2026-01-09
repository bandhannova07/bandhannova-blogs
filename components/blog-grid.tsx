"use client";

import { BlogCard } from "@/components/blog-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost } from "@/lib/blog-data";
import { FileQuestion } from "lucide-react";

interface BlogGridProps {
    posts: BlogPost[];
    loading?: boolean;
}

export function BlogGrid({ posts, loading = false }: BlogGridProps) {
    if (loading) {
        return (
            <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="h-56 w-full rounded-lg" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (posts.length === 0) {
        return (
            <section className="py-20 md:py-32 px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="rounded-full bg-muted p-6">
                            <FileQuestion className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold">No blogs found</h3>
                        <p className="text-muted-foreground max-w-md">
                            We couldn't find any blogs matching your criteria. Try adjusting your filters or search query.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
                    {posts.map((post, index) => (
                        <div
                            key={post.id}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <BlogCard post={post} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
