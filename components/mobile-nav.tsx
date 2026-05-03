"use client";

import { Home, Search, TrendingUp, Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function MobileNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("Home");

    // Hide navbar in admin section
    if (pathname.startsWith("/admin")) return null;

    useEffect(() => {
        const handleScroll = () => {
            // Revert to Home if scrolled near top
            if (window.scrollY < 100 && pathname === "/") {
                setActiveTab("Home");
            }
        };

        const handleSearchFocus = () => {
            setActiveTab("Search");
        };

        const handleSearchUnfocus = () => {
            if (window.scrollY < 300) {
                setActiveTab("Home");
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("bn-search-focused", handleSearchFocus);
        window.addEventListener("bn-search-unfocused", handleSearchUnfocus);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("bn-search-focused", handleSearchFocus);
            window.removeEventListener("bn-search-unfocused", handleSearchUnfocus);
        };
    }, [pathname]);

    // Update active tab based on URL or logic
    useEffect(() => {
        if (pathname === "/") {
            const params = new URLSearchParams(window.location.search);
            if (params.get("tab") === "trending") setActiveTab("Trending");
            else if (!params.get("action")) setActiveTab("Home");
        } else {
            setActiveTab(""); // Reset for sub-pages
        }
    }, [pathname]);

    const navItems = [
        { label: "Home", icon: Home, action: () => { 
            setActiveTab("Home");
            router.push("/");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }},
        { label: "Search", icon: Search, action: () => {
            setActiveTab("Search");
            window.dispatchEvent(new CustomEvent("bn-focus-search"));
        }},
        { label: "Blogs", icon: Sparkles, action: () => {
            window.location.href = "/api/blogs/random";
        }},
        { label: "Trending", icon: TrendingUp, action: () => {
            setActiveTab("Trending");
            router.push("/?tab=trending");
        }},
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] md:hidden w-[92%] max-w-sm">
            <nav className="glass rounded-[1.8rem] border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.3)] bg-background/40 backdrop-blur-3xl px-3 py-2 flex items-center justify-around relative">
                {navItems.map((item) => {
                    const active = activeTab === item.label;
                    return (
                        <button
                            key={item.label}
                            onClick={item.action}
                            className={cn(
                                "relative flex flex-col items-center gap-0.5 transition-all duration-300 py-1",
                                active ? "text-primary" : "text-muted-foreground/50"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-xl transition-all duration-500",
                                active ? "bg-primary/5 shadow-[0_0_20px_rgba(32,149,243,0.3)]" : "bg-transparent"
                            )}>
                                <item.icon className={cn(
                                    "w-4.5 h-4.5 transition-all duration-500",
                                    active ? "stroke-[2.5px] text-primary scale-110" : "stroke-[1.8px]"
                                )} />
                            </div>
                            <span className={cn(
                                "text-[7px] font-black uppercase tracking-wider transition-all duration-300",
                                active ? "opacity-100 scale-105" : "opacity-70"
                            )}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
