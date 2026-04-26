"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowUpRight, User } from "lucide-react";
import { format } from "date-fns";
import type { Blog } from "@/lib/blog-service";
import { motion } from "framer-motion";

interface BlogCardProps {
    post: Blog;
}

export function BlogCard({ post }: BlogCardProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/blog/${post.slug}`);
    };

    return (
        <Card
            onClick={handleClick}
            className="group relative h-full overflow-hidden border-0 cursor-pointer glass-card bg-white/50 dark:bg-black/40 backdrop-blur-md transition-all duration-300 rounded-[2rem] shadow-xl hover:-translate-y-2"
        >
            <CardHeader className="p-0 relative overflow-hidden h-48 md:h-56">
                <Image
                    src={post.thumbnail_url}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />

                {/* Floating Category Badge */}
                <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-primary/90 text-primary-foreground border-0 px-3 py-1 text-[8px] md:text-[9px] font-black uppercase tracking-wider rounded-full">
                        {post.category}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
                <div className="flex items-center gap-3 md:gap-4 text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-1 md:gap-1.5">
                        <Calendar size={10} className="text-primary" />
                        {format(new Date(post.published_at), "MMM dd")}
                    </span>
                    <span className="flex items-center gap-1 md:gap-1.5">
                        <Clock size={10} className="text-primary" />
                        {post.read_time} min
                    </span>
                </div>

                <h3 className="text-lg md:text-xl font-black leading-tight tracking-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {post.title}
                </h3>

                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 font-medium opacity-80 leading-relaxed">
                    {post.excerpt}
                </p>
            </CardContent>

            <CardFooter className="px-4 md:px-6 pb-4 md:pb-6 pt-0 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 rounded-xl overflow-hidden border border-primary/10 bg-muted shadow-md">
                        <Image
                            src={post.author_avatar}
                            alt={post.author_name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-xs font-black">{post.author_name}</p>
                        <span className="text-[8px] uppercase font-black tracking-widest opacity-50">Writer</span>
                    </div>
                </div>

                <div className="h-9 w-9 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                    <ArrowUpRight className="h-4 w-4 text-primary group-hover:text-white transition-colors" />
                </div>
            </CardFooter>
        </Card>
    );
}

