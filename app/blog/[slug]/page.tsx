import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { markdownToHtml } from "@/lib/markdown-utils";
import { injectAdsIntoContent } from "@/lib/ad-injector";
import { Calendar, Clock, User, ArrowLeft, Brain, Quote, HelpCircle, Share2, ExternalLink, Github, Twitter, Linkedin, Globe } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBlogBySlug, getBlogsByCategory, getAllBlogs } from "@/lib/blog-service";
import { KnowledgeCard } from "@/components/knowledge-card";
import { ReadProgressBar } from "@/components/read-progress-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { SectionedBlogContent } from "@/components/sectioned-blog-content";
import { BrandAdWidget } from "@/components/widgets/brand-ad-widget";
import { Footer } from "@/components/footer";
import { DEMO_BLOG_DATA } from "@/lib/demo-data";
import { MOCK_BLOG_DATA } from "@/lib/data";
import type { Blog } from "@/lib/blog-service";

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
    return {
        title: `${post.title} | BandhanNova AI Hub`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.thumbnail_url],
        }
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
    const contentHtml = markdownToHtml(post.content);
    const contentWithAds = injectAdsIntoContent(contentHtml);

    return (
        <main className="min-h-screen bg-mesh relative">
            <ReadProgressBar />

            {/* Back Navigation */}
            <div className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/#blogs">
                        <Button variant="ghost" className="gap-2 md:gap-3 font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-primary/10 hover:text-primary transition-all rounded-full px-4 md:px-6">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Back to Knowledge Hub</span>
                            <span className="sm:hidden">Back</span>
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2 md:gap-4">
                        <ThemeToggle />
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 w-12 h-12 md:w-14 md:h-14">
                            <Share2 className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Article Hero Section */}
            <div className="max-w-[1800px] mx-auto px-6 pt-8 pb-16">
                <header className="relative w-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 aspect-[21/9] md:aspect-video lg:aspect-[21/9] group">
                    {/* Main Image */}
                    <Image
                        src={post.thumbnail_url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                        priority
                    />

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent hidden md:block" />

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

                            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-white animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 fill-mode-both">
                                {post.title}
                            </h1>

                            <p className="text-sm md:text-lg lg:text-xl text-white/70 font-medium leading-relaxed max-w-3xl line-clamp-3 md:line-clamp-none animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
                                {post.excerpt}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 md:gap-10 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 fill-mode-both">
                                <div className="flex items-center gap-4 group/author cursor-pointer">
                                    <div className="relative h-12 w-12 md:h-16 md:w-16 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl transition-transform group-hover/author:scale-110">
                                        <Image src={post.author_avatar} alt={post.author_name} fill className="object-cover" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm md:text-base font-black tracking-tight text-white">{post.author_name}</p>
                                        <p className="text-[10px] md:text-xs uppercase font-black tracking-widest text-primary">Lead Architect</p>
                                    </div>
                                </div>

                                <div className="h-10 w-px bg-white/10 hidden sm:block" />

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
                </header>
            </div>

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
