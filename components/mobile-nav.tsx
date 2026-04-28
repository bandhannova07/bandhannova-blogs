"use client";

import { Home, Search, TrendingUp, Sparkles, User, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MobileNav() {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { label: "Home", icon: Home, path: "/" },
        { label: "Blogs", icon: Sparkles, path: "/#blogs" },
        { label: "Search", icon: Search, path: "/#blogs" }, // Redirects to search area
        { label: "Trending", icon: TrendingUp, path: "/#blogs" }, // Redirects to blogs area
    ];

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        if (path.includes("#")) return pathname === "/" || pathname.startsWith("/blog");
        return pathname.startsWith(path);
    };

    const handleNavClick = (path: string) => {
        if (path.startsWith("/#")) {
            if (pathname === "/") {
                const element = document.getElementById(path.substring(2));
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            } else {
                router.push(path);
            }
        } else {
            router.push(path);
        }
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] md:hidden w-[90%] max-w-sm">
            <nav className="glass rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-background/40 backdrop-blur-3xl px-4 py-3 flex items-center justify-around relative">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <button
                            key={item.label}
                            onClick={() => handleNavClick(item.path)}
                            className={cn(
                                "relative flex flex-col items-center gap-1 transition-all duration-300",
                                active ? "text-primary" : "text-muted-foreground/60 hover:text-primary/60"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-2xl transition-all duration-500",
                                active ? "bg-primary/10 shadow-[0_0_20px_rgba(32,149,243,0.2)]" : "bg-transparent"
                            )}>
                                <item.icon className={cn(
                                    "w-5 h-5",
                                    active ? "stroke-[2.5px]" : "stroke-[1.5px]"
                                )} />
                            </div>
                            <span className={cn(
                                "text-[8px] font-black uppercase tracking-[0.1em]",
                                active ? "opacity-100" : "opacity-0"
                            )}>
                                {item.label}
                            </span>
                            {active && (
                                <motion.div
                                    layoutId="mobileNavIndicator"
                                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
