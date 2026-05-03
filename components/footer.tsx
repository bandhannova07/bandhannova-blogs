
"use client";

import { Twitter, Linkedin, Github, Globe, ExternalLink } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="relative py-12 md:py-20 px-4 md:px-6 overflow-hidden border-t border-white/10 mb-[75px] md:mb-0">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 glass p-8 md:p-14 rounded-[2rem] md:rounded-[4rem] border-white/20 dark:border-white/5 shadow-2xl bg-background/40 backdrop-blur-3xl">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-fill-transparent">
                                BandhanNova Blogs
                            </h2>
                            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg font-medium leading-relaxed">
                                Architecting the next generation of digital intelligence and high-performance learning ecosystems.
                            </p>
                        </div>
                        <div className="flex gap-5">
                            {[
                                { icon: Twitter, href: "#", label: "Twitter" },
                                { icon: Linkedin, href: "#", label: "LinkedIn" },
                                { icon: Github, href: "#", label: "GitHub" },
                                { icon: Globe, href: "https://www.bandhannova.in", label: "Website" }
                            ].map((social) => (
                                <a key={social.label} href={social.href} className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all shadow-xl border-white/20">
                                    <social.icon size={22} />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col justify-between items-start lg:items-end gap-10">
                        <div className="space-y-6 w-full lg:w-auto">
                            <h3 className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.4em] text-primary/60">Quick Intelligence</h3>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                                <Link href="/about" className="text-sm sm:text-base md:text-lg font-bold hover:text-primary transition-colors">About Us</Link>
                                <Link href="/contact" className="text-sm sm:text-base md:text-lg font-bold hover:text-primary transition-colors">Contact</Link>
                                <Link href="/privacy" className="text-sm sm:text-base md:text-lg font-bold hover:text-primary transition-colors">Privacy</Link>
                                <Link href="/terms" className="text-sm sm:text-base md:text-lg font-bold hover:text-primary transition-colors">Terms</Link>
                            </div>
                        </div>
                        <a href="https://www.bandhannova.in" target="_blank" rel="noopener noreferrer" className="group relative px-8 md:px-10 py-4 md:py-5 rounded-2xl bg-primary text-primary-foreground font-black text-[10px] sm:text-[12px] md:text-sm uppercase tracking-[0.25em] hover:scale-105 transition-all shadow-[0_10px_25px_rgba(32,149,243,0.2)] flex items-center gap-3 md:gap-4 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <span>Explore Ecosystem</span>
                            <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
