"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
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
        <section className="py-8 md:py-12 px-4 md:px-6 lg:px-8 border-b bg-muted/30">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Search Bar */}
                <div className="relative max-w-xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search blogs..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-12 h-12 text-base shadow-sm"
                    />
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {categories.map((category) => (
                        <Badge
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-300 ${selectedCategory === category
                                    ? "shadow-lg scale-105"
                                    : "hover:scale-105 hover:shadow-md"
                                }`}
                            onClick={() => onCategoryChange(category)}
                        >
                            {category}
                        </Badge>
                    ))}
                </div>
            </div>
        </section>
    );
}
