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
}

export function BlogFilters({
    selectedCategory,
    onCategoryChange,
    searchQuery,
    onSearchChange,
}: BlogFiltersProps) {
    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg"
                />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {categories.map((category) => (
                    <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 transition-all hover:scale-105"
                        onClick={() => onCategoryChange(category)}
                    >
                        {category}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
