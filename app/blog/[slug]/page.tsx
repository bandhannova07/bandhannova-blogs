import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { markdownToHtml } from "@/lib/markdown-utils";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBlogBySlug, getBlogsByCategory } from "@/lib/blog-service";
import type { Blog } from "@/lib/supabase/types";

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Fetch blog from API
// async function getBlogBySlug(slug: string): Promise<Blog | null> {
//     try {
//         const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
//         const response = await fetch(`${baseUrl}/api/blogs`, {
//             cache: 'no-store'
//         });

//         if (!response.ok) return null;

//         const data = await response.json();
//         const blog = data.blogs?.find((b: Blog) => b.slug === slug);
//         return blog || null;
//     } catch (error) {
//         console.error('Error fetching blog:', error);
//         return null;
//     }
// }

// Fetch related blogs
async function getRelatedBlogs(category: string, currentSlug: string): Promise<Blog[]> {
    try {
        const blogs = await getBlogsByCategory(category);
        return blogs
            .filter(blog => blog.slug !== currentSlug)
            .slice(0, 3);
    } catch (error) {
        console.error('Error fetching related blogs:', error);
        return [];
    }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = await getBlogBySlug(slug);

    if (!post) {
        return {
            title: "Blog Post Not Found",
        };
    }

    return {
        title: `${post.title} | BandhanNova AI Hub`,
        description: post.excerpt,
        keywords: post.tags.join(", "),
        authors: [{ name: post.author_name }],
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.published_at,
            authors: [post.author_name],
            images: [post.thumbnail_url],
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = await getBlogBySlug(slug);

    if (!post) {
        notFound();
    }

    // Get related posts
    const relatedPosts = await getRelatedBlogs(post.category, post.slug);

    // Convert markdown to HTML
    const contentHtml = markdownToHtml(post.content);

    return (
        <main className="min-h-screen">
            {/* Back Button */}
            <div className="border-b bg-muted/30">
                <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Blogs
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-[400px] md:h-[500px] w-full">
                <Image
                    src={post.thumbnail_url}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="max-w-4xl mx-auto space-y-4">
                        <Badge className="bg-primary text-primary-foreground">
                            {post.category}
                        </Badge>
                        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            {post.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <article className="py-12 md:py-16 px-4 md:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-6 pb-8 border-b mb-12">
                        <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-primary/10">
                                <Image
                                    src={post.author_avatar}
                                    alt={post.author_name}
                                    fill
                                    className="object-contain p-2"
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium text-foreground">{post.author_name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{format(new Date(post.published_at), "MMMM dd, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{post.read_time} min read</span>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-12">
                        {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    {/* Blog Content */}
                    <div
                        className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none dark:prose-invert
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
              prose-h1:text-3xl sm:prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:mb-6 sm:prose-h1:mb-8 prose-h1:leading-tight
              prose-h2:text-2xl sm:prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-10 sm:prose-h2:mt-12 md:prose-h2:mt-16 prose-h2:mb-4 sm:prose-h2:mb-6 prose-h2:leading-tight
              prose-h3:text-xl sm:prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-8 sm:prose-h3:mt-10 md:prose-h3:mt-12 prose-h3:mb-3 sm:prose-h3:mb-4
              prose-p:text-base sm:prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed prose-p:mb-4 sm:prose-p:mb-6 md:prose-p:mb-8 prose-p:text-foreground/90
              prose-ul:my-4 sm:prose-ul:my-6 md:prose-ul:my-8 prose-ul:space-y-2 sm:prose-ul:space-y-3
              prose-li:text-base sm:prose-li:text-lg md:prose-li:text-xl prose-li:leading-relaxed prose-li:text-foreground/90
              prose-strong:text-primary prose-strong:font-bold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-lg prose-img:shadow-lg
              prose-code:text-sm sm:prose-code:text-base
              px-2 sm:px-4"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="py-16 px-4 md:px-6 lg:px-8 bg-muted/30 border-t">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedPosts.map((relatedPost) => (
                                <Link
                                    key={relatedPost.slug}
                                    href={`/blog/${relatedPost.slug}`}
                                    className="group"
                                >
                                    <div className="space-y-4">
                                        <div className="relative h-48 w-full overflow-hidden rounded-lg">
                                            <Image
                                                src={relatedPost.thumbnail_url}
                                                alt={relatedPost.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                        <Badge>{relatedPost.category}</Badge>
                                        <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                                            {relatedPost.title}
                                        </h3>
                                        <p className="text-muted-foreground line-clamp-2">
                                            {relatedPost.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="border-t py-12 px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-sm text-muted-foreground">
                                © 2026 BandhanNova AI Hub. All rights reserved.
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <a
                                href="https://www.bandhannova.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Visit BandhanNova.in
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
