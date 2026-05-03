
"use client";

import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    Database,
    Terminal,
    Settings,
    LogOut,
    Sparkles,
    Search,
    Box,
    Users,
    ShoppingCart,
    Video,
    Globe
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface SidebarProps {
    className?: string;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function AdminSidebar({ className, activeTab, onTabChange }: SidebarProps) {
    const navItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "generate", label: "AI Generator", icon: Sparkles },
        { id: "blogs", label: "Blogs", icon: FileText },
        { id: "products", label: "Affiliates", icon: ShoppingCart },
        { id: "adsense", label: "AdSense", icon: Globe },
        { id: "brands", label: "Brand Ads", icon: Video },
        { id: "authors", label: "Authors", icon: Users },
    ];

    return (
        <div className={cn("flex flex-col h-screen border-r bg-zinc-950 text-white w-64 fixed left-0 top-0 z-50", className)}>
            <div className="p-6 border-b border-white/10">
                <div className="relative w-full h-8">
                    <Image
                        src="/bandhannova-logo-final.svg"
                        alt="BandhanNova"
                        fill
                        className="object-contain filter brightness-200"
                    />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mt-2 text-center">
                    Admin Portal
                </p>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="pb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-4 mb-2">Main Menu</p>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={cn(
                                "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group",
                                activeTab === item.id
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("h-4 w-4", activeTab === item.id ? "text-white" : "group-hover:text-primary transition-colors")} />
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="pt-4 border-t border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-4 mb-2">Support</p>
                    <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-white/5 hover:text-white transition-all">
                        <Settings className="h-4 w-4" />
                        Settings
                    </button>
                </div>
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={async () => {
                        await fetch("/api/auth/logout", { method: "POST" });
                        window.location.href = "/admin/login";
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </div>
    );
}
