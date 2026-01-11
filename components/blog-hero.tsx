"use client";

import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { motion } from 'framer-motion';

export function BlogHero() {
    return (
        <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-background">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-50" />

            {/* Fixed Theme Toggle - Top Right Corner */}
            <div className="fixed top-3 right-3 md:top-4 md:right-4 z-50">
                <ThemeToggle />
            </div>

            {/* Hero Content - Centered Vertically */}
            <div className="relative flex-1 flex items-center justify-center">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center space-y-12">

                    {/* Logo - Centered */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex justify-center"
                    >
                        <div className="relative animate-float">
                            <div className="absolute inset-0 blur-3xl opacity-50" style={{ background: 'var(--gradient-hero)' }} />
                            <Image
                                src="/bandhannova-logo-final.svg"
                                alt="BandhanNova Logo"
                                width={650}
                                height={650}
                                className="relative z-10"
                                priority
                            />
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                            Simple Guides for{" "}
                            <span
                                className="inline-block"
                                style={{
                                    background: "linear-gradient(135deg, #C683D7 0%, #223CCF 50%, #00D9FF 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text"
                                }}
                            >
                                Smart Learning
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Easy-to-follow blogs on technology, skills, and digital growth — written to be practical, clear, and useful.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
                        <a
                            href="#blogs"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('blogs')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl hover:scale-105"
                        >
                            Explore Blogs
                        </a>
                        <a
                            href="https://www.bandhannova.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-primary px-8 py-4 text-lg font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105"
                        >
                            Visit BandhanNova.in
                        </a>
                    </div>

                </div>
            </div>

            {/* Bottom Wave */}
            <div className="relative h-16 md:h-24">
                <svg
                    className="absolute bottom-0 w-full h-full"
                    viewBox="0 0 1440 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
                        className="fill-background"
                    />
                </svg>
            </div>
        </div>
    );
}