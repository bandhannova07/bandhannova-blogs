
"use client";

import { Twitter, Linkedin, Github, Globe, ExternalLink } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative py-24 px-6 md:px-8 lg:px-12 overflow-hidden border-t border-white/10">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 glass p-12 md:p-20 rounded-[3.5rem] border-white/20 dark:border-white/5 shadow-2xl bg-white/40 dark:bg-black/20 backdrop-blur-3xl">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-fill-transparent">
                                BandhanNova Blogs
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-md font-medium leading-relaxed">
                                Architecting the next generation of digital intelligence and high-performance learning ecosystems.
                            </p>
                        </div>
                        <div className="flex gap-6">
                            {[
                                { icon: Twitter, href: "#", label: "Twitter" },
                                { icon: Linkedin, href: "#", label: "LinkedIn" },
                                { icon: Github, href: "#", label: "GitHub" },
                                { icon: Globe, href: "https://www.bandhannova.in", label: "Website" }
                            ].map((social) => (
                                <a key={social.label} href={social.href} className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all shadow-lg border-white/20">
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col justify-between items-start lg:items-end gap-12">
                        <div className="space-y-6 w-full lg:w-auto">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">Global Ecosystem</h3>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                                <a href="#" className="text-sm font-bold hover:text-primary transition-colors">AI Hub</a>
                                <a href="#" className="text-sm font-bold hover:text-primary transition-colors">Smartpedia</a>
                                <a href="#" className="text-sm font-bold hover:text-primary transition-colors">Research</a>
                                <a href="#" className="text-sm font-bold hover:text-primary transition-colors">Academy</a>
                            </div>
                        </div>
                        <a href="https://www.bandhannova.in" target="_blank" rel="noopener noreferrer" className="group relative px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_20px_40px_rgba(32,149,243,0.3)] flex items-center gap-3 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <span>Explore Ecosystem</span>
                            <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </div>
                </div>
                <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-[1px] bg-muted-foreground/20" />
                        <span>© 2026 BandhanNova Platforms</span>
                    </div>
                    <div className="flex items-center gap-8">
                        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms</a>
                        <div className="w-8 h-[1px] bg-muted-foreground/20" />
                        <span>Engineered for Excellence</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
