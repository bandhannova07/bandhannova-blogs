"use client";

import { Analytics } from "@vercel/analytics/next"
import { useState, useMemo, useEffect } from "react";
import { BlogHero } from "@/components/blog-hero";
import { BlogFilters } from "@/components/blog-filters";
import { BlogGrid } from "@/components/blog-grid";
import { BlogCard } from "@/components/blog-card";
import { Badge } from "@/components/ui/badge";
import type { Blog } from "@/lib/blog-service";
import { Github, Twitter, Linkedin, ExternalLink, Globe, ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/footer";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs from API
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

  // Filter and sort blogs
  const filteredPosts = useMemo(() => {
    let filtered = blogs.filter((post) => {
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

    // Sort blogs
    if (sortBy === "popular") {
      filtered.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    } else {
      // Shuffle for variety on every reload
      const shuffled = [...filtered];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    return filtered;
  }, [blogs, selectedCategory, searchQuery, sortBy]);

  return (
    <main className="min-h-screen bg-mesh relative overflow-x-hidden">
      <Analytics />

      <div className="relative z-10">
        <BlogHero />

        <div id="blogs" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-10 md:py-20 space-y-10 md:space-y-16">
          <BlogFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <BlogGrid posts={filteredPosts} loading={loading} />
        </div>

        {/* Premium Footer */}
        <Footer />
      </div>
    </main>
  );
}

