"use client";

import { BlogCard } from "@/components/blog-card";
import { AdCard } from "@/components/ad-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Blog } from "@/lib/blog-service";
import { FileQuestion } from "lucide-react";
import { motion } from "framer-motion";

interface BlogGridProps {
    posts: Blog[];
    loading?: boolean;
}

const AD_FREQUENCY = 6;

export function BlogGrid({ posts, loading = false }: BlogGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-6 glass p-6 rounded-[2rem]">
                        <Skeleton className="h-56 w-full rounded-[1.5rem] bg-primary/5" />
                        <Skeleton className="h-6 w-3/4 bg-primary/5" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full bg-primary/5" />
                            <Skeleton className="h-4 w-2/3 bg-primary/5" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 space-y-6 glass rounded-[2rem] border-primary/5 shadow-xl"
            >
                <FileQuestion className="h-20 w-20 mx-auto text-primary opacity-20" />
                <h3 className="text-3xl font-black tracking-tight">No blogs found</h3>
                <p className="text-muted-foreground max-w-md mx-auto font-medium">
                    Try adjusting your filters or search query.
                </p>
            </motion.div>
        );
    }

    const itemsWithAds: (Blog | { type: 'ad'; id: string })[] = [];
    posts.forEach((post, index) => {
        itemsWithAds.push(post);
        if ((index + 1) % AD_FREQUENCY === 0 && index !== posts.length - 1) {
            itemsWithAds.push({ type: 'ad', id: `ad-${index}` });
        }
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.4
            }
        }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
            {itemsWithAds.map((item, index) => {
                if ('type' in item && item.type === 'ad') {
                    return (
                        <motion.div 
                            key={item.id}
                            variants={itemVariants}
                            className="sm:col-span-2 lg:col-span-3 py-2"
                        >
                            <AdCard />
                        </motion.div>
                    );
                }

                return (
                    <motion.div
                        key={(item as Blog).id}
                        variants={itemVariants}
                        className="h-full"
                    >
                        <BlogCard post={item as Blog} />
                    </motion.div>
                );
            })}
        </motion.div>
    );
}

