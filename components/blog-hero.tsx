"use client";

import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const blogImages = [
    { src: "/hero/blog1.png", x: "15%", y: "20%", rotate: -12, size: 300, delay: 0 },
    { src: "/hero/blog2.png", x: "70%", y: "15%", rotate: 10, size: 280, delay: 0.2 },
    { src: "/hero/blog3.png", x: "10%", y: "65%", rotate: 8, size: 320, delay: 0.4 },
    { src: "/hero/blog4.png", x: "75%", y: "70%", rotate: -15, size: 260, delay: 0.6 },
    { src: "/hero/blog5.png", x: "42%", y: "10%", rotate: -5, size: 240, delay: 0.8 },
    { src: "/hero/blog6.png", x: "50%", y: "78%", rotate: 5, size: 350, delay: 1.0 },
    { src: "/hero/blog7.png", x: "5%", y: "40%", rotate: -20, size: 220, delay: 1.2 },
    { src: "/hero/blog8.png", x: "82%", y: "45%", rotate: 20, size: 200, delay: 1.4 },
    { src: "/hero/blog9.png", x: "30%", y: "75%", rotate: -10, size: 270, delay: 1.6 },
];

export function BlogHero() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacityTransform = useTransform(scrollY, [0, 300], [1, 0]);

    const titleWords = "Pioneering the Future of Digital Intelligence".split(" ");

    return (
        <div className="relative min-h-[90vh] md:min-h-screen flex flex-col overflow-hidden bg-background">
            {/* Background Image Collage - Spread from Center */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {blogImages.map((img, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: 0.7,
                            scale: 1,
                        }}
                        transition={{ duration: 1, delay: img.delay }}
                        style={{
                            left: img.x,
                            top: img.y,
                            rotate: img.rotate,
                        }}
                        className="absolute block"
                    >
                        <div className="relative group overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-[0_10px_30px_rgba(0,0,0,0.1)] md:shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 glass transition-all duration-500 hover:opacity-100 hover:scale-105">
                            <div className="relative w-[120px] h-[120px] md:w-[300px] md:h-[300px]" style={{ width: 'clamp(100px, 15vw, 300px)', height: 'clamp(100px, 15vw, 300px)' }}>
                                <Image
                                    src={img.src}
                                    alt="Blog Insight"
                                    fill
                                    className="object-cover opacity-80 md:opacity-100 transition-all duration-500 group-hover:scale-110"
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

            {/* Fixed Theme Toggle */}
            <div className="fixed top-4 right-4 z-50">
                <div className="glass p-1 rounded-full shadow-lg">
                    <ThemeToggle />
                </div>
            </div>

            {/* Hero Content */}
            <motion.div
                style={{ y: y1, opacity: opacityTransform }}
                className="relative flex-1 flex items-center justify-center z-10 py-10 md:py-0"
            >
                <div className="max-w-7xl mx-auto px-6 md:px-6 lg:px-8 text-center space-y-8 md:space-y-12">

                    {/* Logo Section */}
                    <div className="relative inline-block">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1,
                                y: [0, -15, 0] 
                            }}
                            transition={{ 
                                opacity: { duration: 1.5 },
                                scale: { duration: 1.5, ease: "easeOut" },
                                y: { 
                                    duration: 6, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }
                            }}
                        >
                            {/* Animated Chromatic Glow */}
                            <motion.div 
                                animate={{ 
                                    opacity: [0.2, 0.45, 0.2],
                                    scale: [0.8, 1.1, 0.8],
                                    rotate: [0, 360]
                                }}
                                transition={{ 
                                    opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                                    scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                                    rotate: { duration: 15, repeat: Infinity, ease: "linear" }
                                }}
                                className="absolute inset-[-10%] blur-[40px] md:blur-[100px] bg-gradient-to-tr from-primary via-purple-500/40 to-blue-400/30 rounded-full" 
                            />

                            {/* Center Core Glow */}
                            <div className="absolute inset-0 blur-[20px] md:blur-[40px] bg-primary/20 rounded-full" />
                            
                            <Image
                                src="/bandhannova-logo-final.svg"
                                alt="BandhanNova Logo"
                                width={500}
                                height={500}
                                className="relative z-10 w-[240px] sm:w-[300px] md:w-[450px] lg:w-[550px] drop-shadow-[0_25px_50px_rgba(0,0,0,0.2)] mx-auto"
                                priority
                            />
                        </motion.div>
                    </div>

                    {/* Heading */}
                    <div className="space-y-4 md:space-y-8 max-w-5xl mx-auto">
                        <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.2] md:leading-[1.1] flex flex-wrap justify-center gap-x-2 md:gap-x-4 text-[var(--hero-text)] transition-colors duration-300">
                            {titleWords.map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                    className={word === "Digital" || word === "Intelligence" ? "text-gradient" : "text-[var(--hero-text)] transition-colors duration-300"}
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="text-sm sm:text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium px-4"
                        >
                            Premium insights on technology, skills, and digital growth.
                        </motion.p>
                    </div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
                    >
                        <a
                            href="#blogs"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('blogs')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="group relative inline-flex h-12 md:h-14 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-primary px-8 md:px-10 py-3 md:py-4 text-base md:text-lg font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-xl"
                        >
                            <span className="relative z-10">Explore Insights</span>
                        </a>
                        <a
                            href="https://www.bandhannova.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative px-8 md:px-10 h-12 md:h-14 w-full sm:w-auto flex items-center justify-center rounded-full text-base md:text-lg font-bold border border-primary/20 transition-all hover:scale-105 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 group-hover:from-primary/20 transition-all duration-500" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(32,149,243,0.15)_0,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <span className="relative z-10">Visit Ecosystem</span>
                        </a>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/40"
            >
                <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">Scroll</span>
                <ArrowDown size={16} className="animate-bounce" />
            </motion.div>
        </div>
    );
}