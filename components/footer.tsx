
"use client";

import { Twitter, Linkedin, Github, Globe, ExternalLink } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="relative py-12 md:py-16 px-4 md:px-6 overflow-hidden border-t border-white/10">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 glass p-6 md:p-10 rounded-[3.5rem] border-white/20 dark:border-white/5 shadow-2xl bg-background/40 backdrop-blur-3xl">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-fill-transparent">
                                BandhanNova Blogs
                            </h2>
                            <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-md font-medium leading-relaxed">
                                Architecting the next generation of digital intelligence and high-performance learning ecosystems.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            {[
                                { icon: Twitter, href: "#", label: "Twitter" },
                                { icon: Linkedin, href: "#", label: "LinkedIn" },
                                { icon: Github, href: "#", label: "GitHub" },
                                { icon: Globe, href: "https://www.bandhannova.in", label: "Website" }
                            ].map((social) => (
                                <a key={social.label} href={social.href} className="w-10 h-10 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all shadow-lg border-white/20">
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col justify-between items-start lg:items-end gap-8">
                        <div className="space-y-4 w-full lg:w-auto">
                            <h3 className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Quick Intelligence</h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                                <Link href="/about" className="text-[10px] sm:text-xs md:text-sm font-bold hover:text-primary transition-colors">About Us</Link>
                                <Link href="/contact" className="text-[10px] sm:text-xs md:text-sm font-bold hover:text-primary transition-colors">Contact</Link>
                                <Link href="/privacy" className="text-[10px] sm:text-xs md:text-sm font-bold hover:text-primary transition-colors">Privacy</Link>
                                <Link href="/terms" className="text-[10px] sm:text-xs md:text-sm font-bold hover:text-primary transition-colors">Terms</Link>
                            </div>
                        </div>
                        <a href="https://www.bandhannova.in" target="_blank" rel="noopener noreferrer" className="group relative px-6 md:px-8 py-3 md:py-4 rounded-xl bg-primary text-primary-foreground font-black text-[8px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_20px_40px_rgba(32,149,243,0.3)] flex items-center gap-2 md:gap-3 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <span>Explore Ecosystem</span>
                            <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </div>
                </div>
                <div className="mt-8 md:mt-12 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 text-[7px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground/30">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-[1px] bg-muted-foreground/20" />
                        <span>© 2026 BandhanNova Platforms</span>
                    </div>
                    <div className="flex items-center gap-4 md:gap-8">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <div className="w-6 h-[1px] bg-muted-foreground/20" />
                        <span>Engineered for Excellence</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
