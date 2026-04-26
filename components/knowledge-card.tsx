"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, ExternalLink, Calendar, MapPin, Tag, ShieldCheck, Brain, Quote, HelpCircle, Activity, Zap, Layers } from 'lucide-react';
import { motion } from "framer-motion";

// Map of icons for safe passing from Server to Client components
const IconMap: Record<string, React.ElementType> = {
    brain: Brain,
    quote: Quote,
    help: HelpCircle,
    activity: Activity,
    zap: Zap,
    layers: Layers,
    tag: Tag,
    calendar: Calendar,
    map: MapPin,
    shield: ShieldCheck
};

interface KnowledgeFact {
    label: string;
    value: string;
    icon?: string; // Icon name as string
}

interface KnowledgeCardProps {
    title: string;
    subtitle?: string;
    description: string;
    image?: string;
    facts: KnowledgeFact[];
    sourceUrl?: string;
    sourceName?: string;
    lastUpdated?: string;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
    title,
    subtitle,
    description,
    image,
    facts,
    sourceUrl,
    sourceName = "BandhanNova Smartpedia",
    lastUpdated
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
            <Card className="w-full max-w-md overflow-hidden transition-all duration-500 glass-card bg-white/40 dark:bg-black/20 backdrop-blur-3xl border-white/20 dark:border-white/5 rounded-[2.5rem] shadow-2xl group">
                {image && (
                    <div className="relative h-56 w-full overflow-hidden">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-2"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />
                        
                        <div className="absolute top-6 right-6">
                            <div className="p-3 rounded-2xl glass bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                    </div>
                )}

                <CardHeader className="pb-4 pt-8 px-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-3">
                            <Badge className="text-[10px] font-black tracking-[0.3em] uppercase text-primary border-primary/20 bg-primary/5 px-4 py-1.5 rounded-full">
                                SMARTPEDIA VERIFIED
                            </Badge>
                            <CardTitle className="text-3xl font-black tracking-tight leading-none">{title}</CardTitle>
                            {subtitle && <p className="text-sm text-muted-foreground font-black uppercase tracking-widest opacity-60">{subtitle}</p>}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-8 px-8 pb-10">
                    <div className="relative">
                        <div className="absolute left-0 top-0 w-1 h-full bg-primary/20 rounded-full" />
                        <p className="text-base leading-relaxed text-foreground font-medium italic pl-6 opacity-90">
                            "{description}"
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 py-6 border-y border-primary/10">
                        {facts.map((fact, index) => {
                            const IconComponent = fact.icon ? IconMap[fact.icon.toLowerCase()] || Tag : Tag;
                            return (
                                <div key={index} className="flex items-center gap-5 group/fact">
                                    <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover/fact:bg-primary group-hover/fact:text-primary-foreground transition-all duration-300 shadow-sm">
                                        <IconComponent className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-black opacity-50">
                                            {fact.label}
                                        </span>
                                        <span className="text-sm font-black tracking-tight">{fact.value}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                        {sourceUrl ? (
                            <a
                                href={sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs flex items-center gap-2 text-primary hover:underline font-black uppercase tracking-widest group/link"
                            >
                                <span className="p-1.5 rounded-lg bg-primary/10 group-hover/link:bg-primary/20 transition-colors">
                                    <ExternalLink className="w-3 h-3" />
                                </span>
                                {sourceName}
                            </a>
                        ) : (
                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-50">Source: {sourceName}</span>
                        )}

                        {lastUpdated && (
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-50 bg-muted/30 px-4 py-2 rounded-full">
                                <Calendar className="w-3 h-3 text-primary" />
                                {lastUpdated}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};
