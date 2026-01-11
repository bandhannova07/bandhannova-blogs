"use client";

import { Analytics } from "@vercel/analytics/next"
import { useState, useMemo, useEffect } from "react";
import { BlogHero } from "@/components/blog-hero";
import { BlogFilters } from "@/components/blog-filters";
import { BlogGrid } from "@/components/blog-grid";
import type { Blog } from "@/lib/supabase/types";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs from Supabase
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blogs");
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blogs || []);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter blogs based on category and search query
  const filteredPosts = useMemo(() => {
    return blogs.filter((post) => {
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
  }, [blogs, selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen">
      <BlogHero />

      <div id="blogs" className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24 space-y-12">
        <BlogFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <BlogGrid posts={filteredPosts} loading={loading} />
      </div>

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
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
