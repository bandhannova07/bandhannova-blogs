"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Search, Sparkles, TrendingUp, Brain, ChevronLeft, ChevronRight, ChevronDown, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { categories } from "@/lib/blog-data";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Blog } from "@/lib/blog-service";

interface BlogFiltersProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
    posts?: Blog[];
}

export function BlogFilters({
    selectedCategory,
    onCategoryChange,
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    posts = [],
}: BlogFiltersProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Calculate counts
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { All: posts.length };
        posts.forEach((post) => {
            counts[post.category] = (counts[post.category] || 0) + 1;
        });
        return counts;
    }, [posts]);

    // Filter and sort categories
    const activeCategories = useMemo(() => {
        if (!posts || posts.length === 0) return ["All", ...categories.filter(c => c !== "All")];

        const usedCategories = categories.filter(
            (cat) => cat === "All" || (categoryCounts[cat] || 0) > 0
        );

        return [
            "All",
            ...usedCategories
                .filter((c) => c !== "All")
                .sort((a, b) => (categoryCounts[b] || 0) - (categoryCounts[a] || 0)),
        ];
    }, [categoryCounts, posts]);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", checkScroll);
            checkScroll();
            return () => container.removeEventListener("scroll", checkScroll);
        }
    }, [activeCategories]);

    useEffect(() => {
        const handleFocusEvent = () => {
            if (searchInputRef.current) {
                searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                    searchInputRef.current?.focus();
                    window.dispatchEvent(new CustomEvent("bn-search-focused"));
                }, 500);
            }
        };

        window.addEventListener("bn-focus-search", handleFocusEvent);
        return () => window.removeEventListener("bn-focus-search", handleFocusEvent);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("action") === "search" && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
                window.dispatchEvent(new CustomEvent("bn-search-focused"));
            }, 500);
        }
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const amount = direction === "left" ? -300 : 300;
            scrollContainerRef.current.scrollBy({ left: amount, behavior: "smooth" });
        }
    };

    return (
        <div className="space-y-12 max-w-6xl mx-auto py-12 px-0 sm:px-6">
            {/* Search & Sort Section */}
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
                {/* AI Intelligence Search Bar */}
                <div className="relative w-full max-w-2xl group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 blur-2xl rounded-[2.5rem] opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
                    <div className="relative flex items-center">
                        <div className="absolute left-5 md:left-7 z-20 pointer-events-none flex items-center">
                            <Search className="h-5 w-5 text-primary" />
                        </div>
                        <Input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search Blogs..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onFocus={() => window.dispatchEvent(new CustomEvent("bn-search-focused"))}
                            onBlur={() => window.dispatchEvent(new CustomEvent("bn-search-unfocused"))}
                            className="pl-13 md:pl-16 pr-8 py-8 text-lg rounded-[2.5rem] glass border-white/10 focus:border-primary/50 focus:ring-[12px] focus:ring-primary/5 transition-all shadow-2xl bg-black/40 backdrop-blur-3xl w-full placeholder:text-muted-foreground/20 font-medium"
                        />
                    </div>
                </div>

                {/* Sort Navigation */}
                <div className="flex items-center gap-2 p-2 glass rounded-[2.5rem] border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl w-full lg:w-auto">
                    {[
                        { id: "newest", label: "Fresh", icon: Sparkles },
                        { id: "popular", label: "Trending", icon: TrendingUp }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSortChange(item.id)}
                            className={cn(
                                "relative flex-1 lg:flex-none flex items-center justify-center gap-3 px-4 md:px-8 py-3.5 rounded-full text-[10px] md:text-sm font-black uppercase tracking-[0.2em] transition-all",
                                sortBy === item.id ? "text-white" : "text-muted-foreground/40"
                            )}
                        >
                            {sortBy === item.id && (
                                <motion.div
                                    layoutId="activeSort"
                                    className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-full shadow-lg"
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-3">
                                <item.icon size={16} />
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Premium Category Intelligence - Unique Adaptive Layout */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-1px bg-gradient-to-r from-primary to-transparent" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/80">
                            Neural Classification
                        </h3>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
                        <Sparkles className="h-3 w-3" />
                        {activeCategories.length} Active Nodes
                    </div>
                </div>

                {/* Unified Premium Selector - Long Button with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className={cn(
                            "group relative w-full flex items-center justify-between px-8 py-6 rounded-[2rem] glass border-white/10 bg-white/5 backdrop-blur-3xl transition-all duration-300 shadow-2xl",
                            isCategoryOpen && "ring-4 ring-primary/5"
                        )}
                    >
                        <div className="flex items-center gap-6">
                            <div className={cn(
                                "p-3 rounded-2xl bg-primary/10 text-primary transition-all",
                                isCategoryOpen && "scale-105"
                            )}>
                                <Filter size={20} />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-1">
                                    Current Classification
                                </span>
                                <span className="text-lg font-bold tracking-tight text-foreground flex items-center gap-3">
                                    {selectedCategory}
                                    <span className="px-2.5 py-0.5 rounded-lg bg-primary/20 text-primary text-[10px] font-black">
                                        {(categoryCounts[selectedCategory] || 0).toString().padStart(2, '0')}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className={cn(
                            "p-2 rounded-xl bg-white/5 transition-all",
                            isCategoryOpen ? "rotate-180 bg-primary/10 text-primary" : "text-muted-foreground/30"
                        )}>
                            <ChevronDown size={24} strokeWidth={3} />
                        </div>
                    </button>

                    <AnimatePresence>
                        {isCategoryOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 5 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-0 right-0 z-50 p-3 rounded-[2rem] glass border-white/10 bg-black/80 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] max-h-[60vh] overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
                            >
                                {activeCategories.map((category) => {
                                    const isSelected = selectedCategory === category;
                                    return (
                                        <button
                                            key={category}
                                            onClick={() => {
                                                onCategoryChange(category);
                                                setIsCategoryOpen(false);
                                            }}
                                            className={cn(
                                                "relative flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group/item",
                                                isSelected ? "bg-primary text-white" : "text-muted-foreground/60 hover:text-primary dark:hover:text-white"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full transition-all",
                                                    isSelected ? "bg-white" : "bg-white/10 group-hover/item:bg-primary/50"
                                                )} />
                                                <span className="text-[11px] font-black uppercase tracking-widest">
                                                    {category}
                                                </span>
                                            </div>

                                            <span className={cn(
                                                "px-2 py-0.5 rounded-lg text-[9px] font-black",
                                                isSelected ? "bg-white/20" : "bg-white/5 text-muted-foreground/30"
                                            )}>
                                                {(categoryCounts[category] || 0).toString().padStart(2, '0')}
                                            </span>
                                        </button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
