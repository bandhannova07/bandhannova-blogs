"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    const router = useRouter();

    // Handle both formats
    const author = 'author' in post ? post.author : { name: post.author_name, avatar: post.author_avatar };
    const publishedAt = 'publishedAt' in post ? post.publishedAt : new Date(post.published_at);
    const image = 'image' in post ? post.image : post.thumbnail_url;
    const readTime = 'readTime' in post ? post.readTime : post.read_time;

    const handleClick = () => {
        router.push(`/blog/${post.slug}`);
    };

    return (
        <Card
            onClick={handleClick}
            className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 bg-card cursor-pointer h-full blog-card-gradient"
        >
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
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="font-medium">{format(publishedAt, "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="font-medium">{readTime} min ⏱️</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden bg-muted">
                            <Image
                                src={author.avatar}
                                alt={author.name}
                                fill
                                className="object-contain p-1 sm:p-2"
                            />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-semibold">{author.name}</p>
                            <p className="text-xs text-muted-foreground">Author</p>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
