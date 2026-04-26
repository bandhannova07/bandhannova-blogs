"use client";

import { Search, Sparkles, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { categories } from "@/lib/blog-data";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlogFiltersProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
}

export function BlogFilters({
    selectedCategory,
    onCategoryChange,
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
}: BlogFiltersProps) {
    return (
        <div className="space-y-12 max-w-6xl mx-auto py-12">
            {/* Search & Sort Section */}
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-center justify-between">
                {/* Premium Search Bar */}
                <div className="relative w-full max-w-2xl group">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                        <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                        <Input
                            type="text"
                            placeholder="Search intelligence..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-14 md:pl-16 pr-6 md:pr-8 py-6 md:py-8 text-base md:text-xl rounded-2xl md:rounded-[2rem] glass border-white/20 dark:border-white/5 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-xl md:shadow-2xl bg-white/40 dark:bg-black/20 backdrop-blur-2xl w-full"
                        />
                    </div>
                </div>

                {/* Sort Toggle */}
                <div className="flex items-center gap-1.5 md:gap-2 p-1.5 md:p-2 glass rounded-2xl md:rounded-[2rem] shadow-xl md:shadow-2xl border-white/20 dark:border-white/5 bg-white/30 dark:bg-black/20 backdrop-blur-xl w-full lg:w-auto">
                    <button
                        onClick={() => onSortChange("newest")}
                        className={`relative flex-1 lg:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-2.5 md:py-3.5 rounded-xl md:rounded-[1.5rem] text-[10px] md:text-sm font-black uppercase tracking-[0.15em] transition-all duration-500 ${sortBy === "newest"
                                ? "text-primary-foreground"
                                : "text-muted-foreground hover:text-primary"
                            }`}
                    >
                        {sortBy === "newest" && (
                            <motion.div
                                layoutId="activeSort"
                                className="absolute inset-0 bg-primary rounded-xl md:rounded-[1.5rem] shadow-xl"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2 md:gap-3">
                            <Sparkles size={14} className={sortBy === "newest" ? "animate-pulse" : ""} />
                            Fresh
                        </span>
                    </button>
                    <button
                        onClick={() => onSortChange("popular")}
                        className={`relative flex-1 lg:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-2.5 md:py-3.5 rounded-xl md:rounded-[1.5rem] text-[10px] md:text-sm font-black uppercase tracking-[0.15em] transition-all duration-500 ${sortBy === "popular"
                                ? "text-primary-foreground"
                                : "text-muted-foreground hover:text-primary"
                            }`}
                    >
                        {sortBy === "popular" && (
                            <motion.div
                                layoutId="activeSort"
                                className="absolute inset-0 bg-primary rounded-xl md:rounded-[1.5rem] shadow-xl"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2 md:gap-3">
                            <TrendingUp size={14} className={sortBy === "popular" ? "animate-bounce" : ""} />
                            Trending
                        </span>
                    </button>
                </div>
            </div>

            {/* Premium Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
                <AnimatePresence mode="popLayout">
                    {categories.map((category, idx) => (
                        <motion.button
                            key={category}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                                delay: idx * 0.05,
                                duration: 0.4,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            onClick={() => onCategoryChange(category)}
                            className={cn(
                                "category-pill px-5 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em]",
                                selectedCategory === category ? "active" : "text-muted-foreground/60"
                            )}
                        >
                            {category}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
