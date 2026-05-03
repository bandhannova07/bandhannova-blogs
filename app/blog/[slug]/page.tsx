import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { inlineMarkdownToHtml, markdownToHtml } from "@/lib/markdown-utils";
import { injectAdsIntoContent } from "@/lib/ad-injector";
import { Calendar, Clock, User, ArrowLeft, Brain, Quote, HelpCircle, Share2, ExternalLink, Github, Twitter, Linkedin, Globe } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBlogBySlug, getBlogsByCategory, getAllBlogs, getAuthorByName } from "@/lib/blog-service";
import { KnowledgeCard } from "@/components/knowledge-card";
import { ReadProgressBar } from "@/components/read-progress-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { SectionedBlogContent } from "@/components/sectioned-blog-content";
import { BrandAdWidget } from "@/components/widgets/brand-ad-widget";
import { ViewIncrementer } from "@/components/view-incrementer";
import { Footer } from "@/components/footer";
import { DEMO_BLOG_DATA } from "@/lib/demo-data";
import { MOCK_BLOG_DATA } from "@/lib/data";
import { BlogPostHeader } from "@/components/blog-post-header";
import type { Blog, Author } from "@/lib/blog-service";

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getRelatedBlogs(category: string, currentSlug: string): Promise<Blog[]> {
    if (currentSlug === 'demo') {
        const allBlogs = await getAllBlogs();
        return allBlogs.slice(0, 3);
    }
    try {
        let blogs = await getBlogsByCategory(category);
        let related = blogs.filter(blog => blog.slug !== currentSlug);

        if (related.length < 3) {
            const allBlogs = await getAllBlogs();
            const others = allBlogs.filter(b => b.slug !== currentSlug && !related.some(r => r.id === b.id));
            related = [...related, ...others].slice(0, 3);
        }

        return related;
    } catch (error) {
        console.error('Error fetching related blogs:', error);
        return [];
    }
}

export async function generateMetadata({ params }: BlogPostPageProps) {
    const { slug } = await params;
    let post: any = null;
    if (slug === 'demo') {
        post = {
            ...DEMO_BLOG_DATA,
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            thumbnail_url: 'https://images.unsplash.com/photo-1620712943543-bcc4628c9455?auto=format&fit=crop&q=80&w=1200'
        };
    } else if (slug === MOCK_BLOG_DATA.slug) {
        post = MOCK_BLOG_DATA;
    } else {
        post = await getBlogBySlug(slug);
    }
    if (!post) return { title: "Blog Post Not Found" };

    const keywords = [...post.tags, post.category, 'Best', 'Top', 'Ultimate', 'Guide', 'Review', 'Comparison',
        'Tips', 'Tricks', 'Hacks', 'Ideas',
        'How to', 'Why', 'What is', 'Step by step', 'Beginner guide', 'Easy way', 'Fastest way',
        'Earn money', 'Make money online', 'Free', 'Discount', 'Deals', 'Cheap', 'Affordable',
        'Latest', 'New', 'Updated', 'Trending', 'Viral', '2026',
        'How to start a blog in 2026', 'Best free tools for blogging',
        'Make money blogging step by step', 'SEO tips for beginners 2026',
        'Top blogging platforms comparison'].join(', ');

    return {
        title: `${post.title} | BandhanNova AI Hub`,
        description: post.excerpt,
        keywords: keywords,
        alternates: {
            canonical: `https://blogs.bandhannova.in/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `https://blogs.bandhannova.in/blog/${post.slug}`,
            siteName: 'BandhanNova Blogs',
            locale: 'en_US',
            type: 'article',
            publishedTime: post.published_at,
            modifiedTime: post.updated_at,
            authors: [post.author_name],
            images: [
                {
                    url: post.thumbnail_url,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.thumbnail_url],
            creator: '@BandhanNova',
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    let post: any = null;
    if (slug === 'demo') {
        post = {
            ...DEMO_BLOG_DATA,
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            thumbnail_url: 'https://images.unsplash.com/photo-1620712943543-bcc4628c9455?auto=format&fit=crop&q=80&w=1200',
            author_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=BandhanNova',
            read_time: 10,
            slug: 'demo'
        };
    } else if (slug === MOCK_BLOG_DATA.slug) {
        post = MOCK_BLOG_DATA;
    } else {
        post = await getBlogBySlug(slug);
    }
    if (!post) notFound();

    const relatedPosts = await getRelatedBlogs(post.category, post.slug);
    const author = await getAuthorByName(post.author_name);
    const contentHtml = markdownToHtml(post.content);
    const contentWithAds = injectAdsIntoContent(contentHtml);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.thumbnail_url,
        "author": {
            "@type": "Person",
            "name": post.author_name,
            "url": `https://blogs.bandhannova.in/author/${post.author_name.toLowerCase().replace(/ /g, '-')}`
        },
        "publisher": {
            "@type": "Organization",
            "name": "BandhanNova",
            "logo": {
                "@type": "ImageObject",
                "url": "https://blogs.bandhannova.in/favicon.ico"
            }
        },
        "datePublished": post.published_at,
        "dateModified": post.updated_at,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://blogs.bandhannova.in/blog/${post.slug}`
        },
        "keywords": post.tags.join(", "),
        "articleSection": post.category
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://blogs.bandhannova.in"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": post.category,
                "item": `https://blogs.bandhannova.in/category/${post.category.toLowerCase()}`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://blogs.bandhannova.in/blog/${post.slug}`
            }
        ]
    };

    return (
        <main className="min-h-screen bg-mesh relative">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <ReadProgressBar />
            <ViewIncrementer blogId={post.id} />

            {/* Back Navigation */}
            <BlogPostHeader />

            {/* Article Hero Section */}
            <div className="max-w-[1800px] mx-auto px-4 md:px-6 pt-4 md:pt-8 pb-12 md:pb-16">
                <header className="relative w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 aspect-video md:aspect-[21/9] group">
                    {/* Main Image */}
                    <Image
                        src={post.thumbnail_url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-[5000ms] ease-in-out group-hover:scale-110"
                        priority
                    />

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent hidden md:block transition-opacity duration-300" />

                    {/* Hero Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 lg:p-24 space-y-6 md:space-y-8">
                        <div className="max-w-5xl space-y-6">
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
                                <Badge className="bg-primary text-primary-foreground px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-xl">
                                    {post.category}
                                </Badge>
                                <div className="flex items-center gap-2 md:gap-3 text-white/80 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] bg-white/10 backdrop-blur-md px-4 md:px-6 py-1.5 md:py-2 rounded-full border border-white/10">
                                    <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                                    {format(new Date(post.published_at), "MMM dd, yyyy")}
                                </div>
                            </div>

                            <h1
                                className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-white animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 fill-mode-both"
                                style={{ transition: 'color 0.3s ease' }}
                                dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(post.title) }}
                            />

                            <p
                                className="text-sm md:text-lg lg:text-xl text-white/70 font-medium leading-relaxed max-w-3xl line-clamp-3 md:line-clamp-none animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both"
                                style={{ transition: 'color 0.3s ease' }}
                                dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(post.excerpt) }}
                            />

                            <div className="hidden md:flex flex-wrap items-center gap-6 md:gap-10 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 fill-mode-both">
                                <div className="flex items-center gap-4 group/author cursor-pointer">
                                    <div className="relative h-12 w-12 md:h-16 md:w-16 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl transition-transform group-hover/author:scale-110">
                                        <Image src={post.author_avatar} alt={post.author_name} fill className="object-cover" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm md:text-base font-black tracking-tight text-white">{post.author_name}</p>
                                        <p className="text-[10px] md:text-xs uppercase font-black tracking-widest text-primary">
                                            {author?.profession || "Intelligence Architect"}
                                        </p>
                                    </div>
                                </div>

                                <div className="h-10 w-px bg-white/10 hidden sm:block" />

                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Estimated Read</span>
                                        <div className="flex items-center gap-2 font-black text-xs md:text-sm text-white">
                                            <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                                            {post.read_time} Minutes
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Mobile Writer Details & Read Time (Moved below image) */}
                <div className="md:hidden flex items-center justify-between mt-6 px-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                            <Image src={post.author_avatar} alt={post.author_name} fill className="object-cover" />
                        </div>
                        <div className="space-y-0">
                            <p className="text-[11px] font-black tracking-tight text-foreground">{post.author_name}</p>
                            <p className="text-[8px] uppercase font-black tracking-[0.15em] text-primary">
                                {author?.profession || "Intelligence Architect"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/50">Read Time</span>
                            <div className="flex items-center gap-1.5 font-black text-[10px] text-foreground">
                                <Clock className="h-3 w-3 text-primary" />
                                {post.read_time} MIN
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Author Bio Section (Desktop Sidebar Style or Mobile Inset) */}
            {author?.bio && (
                <div className="max-w-[1800px] mx-auto px-6 mb-12">
                    <div className="glass rounded-[2rem] p-8 md:p-10 border-white/10 bg-primary/5 flex flex-col md:flex-row items-center gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-3xl overflow-hidden border-2 border-primary/20 shadow-2xl flex-shrink-0">
                            <Image src={author.avatar || post.author_avatar} alt={author.name} fill className="object-cover" />
                        </div>
                        <div className="space-y-4 text-center md:text-left flex-1">
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter">{author.name}</h3>
                                <p className="text-xs uppercase font-black tracking-widest text-primary mt-1">{author.profession}</p>
                            </div>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                {author.bio}
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                {/* Social links removed per request to simplify authors */}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 1-Column Content Layout */}
            <div className="max-w-[1800px] mx-auto px-6 pb-32">
                <article className="space-y-16 min-w-0">

                    <SectionedBlogContent
                        contentHtml={contentWithAds}
                        sectionLayouts={post.section_layouts || []}
                    />

                    {/* Tags */}
                    <div className="flex flex-wrap gap-4 pt-12 border-t border-white/10">
                        {post.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer">
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                </article>
            </div>

            {/* Related Articles Grid */}
            {relatedPosts.length > 0 && (
                <section className="py-32 px-6 bg-primary/5 border-t border-white/5">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Parallel Intelligence</h2>
                                <p className="text-xl text-muted-foreground font-medium">Explore more nodes in the {post.category} cluster.</p>
                            </div>
                            <Link href="/#blogs">
                                <Button className="rounded-full px-10 py-6 font-black uppercase tracking-widest text-xs shadow-2xl">View All Intelligence</Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {relatedPosts.map((relatedPost) => (
                                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group">
                                    <div className="space-y-6">
                                        <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
                                            <Image src={relatedPost.thumbnail_url} alt={relatedPost.title} fill className="object-cover" />
                                        </div>
                                        <div className="space-y-3">
                                            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-4 text-[10px] font-black uppercase tracking-widest">{relatedPost.category}</Badge>
                                            <h3 className="text-2xl font-black tracking-tight line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                                {relatedPost.title}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Premium Unified Footer */}
            <Footer />
        </main>
    );
}
