"use client";

import { useState, useMemo } from "react";
import { BlogHero } from "@/components/blog-hero";
import { BlogFilters } from "@/components/blog-filters";
import { BlogGrid } from "@/components/blog-grid";
import { NewsletterSection } from "@/components/newsletter-section";
import { blogPosts } from "@/lib/blog-data";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter blogs based on category and search query
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <BlogHero />

      {/* Filters Section */}
      <BlogFilters
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Blog Grid */}
      <BlogGrid posts={filteredPosts} />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Footer */}
      <footer className="border-t py-12 px-4 md:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © 2026 BandhanNova AI Hub. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://www.bandhannova.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Visit BandhanNova.in
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
