"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function BlogHero() {
    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 lg:px-8 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 gradient-bg opacity-10" />
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="relative max-w-7xl mx-auto">
                <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
                    {/* Logo */}
                    <div className="relative w-64 h-16 md:w-80 md:h-20">
                        <Image
                            src="/bandhannova-logo-final.svg"
                            alt="BandhanNova AI Hub"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">AI-Powered Insights & Tutorials</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
                        Explore the Future of{" "}
                        <span className="gradient-text">AI & Technology</span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                        Discover cutting-edge insights, tutorials, and updates from BandhanNova AI Hub.
                        Stay ahead with the latest in AI, web development, and innovative technology.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button size="lg" className="group text-base px-8">
                            Explore Blogs
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                        <Button size="lg" variant="outline" className="text-base px-8">
                            Visit BandhanNova.in
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
