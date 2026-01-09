"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2 } from "lucide-react";

export function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate subscription
        setSubscribed(true);
        setTimeout(() => {
            setEmail("");
            setSubscribed(false);
        }, 3000);
    };

    return (
        <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 gradient-bg opacity-90" />
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            {/* Floating Orbs */}
            <div className="absolute top-10 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

            <div className="relative max-w-4xl mx-auto">
                <div className="text-center space-y-6 text-white">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm">
                        <Mail className="h-8 w-8" />
                    </div>

                    {/* Heading */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                        Stay Updated with BandhanNova
                    </h2>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                        Subscribe to our newsletter and get the latest AI insights, tutorials, and updates delivered straight to your inbox.
                    </p>

                    {/* Form */}
                    {!subscribed ? (
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4"
                        >
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 bg-white/95 backdrop-blur-sm border-0 text-foreground placeholder:text-muted-foreground"
                            />
                            <Button
                                type="submit"
                                size="lg"
                                className="bg-white text-primary hover:bg-white/90 font-semibold whitespace-nowrap"
                            >
                                Subscribe
                            </Button>
                        </form>
                    ) : (
                        <div className="flex items-center justify-center gap-3 pt-4 animate-fade-in">
                            <CheckCircle2 className="h-6 w-6 text-green-400" />
                            <span className="text-lg font-medium">Thanks for subscribing!</span>
                        </div>
                    )}

                    {/* Privacy Note */}
                    <p className="text-sm text-white/70 pt-2">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </section>
    );
}
