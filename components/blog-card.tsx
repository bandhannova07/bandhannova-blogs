"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import type { Blog } from "@/lib/supabase/types";

// Support both old BlogPost format and new Blog format
interface BlogCardProps {
    post: Blog | {
        id: string;
        slug: string;
        title: string;
        excerpt: string;
        category: string;
        author: { name: string; avatar: string };
        publishedAt: Date;
        readTime: number;
        image: string;
    };
}

export function BlogCard({ post }: BlogCardProps) {
    // Handle both formats
    const author = 'author' in post ? post.author : { name: post.author_name, avatar: post.author_avatar };
    const publishedAt = 'publishedAt' in post ? post.publishedAt : new Date(post.published_at);
    const image = 'image' in post ? post.image : post.thumbnail_url;
    const readTime = 'readTime' in post ? post.readTime : post.read_time;

    return (
        <Link href={`/blog/${post.slug}`}>
            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 bg-card cursor-pointer h-full blog-card-gradient">
                {/* Image Section */}
                <CardHeader className="p-0 relative overflow-hidden">
                    <div className="relative h-64 w-full overflow-hidden">
                        <Image
                            src={image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-primary text-primary-foreground shadow-lg text-sm px-3 py-1">
                            {post.category}
                        </Badge>
                        <Badge variant="secondary" className="shadow-lg text-sm px-3 py-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Popular
                        </Badge>
                    </div>
                </CardHeader>

                {/* Content Section */}
                <CardContent className="p-4 sm:p-6 md:p-8 space-y-3 md:space-y-4">
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                        {post.title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.excerpt}
                    </p>
                </CardContent>

                {/* Footer Section */}
                <CardFooter className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 pt-0 flex flex-col gap-3 md:gap-4">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">{format(publishedAt, "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">{readTime} min read ⏱️</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-primary/10 ring-2 ring-primary/20">
                            <Image
                                src={author.avatar}
                                alt={author.name}
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-semibold">{author.name}</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
