"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/lib/blog-data";

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
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Search Bar & Sort - Centered */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <div className="relative flex-1 w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search blogs..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 pr-4 py-3 text-base rounded-lg"
                    />
                </div>

                {/* Custom Sort Toggle */}
                <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-full sm:w-auto">
                    <button
                        onClick={() => onSortChange("newest")}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${sortBy === "newest"
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Discover
                    </button>
                    <button
                        onClick={() => onSortChange("popular")}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${sortBy === "popular"
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Popular
                    </button>
                </div>
            </div>

            {/* Category Filters - Centered */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                {categories.map((category) => (
                    <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className="cursor-pointer text-sm px-4 py-2 transition-all hover:scale-105 font-medium"
                        onClick={() => onCategoryChange(category)}
                    >
                        {category}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
