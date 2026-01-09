"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import type { BlogPost } from "@/lib/blog-data";

interface BlogCardProps {
    post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 bg-card">
            {/* Image Section */}
            <CardHeader className="p-0 relative overflow-hidden">
                <div className="relative h-56 w-full overflow-hidden">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground shadow-lg">
                        {post.category}
                    </Badge>
                </div>
            </CardHeader>

            {/* Content Section */}
            <CardContent className="p-6 space-y-4">
                <h3 className="text-2xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {post.title}
                </h3>
                <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.excerpt}
                </p>
            </CardContent>

            {/* Footer Section */}
            <CardFooter className="px-6 pb-6 pt-0 flex flex-col gap-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(post.publishedAt, "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime} min read</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-primary/10">
                        <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{post.author.name}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
