"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

                {/* Sort Dropdown - Better Labels */}
                <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger className="w-full sm:w-[220px] text-base h-11">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">🆕</span>
                                <span>Latest Posts</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="popular">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">🔥</span>
                                <span>Most Popular</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
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
