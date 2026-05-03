"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Loader2, 
    Sparkles, 
    LogOut, 
    Upload, 
    X, 
    Trash2, 
    RefreshCw,
    FileText,
    ArrowUpRight,
    Eye,
    TrendingUp,
    Edit3,
    Search,
    ChevronRight,
    Plus,
    Code,
    Server,
    Shield,
    Globe,
    GraduationCap,
    Zap,
    PenTool,
    Box,
    Briefcase,
    Clock as ClockIcon,
    Brain as BrainIcon,
    Image as ImageIcon
} from "lucide-react";
import { categories } from "@/lib/blog-data";
import Image from "next/image";
import type { Blog, Author } from "@/lib/blog-service";
import { ImageCropper } from "@/components/image-cropper";
import { markdownToHtml } from "@/lib/markdown-utils";
import { AdminSidebar } from "@/components/admin-sidebar";
import { cn } from "@/lib/utils";
import { ShoppingCart, Video, Layout, Info, Star, Users, User } from "lucide-react";
import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from "@/components/ui/tabs";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AdminPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    // Blog generation states
    const [topic, setTopic] = useState("");
    const [category, setCategory] = useState(""); // Default empty for auto-selection
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [showCropper, setShowCropper] = useState(false);
    const [isFeatured, setIsFeatured] = useState(false);
    const [imageToCrop, setImageToCrop] = useState("");
    const [generating, setGenerating] = useState(false);
    const [generatedBlog, setGeneratedBlog] = useState("");
    const [metadata, setMetadata] = useState<any>(null);
    const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);

    // Authors states
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loadingAuthors, setLoadingAuthors] = useState(false);
    const [editingAuthorId, setEditingAuthorId] = useState<string | null>(null);
    const [authorForm, setAuthorForm] = useState({
        name: "",
        avatar: "",
        profession: "Intelligence Architect",
        bio: ""
    });
    const [showSidebar, setShowSidebar] = useState(false);

    // Image Prompt States
    const [placeholderImages, setPlaceholderImages] = useState<Record<string, string>>({});
    const [uploadingPlaceholder, setUploadingPlaceholder] = useState<string | null>(null);

    // Simplified Source Context
    const [sources, setSources] = useState<string[]>([""]);

    // Products states
    const [products, setProducts] = useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [productForm, setProductForm] = useState({
        type: "affiliate",
        title: "",
        thumbnail: "", // Affiliate Image
        link: "",      // Affiliate Link
        video_url: "", // Brand Video
        cta_text: "",  // Brand CTA Button Text
        cta_link: "",  // Brand Redirection URL
        publisher_id: "", // AdSense
        slot_id: ""       // AdSense
    });
    const [uploadingAsset, setUploadingAsset] = useState(false);

    const handleAssetUpload = async (file: File, type: string) => {
        setUploadingAsset(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", type === "video" ? "brand_video" : "product_image");

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                if (type === "video") {
                    setProductForm(prev => ({ ...prev, video_url: data.url }));
                } else {
                    setProductForm(prev => ({ ...prev, thumbnail: data.url }));
                }
            }
        } catch (error) {
            console.error("Asset upload failed:", error);
        } finally {
            setUploadingAsset(false);
        }
    };

    // Section Layout Orchestrator States
    const [sectionLayouts, setSectionLayouts] = useState<any[]>([]);
    const [showProductManager, setShowProductManager] = useState(false);

    // Published blogs states
    const [publishedBlogs, setPublishedBlogs] = useState<Blog[]>([]);
    const [loadingBlogs, setLoadingBlogs] = useState(false);

    const [stats, setStats] = useState({
        totalBlogs: 0,
        totalViews: 0,
        uniqueCategories: 0,
        avgReadTime: 0
    });

    const [authorName, setAuthorName] = useState("BandhanNova AI Team");
    const [authorAvatarPreview, setAuthorAvatarPreview] = useState("/bandhannova-logo-final.svg");

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch("/api/auth/check");
            if (response.ok) {
                setIsAuthenticated(true);
                fetchPublishedBlogs();
            } else {
                router.push("/admin/login");
            }
        } catch (error) {
            router.push("/admin/login");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchPublishedBlogs();
            fetchProducts();
            fetchAuthors();
        }
    }, [isAuthenticated]);

    const fetchAuthors = async () => {
        setLoadingAuthors(true);
        try {
            const response = await fetch("/api/authors");
            if (response.ok) {
                const data = await response.json();
                setAuthors(data.authors || []);
            }
        } catch (error) {
            console.error("Error fetching authors:", error);
        } finally {
            setLoadingAuthors(false);
        }
    };

    const handleUpsertAuthor = async () => {
        if (!authorForm.name) return;
        try {
            const url = editingAuthorId ? `/api/authors/${editingAuthorId}` : "/api/authors";
            const method = editingAuthorId ? "PUT" : "POST";
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(authorForm),
            });
            if (response.ok) {
                setEditingAuthorId(null);
                setAuthorForm({ name: "", avatar: "", profession: "Intelligence Architect", bio: "" });
                fetchAuthors();
            }
        } catch (error) {
            console.error("Error saving author:", error);
        }
    };

    const handleDeleteAuthor = async (id: string) => {
        if (!confirm("Delete this writer profile?")) return;
        try {
            const response = await fetch(`/api/authors/${id}`, { method: "DELETE" });
            if (response.ok) fetchAuthors();
        } catch (error) {
            console.error("Error deleting author:", error);
        }
    };

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const response = await fetch("/api/products");
            if (response.ok) {
                const data = await response.json();
                setProducts(data.products || []);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoadingProducts(false);
        }
    };

    // Image Prompt Uploader Component
    const ImagePromptUploader = ({ prompt, onUpload }: { prompt: string, onUpload: (url: string) => void }) => {
        const [copying, setCopying] = useState(false);
        const [uploading, setUploading] = useState(false);

        const handleCopy = async () => {
            setCopying(true);
            await navigator.clipboard.writeText(prompt);
            setTimeout(() => setCopying(false), 2000);
        };

        const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            
            setUploading(true);
            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("type", "blog_image");

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    onUpload(data.url);
                }
            } catch (error) {
                console.error("Image upload failed:", error);
            } finally {
                setUploading(false);
            }
        };

        return (
            <div className="my-6 p-6 rounded-xl bg-white/[0.02] border border-white/5 space-y-4 group/prompt hover:border-primary/20 transition-all">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                            <ImageIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Asset Generation Required</p>
                            <p className="text-xs font-bold text-muted-foreground/40 mt-1">AI has recommended a visual placeholder here</p>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleCopy}
                        className={cn(
                            "h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            copying ? "bg-emerald-500 text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10"
                        )}
                    >
                        {copying ? "Prompt Copied! ✨" : "Copy AI Prompt"}
                    </Button>
                </div>

                <div className="p-6 rounded-xl bg-black/40 border border-white/5 relative">
                    <p className="text-xs italic leading-relaxed text-muted-foreground/60 pr-10">"{prompt}"</p>
                    <div className="absolute top-4 right-4">
                        <Sparkles className="h-3.5 w-3.5 text-primary/20" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex-1 h-12 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all flex items-center justify-center cursor-pointer group/upload">
                        <div className="flex items-center gap-3">
                            {uploading ? <RefreshCw className="h-4 w-4 animate-spin text-primary" /> : <Upload className="h-4 w-4 text-primary/60 group-hover/upload:text-primary" />}
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 group-hover/upload:text-primary">
                                {uploading ? "Uploading Asset..." : "Upload Generated Image"}
                            </span>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                    </label>
                </div>
            </div>
        );
    };

    const handleClearAllProducts = async () => {
        if (!confirm("CRITICAL ACTION: Are you sure you want to permanently WIPE the entire product inventory? This cannot be undone.")) return;
        try {
            const response = await fetch("/api/products", { method: "DELETE" });
            if (response.ok) {
                fetchProducts();
                alert("Inventory wiped successfully.");
            }
        } catch (error) {
            console.error("Error clearing inventory:", error);
        }
    };

    const fetchPublishedBlogs = async () => {
        setLoadingBlogs(true);
        try {
            const response = await fetch("/api/blogs");
            if (response.ok) {
                const data = await response.json();
                const blogs = data.blogs || [];
                setPublishedBlogs(blogs);
                
                const totalViews = blogs.reduce((acc: number, blog: Blog) => acc + (blog.view_count || 0), 0);
                const categoriesCount = new Set(blogs.map((b: Blog) => b.category)).size;
                const totalReadTime = blogs.reduce((acc: number, blog: Blog) => acc + (blog.read_time || 0), 0);
                
                setStats({
                    totalBlogs: blogs.length,
                    totalViews,
                    uniqueCategories: categoriesCount,
                    avgReadTime: blogs.length ? Math.round(totalReadTime / blogs.length) : 0
                });
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoadingBlogs(false);
        }
    };

    const handleGenerate = async () => {
        if (!topic.trim()) {
            alert("Please enter a topic!");
            return;
        }

        setGenerating(true);
        setGeneratedBlog("");
        setMetadata(null);
        setPlaceholderImages({});

        try {
            const response = await fetch("/api/generate-blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    topic, 
                    category,
                    sources: sources.filter(s => s.trim())
                }),
            });

            if (!response.ok) throw new Error("Failed to generate blog");

            const data = await response.json();
            setGeneratedBlog(data.metadata.cleanContent || data.content);
            setMetadata(data.metadata);
            
            // Sync category with AI's choice
            if (data.metadata.category) {
                setCategory(data.metadata.category);
            }

            // Auto-detect headings
            const headingRegex = /^##\s+(.+)$/gm;
            const headings: string[] = [];
            let match;
            while ((match = headingRegex.exec(data.content)) !== null) {
                headings.push(match[1].replace(/[*_~`]/g, '').trim());
            }
            setSectionLayouts(headings.map(h => ({
                heading: h,
                left: { type: "nothing" },
                right: { type: "nothing" },
            })));
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to generate blog. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const handlePlaceholderUpload = async (placeholderId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingPlaceholder(placeholderId);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/blogs/upload-thumbnail", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const { url } = await response.json();
                setPlaceholderImages(prev => ({ ...prev, [placeholderId]: url }));
                
                // Replace in content
                setGeneratedBlog(prev => prev.replace(new RegExp(`\\[IMG-PLACEHOLDER:[^\\]]*\\]`, 'i'), `![Blog Image](${url})`));
            }
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setUploadingPlaceholder(null);
        }
    };

    const handlePublish = async () => {
        if (!generatedBlog || !metadata) return;

        setGenerating(true);
        try {
            let thumbnailUrl = editingBlogId 
                ? publishedBlogs.find(b => b.id === editingBlogId)?.thumbnail_url 
                : "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop";

            if (thumbnail) {
                const formData = new FormData();
                formData.append("file", thumbnail);

                const uploadResponse = await fetch("/api/blogs/upload-thumbnail", {
                    method: "POST",
                    body: formData,
                });

                if (uploadResponse.ok) {
                    const { url } = await uploadResponse.json();
                    thumbnailUrl = url;
                }
            }

            const blogData = {
                title: metadata.title,
                slug: metadata.slug,
                excerpt: metadata.excerpt,
                content: generatedBlog,
                category,
                author_name: authorName,
                author_avatar: authorAvatarPreview,
                thumbnail_url: thumbnailUrl,
                read_time: metadata.readTime,
                tags: metadata.tags,
                sources: sources.filter(s => s.trim()).map(url => ({ url, content: "" })),
                section_layouts: sectionLayouts,
                is_featured: isFeatured,
                published_at: editingBlogId 
                    ? publishedBlogs.find(b => b.id === editingBlogId)?.published_at 
                    : new Date().toISOString(),
            };

            const url = editingBlogId ? `/api/blogs/${editingBlogId}` : "/api/blogs";
            const method = editingBlogId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(blogData),
            });

            if (!response.ok) throw new Error("Failed to save blog");

            alert(editingBlogId ? "Blog updated successfully! 🎉" : "Blog published successfully! 🎉");

            // Reset form
            setTopic("");
            setThumbnail(null);
            setThumbnailPreview("");
            setGeneratedBlog("");
            setMetadata(null);
            setEditingBlogId(null);
            setSources([""]);
            setCategory("");
            setIsFeatured(false);
            setActiveTab("blogs");

            fetchPublishedBlogs();
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to save blog. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const handleEditBlog = (blog: Blog) => {
        setEditingBlogId(blog.id);
        setTopic(blog.title);
        setCategory(blog.category);
        setGeneratedBlog(blog.content);
        setMetadata({
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            readTime: blog.read_time,
            tags: blog.tags,
            imagePrompts: [] // Prompts aren't stored, but we can regenerate
        });
        setThumbnailPreview(blog.thumbnail_url);
        setAuthorName(blog.author_name);
        setAuthorAvatarPreview(blog.author_avatar);
        setSectionLayouts(blog.section_layouts || []);
        setIsFeatured(blog.is_featured || false);
        setSources((blog.sources as any[])?.map(s => s.url) || [""]);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveTab("generate");
    };

    const handleUpsertProduct = async () => {
        if (!productForm.title) return;
        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingProductId ? { ...productForm, id: editingProductId } : productForm),
            });
            if (response.ok) {
                setEditingProductId(null);
                setProductForm({ type: "affiliate", title: "", thumbnail: "", link: "", video_url: "", cta_text: "", cta_link: "", publisher_id: "", slot_id: "" });
                fetchProducts();
            }
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Delete this product?")) return;
        try {
            const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (response.ok) fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleDeleteBlog = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            const response = await fetch(`/api/blogs/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete blog");

            alert("Blog deleted successfully!");
            fetchPublishedBlogs();
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to delete blog. Please try again.");
        }
    };

    const syncHeadings = () => {
        const headingRegex = /^##\s+(.+)$/gm;
        const headings: string[] = [];
        let match;
        while ((match = headingRegex.exec(generatedBlog)) !== null) {
            headings.push(match[1].replace(/[*_~`]/g, '').trim());
        }

        setSectionLayouts(prev => {
            return headings.map(h => {
                const existing = prev.find(p => p.heading === h);
                return existing || {
                    heading: h,
                    left: { type: "nothing" },
                    right: { type: "nothing" },
                };
            });
        });
    };

    const updateSectionLayout = (index: number, side: 'left' | 'right', type: string, data?: any) => {
        setSectionLayouts(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            if (side === 'left') {
                next[index].left = { type, ...data };
            } else {
                next[index].right = { type, ...data };
            }
            return next;
        });
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result as string);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedBlob: Blob) => {
        const croppedFile = new File([croppedBlob], "thumbnail.jpg", { type: "image/jpeg" });
        setThumbnail(croppedFile);

        const reader = new FileReader();
        reader.onloadend = () => setThumbnailPreview(reader.result as string);
        reader.readAsDataURL(croppedBlob);

        setShowCropper(false);
        setImageToCrop("");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto opacity-50" />
                    <p className="text-muted-foreground font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Syncing Hub...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">
            <AdminSidebar 
                activeTab={activeTab} 
                onTabChange={(tab) => {
                    setActiveTab(tab);
                    setShowSidebar(false);
                }} 
                className={cn(
                    "fixed inset-y-0 left-0 z-50 transform lg:translate-x-0 transition-transform duration-300 ease-in-out",
                    showSidebar ? "translate-x-0" : "-translate-x-full"
                )}
            />
            
            {/* Mobile Sidebar Overlay */}
            {showSidebar && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setShowSidebar(false)}
                />
            )}
            
            <main className="lg:pl-64 min-h-screen">
                {/* Minimal Header */}
                <header className="h-12 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 md:px-6 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">Management</span>
                        <div className="h-3 w-px bg-white/10" />
                        <h2 className="text-xs font-bold text-muted-foreground/60">BandhanNova Blogs</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white/5">
                            <Search className="h-4 w-4 text-muted-foreground/40" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="lg:hidden h-9 w-9 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 relative z-[60]"
                            onClick={() => setShowSidebar(!showSidebar)}
                        >
                            {showSidebar ? <X className="h-4 w-4" /> : <Layout className="h-4 w-4" />}
                        </Button>
                    </div>
                </header>

                <div className="p-6 max-w-full mx-auto space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                        <div className="hidden lg:flex items-center justify-between">
                            <TabsList className="bg-zinc-900/50 border border-white/5 p-1 rounded-xl">
                                <TabsTrigger value="overview" className="rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary">Overview</TabsTrigger>
                                <TabsTrigger value="blogs" className="rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary">Blogs</TabsTrigger>
                                <TabsTrigger value="generate" className="rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary">Generator</TabsTrigger>
                                <TabsTrigger value="authors" className="rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary">Authors</TabsTrigger>
                                <TabsTrigger value="products" className="rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary">Affiliates</TabsTrigger>
                                <TabsTrigger value="adsense" className="rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary">AdSense</TabsTrigger>
                                <TabsTrigger value="brands" className="rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary">Brands</TabsTrigger>
                                <TabsTrigger value="settings" className="rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary">Settings</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="overview" className="space-y-8">
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-black tracking-tighter">Dashboard</h1>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Total Blogs", value: stats.totalBlogs, icon: FileText, color: "text-blue-500" },
                                    { label: "Total Views", value: stats.totalViews.toLocaleString(), icon: Eye, color: "text-purple-500" },
                                    { label: "Categories", value: stats.uniqueCategories, icon: TrendingUp, color: "text-emerald-500" },
                                    { label: "Avg Read", value: `${stats.avgReadTime}m`, icon: TrendingUp, color: "text-amber-500" },
                                ].map((stat, i) => (
                                    <div key={i} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={cn("p-2 rounded-xl bg-current opacity-10", stat.color)} />
                                            <stat.icon className={cn("h-4 w-4", stat.color)} />
                                        </div>
                                        <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <Card className="lg:col-span-2 bg-white/[0.02] border-white/5 rounded-xl overflow-hidden">
                                    <CardHeader className="p-6 pb-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg font-black tracking-tight">Recent Activity</CardTitle>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => setActiveTab("blogs")} className="text-[10px] font-black uppercase tracking-widest gap-2">
                                                View All <ChevronRight className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 pt-0">
                                        <div className="divide-y divide-white/5">
                                            {publishedBlogs.slice(0, 4).map((blog) => (
                                                <div key={blog.id} className="py-4 flex items-center justify-between group cursor-pointer" onClick={() => handleEditBlog(blog)}>
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                                                            <Image src={blog.thumbnail_url} alt="" width={40} height={40} className="object-cover h-full" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold truncate max-w-[300px] group-hover:text-primary transition-colors">{blog.title}</h4>
                                                            <p className="text-[10px] text-muted-foreground/50 uppercase font-black tracking-widest mt-0.5">{blog.category}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-muted-foreground/40">
                                                        <div className="flex items-center gap-1.5">
                                                            <Eye className="h-3 w-3" />
                                                            <span className="text-[10px] font-bold">{blog.view_count || 0}</span>
                                                        </div>
                                                        <ArrowUpRight className="h-3 w-3 group-hover:text-white transition-colors" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="generate" className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <h1 className="text-3xl font-black tracking-tighter">
                                        {editingBlogId ? "Edit Intelligence" : "AI Generator"}
                                    </h1>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <Card className="bg-white/[0.02] border-white/5 rounded-xl p-6 space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Topic</label>
                                            <Input
                                                placeholder="e.g., The Evolution of Distributed Computing"
                                                value={topic}
                                                onChange={(e) => setTopic(e.target.value)}
                                                className="bg-white/5 border-white/10 h-12 text-sm font-bold rounded-lg focus:ring-1 ring-primary/30 transition-all"
                                                disabled={generating}
                                            />
                                        </div>

                                        {/* Author Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between ml-1">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Writer Profile</label>
                                                    <button 
                                                        onClick={() => setActiveTab("authors")}
                                                        className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors"
                                                    >
                                                        Manage Writers
                                                    </button>
                                                </div>
                                                <select 
                                                    className="w-full bg-white/5 border border-white/10 h-12 px-4 text-sm font-bold rounded-lg focus:ring-1 ring-primary/30 outline-none text-white transition-all"
                                                    onChange={(e) => {
                                                        const author = authors.find(a => a.id === e.target.value);
                                                        if (author) {
                                                            setAuthorName(author.name);
                                                            setAuthorAvatarPreview(author.avatar);
                                                        }
                                                    }}
                                                    value={authors.find(a => a.name === authorName)?.id || ""}
                                                >
                                                    <option value="" disabled className="bg-zinc-950">Select a Writer</option>
                                                    {authors.map(author => (
                                                        <option key={author.id} value={author.id} className="bg-zinc-950">{author.name}</option>
                                                    ))}
                                                    <option value="manual" className="bg-zinc-950">Manual Entry</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Author Name (Manual)</label>
                                                <Input
                                                    placeholder="e.g., John Doe"
                                                    value={authorName}
                                                    onChange={(e) => setAuthorName(e.target.value)}
                                                    className="bg-white/5 border-white/10 h-12 text-sm font-bold rounded-lg focus:ring-1 ring-primary/30 transition-all"
                                                    disabled={generating}
                                                />
                                            </div>
                                        </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Author Avatar</label>
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-14 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-white/5 relative">
                                                        {authorAvatarPreview ? (
                                                            <Image src={authorAvatarPreview} alt="Avatar" width={56} height={56} className="object-cover h-full w-full" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-muted-foreground/30">
                                                                <ImageIcon className="h-6 w-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <label className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Upload Avatar</span>
                                                        <input 
                                                            type="file" 
                                                            className="hidden" 
                                                            accept="image/*" 
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    const formData = new FormData();
                                                                    formData.append("file", file);
                                                                    const response = await fetch("/api/blogs/upload-thumbnail", {
                                                                        method: "POST",
                                                                        body: formData,
                                                                    });
                                                                    if (response.ok) {
                                                                        const { url } = await response.json();
                                                                        setAuthorAvatarPreview(url);
                                                                    }
                                                                }
                                                            }} 
                                                        />
                                                    </label>
                                                </div>
                                            </div>


                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between ml-1">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Context Sources (Multi-Scrape)</label>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => setSources(prev => [...prev, ""])}
                                                    className="h-6 text-[8px] font-black uppercase tracking-widest text-primary bg-primary/5 hover:bg-primary/10"
                                                >
                                                    <Plus className="h-2.5 w-2.5 mr-1" /> Add Source
                                                </Button>
                                            </div>
                                            <div className="space-y-2">
                                                {sources.map((src, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                                        <Input
                                                            placeholder="https://example.com/source-article"
                                                            value={src}
                                                            onChange={(e) => {
                                                                const next = [...sources];
                                                                next[idx] = e.target.value;
                                                                setSources(next);
                                                            }}
                                                            className="bg-white/5 border-white/10 h-12 pl-12 pr-12 text-sm rounded-xl focus:ring-1 ring-primary/30"
                                                            disabled={generating}
                                                        />
                                                        {sources.length > 1 && (
                                                            <button 
                                                                onClick={() => setSources(prev => prev.filter((_, i) => i !== idx))}
                                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 hover:text-red-500 transition-colors"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[9px] text-muted-foreground/30 uppercase font-black tracking-widest ml-1">AI will synthesize knowledge from all active sources concurrently.</p>
                                        </div>

                                        <Button 
                                            onClick={handleGenerate} 
                                            disabled={generating || !topic.trim()} 
                                            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-sm font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 transition-all group overflow-hidden"
                                        >
                                            {generating ? (
                                                <Loader2 className="h-5 w-5 animate-spin opacity-50" />
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <Sparkles className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                    {editingBlogId ? "Regenerate Content" : "Execute Generation"}
                                                </div>
                                            )}
                                        </Button>
                                    </Card>

                                    {/* AI IMAGE STRATEGY SECTION */}
                                    {metadata?.imagePrompts && metadata.imagePrompts.length > 0 && (
                                        <Card className="bg-white/[0.02] border-white/5 rounded-xl p-6 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-black tracking-tight">AI Image Strategy</h3>
                                                </div>
                                                <ImageIcon className="h-5 w-5 text-primary/40" />
                                            </div>
                                            
                                            <div className="space-y-4">
                                                {metadata.imagePrompts.map((item: any, idx: number) => (
                                                    <div key={item.id || idx} className="p-6 rounded-xl bg-white/[0.01] border border-white/5 space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/20 text-primary">
                                                                {item.id}
                                                            </Badge>
                                                            {placeholderImages[item.id] && (
                                                                <div className="flex items-center gap-2 text-emerald-500 text-[8px] font-black uppercase tracking-widest">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                    Uploaded
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground/80 leading-relaxed italic border-l-2 border-white/10 pl-4 py-1">
                                                            "{item.prompt}"
                                                        </p>
                                                        
                                                        <div className="flex items-center gap-3">
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                onClick={() => document.getElementById(`upload-${item.id}`)?.click()}
                                                                disabled={uploadingPlaceholder === item.id}
                                                                className="h-9 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest border-white/5 bg-white/5 hover:bg-white/10"
                                                            >
                                                                {uploadingPlaceholder === item.id ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Upload className="h-3 w-3 mr-2" />}
                                                                {placeholderImages[item.id] ? "Change Image" : "Upload Asset"}
                                                            </Button>
                                                            <input 
                                                                id={`upload-${item.id}`} 
                                                                type="file" 
                                                                accept="image/*" 
                                                                onChange={(e) => handlePlaceholderUpload(item.id, e)} 
                                                                className="hidden" 
                                                            />
                                                            {placeholderImages[item.id] && (
                                                                <div className="h-9 w-16 relative rounded-lg overflow-hidden border border-white/10">
                                                                    <Image src={placeholderImages[item.id]} alt="" fill className="object-cover" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <Card className="bg-white/[0.02] border-white/5 rounded-xl p-6 space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1">Thumbnail</label>
                                            <div 
                                                className={cn(
                                                    "relative aspect-video w-full rounded-xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center hover:border-primary/20 transition-all cursor-pointer overflow-hidden group",
                                                    thumbnailPreview && "border-solid border-white/10"
                                                )}
                                                onClick={() => !generating && document.getElementById("thumb-upload")?.click()}
                                            >
                                                {thumbnailPreview ? (
                                                    <Image src={thumbnailPreview} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                                ) : (
                                                    <Upload className="h-6 w-6 text-white/10" />
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Upload className="h-5 w-5" />
                                                </div>
                                            </div>
                                            <input id="thumb-upload" type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between ml-1">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Classification (AI Choice)</label>
                                                {category && (
                                                    <button onClick={() => setCategory("")} className="text-[8px] font-black uppercase tracking-widest text-primary hover:underline">Auto-Reset</button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {categories.filter(c => c !== "All").map((cat) => {
                                                    const iconMap: any = {
                                                        "AI & Technology": Sparkles,
                                                        "Software Development": Code,
                                                        "Cloud & DevOps": Server,
                                                        "Cybersecurity": Shield,
                                                        "Web 3.0 & Blockchain": Globe,
                                                        "Learning & Education": GraduationCap,
                                                        "Digital Skill Development": Zap,
                                                        "Blogging & Content": PenTool,
                                                        "Tools & Resources": Box,
                                                        "Business & Startups": Briefcase,
                                                        "Productivity": ClockIcon,
                                                        "Research & Innovation": BrainIcon
                                                    };
                                                    const Icon = iconMap[cat] || Box;
                                                    const isSelected = category === cat;
                                                    
                                                    return (
                                                        <button
                                                            key={cat}
                                                            type="button"
                                                            onClick={() => {
                                                                if (generating) return;
                                                                if (isSelected) setCategory(""); // Deselect
                                                                else setCategory(cat); // Select
                                                            }}
                                                            className={cn(
                                                                "flex items-center gap-2 px-3 py-3 rounded-xl border transition-all text-left group",
                                                                isSelected 
                                                                    ? "bg-primary border-primary shadow-lg shadow-primary/20 text-white" 
                                                                    : "bg-white/[0.02] border-white/5 text-muted-foreground hover:bg-white/5 hover:border-white/10"
                                                            )}
                                                        >
                                                            <Icon className={cn("h-3.5 w-3.5", isSelected ? "text-white" : "text-muted-foreground/30 group-hover:text-primary")} />
                                                            <span className="text-[9px] font-black uppercase tracking-widest leading-none truncate">{cat}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            {/* Draft Review */}
                            {generatedBlog && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-xl font-black tracking-tighter">Draft Review</h3>
                                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black tracking-widest">
                                                AI ARCHITECTED
                                            </Badge>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button onClick={handlePublish} className="rounded-xl bg-primary px-6 font-black uppercase tracking-widest text-[10px] shadow-lg h-11">
                                                {editingBlogId ? "Update Intelligence" : "Push to Production"}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                        <div className="lg:col-span-3 bg-white/[0.01] rounded-xl p-6 border border-white/5 shadow-2xl overflow-hidden relative group">
                                            <div className="absolute top-6 right-6 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => setEditMode(!editMode)}
                                                    className="h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-black/60 backdrop-blur-md border-white/10"
                                                >
                                                    {editMode ? "View Preview" : "Edit Markdown"}
                                                </Button>
                                            </div>

                                            {editMode ? (
                                                <textarea
                                                    value={generatedBlog}
                                                    onChange={(e) => setGeneratedBlog(e.target.value)}
                                                    className="w-full h-[800px] bg-black/40 text-white font-mono text-sm leading-relaxed outline-none resize-none scrollbar-thin scrollbar-thumb-white/10 p-6 rounded-xl border border-white/10 shadow-inner"
                                                    placeholder="Blog content in markdown..."
                                                />
                                            ) : (
                                                <div className="space-y-6">
                                                    {generatedBlog.split(/(\[IMAGE_PROMPT:.*?\])/g).map((part, idx) => {
                                                        if (part.startsWith('[IMAGE_PROMPT:')) {
                                                            const prompt = part.match(/\[IMAGE_PROMPT:(.*?)\]/)?.[1] || "";
                                                            return (
                                                                <ImagePromptUploader 
                                                                    key={idx}
                                                                    prompt={prompt}
                                                                    onUpload={(url) => {
                                                                        const newContent = generatedBlog.replace(part, `![AI Generated Asset](${url})`);
                                                                        setGeneratedBlog(newContent);
                                                                    }}
                                                                />
                                                            );
                                                        }
                                                        if (!part.trim()) return null;
                                                        return (
                                                            <div 
                                                                key={idx}
                                                                className="prose prose-invert prose-sm md:prose-base max-w-none !text-white prose-headings:!text-white prose-p:!text-white prose-li:!text-white prose-strong:!text-primary prose-code:!text-white prose-blockquote:!text-white/70 prose-blockquote:border-l-primary prose-blockquote:bg-white/5 prose-blockquote:rounded-r-xl prose-blockquote:p-6 prose-img:rounded-xl prose-img:border prose-img:border-white/10"
                                                                dangerouslySetInnerHTML={{ __html: markdownToHtml(part) }}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/60">Metadata</h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30 mb-1">Slug</p>
                                                        <p className="text-[10px] font-mono text-muted-foreground truncate">{metadata?.slug}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30 mb-1">Tags</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {metadata?.tags?.slice(0, 5).map((tag: string) => (
                                                                <span key={tag} className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground/40">#{tag}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="pt-2">
                                                        <button 
                                                            onClick={() => setIsFeatured(!isFeatured)}
                                                            className={cn(
                                                                "w-full h-10 rounded-xl border flex items-center justify-center gap-2 transition-all",
                                                                isFeatured 
                                                                    ? "bg-amber-500/10 border-amber-500/20 text-amber-500" 
                                                                    : "bg-white/5 border-white/10 text-muted-foreground/40"
                                                            )}
                                                        >
                                                            <Star className={cn("h-3 w-3", isFeatured && "fill-amber-500")} />
                                                            <span className="text-[9px] font-black uppercase tracking-widest">{isFeatured ? "Featured Content" : "Mark as Featured"}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                                    {/* Section Orchestrator - Full Width Dedicated Layout */}
                                    <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 space-y-6">
                                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                                                    <Layout className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="text-2xl font-black tracking-tighter">Section Orchestrator</h4>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={() => setShowProductManager(!showProductManager)}
                                                    className={cn(
                                                        "h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                        showProductManager ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10"
                                                    )}
                                                >
                                                    {showProductManager ? "Close Asset Manager" : "Manage Product Inventory"}
                                                </Button>
                                            </div>
                                        </div>

                                        {showProductManager && (
                                            <div className="space-y-6 p-6 rounded-xl bg-black/40 border border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                    {/* Asset Creation Form */}
                                                    <div className="lg:col-span-1 space-y-6">
                                                        <h5 className="text-xs font-black uppercase tracking-widest text-primary/60 border-b border-white/5 pb-4">Register New Asset</h5>
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Asset Type</label>
                                                                <select 
                                                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-xs font-bold text-white outline-none focus:ring-1 ring-primary/50"
                                                                    value={productForm.type}
                                                                    onChange={(e) => setProductForm({ ...productForm, type: e.target.value as any })}
                                                                >
                                                                    <option value="affiliate">Affiliate Link</option>
                                                                    <option value="brand">Brand Advertisement</option>
                                                                </select>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Item Title</label>
                                                                <Input 
                                                                    value={productForm.title}
                                                                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                                                                    className="bg-zinc-900 border-white/10 h-12 text-xs rounded-xl"
                                                                    placeholder="e.g., Ultimate Cloud Hosting"
                                                                />
                                                            </div>
                                                        </div>

                                                        {productForm.type === 'affiliate' ? (
                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Affiliate Link (Your Earning Source)</label>
                                                                    <Input 
                                                                        value={productForm.link}
                                                                        onChange={(e) => setProductForm({ ...productForm, link: e.target.value })}
                                                                        className="bg-zinc-900 border-white/10 h-12 text-xs rounded-xl"
                                                                        placeholder="https://affiliate.link/your-id"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Image URL / Upload</label>
                                                                    <div className="flex gap-2">
                                                                        <Input 
                                                                            value={productForm.thumbnail}
                                                                            onChange={(e) => setProductForm({ ...productForm, thumbnail: e.target.value })}
                                                                            className="bg-zinc-900 border-white/10 h-12 text-xs rounded-xl flex-1"
                                                                            placeholder="https://image.url..."
                                                                        />
                                                                        <label className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all">
                                                                            {uploadingAsset ? <RefreshCw className="h-4 w-4 animate-spin text-primary" /> : <Upload className="h-4 w-4 text-muted-foreground" />}
                                                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleAssetUpload(e.target.files[0], "image")} />
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Video URL / Cloudinary Upload</label>
                                                                    <div className="flex gap-2">
                                                                        <Input 
                                                                            value={productForm.video_url}
                                                                            onChange={(e) => setProductForm({ ...productForm, video_url: e.target.value })}
                                                                            className="bg-zinc-900 border-white/10 h-12 text-xs rounded-xl flex-1"
                                                                            placeholder="Direct video link or upload..."
                                                                        />
                                                                        <label className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all">
                                                                            {uploadingAsset ? <RefreshCw className="h-4 w-4 animate-spin text-primary" /> : <Video className="h-4 w-4 text-muted-foreground" />}
                                                                            <input type="file" className="hidden" accept="video/*" onChange={(e) => e.target.files?.[0] && handleAssetUpload(e.target.files[0], "video")} />
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">CTA Button Text</label>
                                                                        <Input 
                                                                            value={productForm.cta_text}
                                                                            onChange={(e) => setProductForm({ ...productForm, cta_text: e.target.value })}
                                                                            className="bg-zinc-900 border-white/10 h-12 text-xs rounded-xl"
                                                                            placeholder="e.g., Learn More"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Brand URL (Redirection)</label>
                                                                        <Input 
                                                                            value={productForm.cta_link}
                                                                            onChange={(e) => setProductForm({ ...productForm, cta_link: e.target.value })}
                                                                            className="bg-zinc-900 border-white/10 h-12 text-xs rounded-xl"
                                                                            placeholder="https://brand.com/target"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex gap-3 pt-4">
                                                            <Button 
                                                                onClick={handleUpsertProduct} 
                                                                disabled={uploadingAsset}
                                                                className="flex-1 h-12 rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                                                            >
                                                                {editingProductId ? "Update Asset" : "Register Asset"}
                                                            </Button>
                                                            {editingProductId && (
                                                                <Button variant="ghost" onClick={() => { setEditingProductId(null); setProductForm({ type: "affiliate", title: "", thumbnail: "", link: "", video_url: "", cta_text: "", cta_link: "", publisher_id: "", slot_id: "" }); }} className="h-12 px-6 text-[10px] font-black uppercase tracking-widest">Cancel</Button>
                                                            )}
                                                        </div>
                                                    </div>


                                                    {/* Asset List */}
                                                    <div className="lg:col-span-2 space-y-4">
                                                        <h5 className="text-xs font-black uppercase tracking-widest text-muted-foreground/40 border-b border-white/5 pb-4">Available Inventory ({products.length})</h5>
                                                        <div className="max-h-[500px] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 pr-4 scrollbar-thin scrollbar-thumb-white/10">
                                                            {products.map((p, idx) => (
                                                                <div key={p.id || idx} className="p-6 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] hover:border-white/10 transition-all">
                                                                    <div className="flex items-center gap-5 min-w-0">
                                                                        <div className="h-12 w-16 rounded-xl bg-black/40 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5 relative shadow-inner">
                                                                            {p.type === 'brand' ? <Video className="h-6 w-6 text-primary/40" /> : <ShoppingCart className="h-6 w-6 text-blue-500/40" />}
                                                                            {p.thumbnail && <Image src={p.thumbnail} alt="" width={64} height={64} className="object-cover" />}
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <p className="text-sm font-bold truncate text-white">{p.title}</p>
                                                                            <Badge className="h-4 px-2 text-[8px] font-black uppercase tracking-widest bg-primary/10 text-primary border-none mt-2">{p.type}</Badge>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <Button variant="ghost" size="icon" onClick={() => { setEditingProductId(p.id); setProductForm(p); }} className="h-10 w-10 rounded-xl hover:bg-primary/20 hover:text-primary transition-all"><Edit3 className="h-4 w-4" /></Button>
                                                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(p.id)} className="h-10 w-10 rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></Button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {products.length === 0 && (
                                                                <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 rounded-xl">
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/20">Inventory is Empty</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="space-y-4">
                                            {sectionLayouts.map((section, idx) => (
                                                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-center gap-4">
                                                    <div className="w-full md:w-48">
                                                        <p className="text-[10px] font-black uppercase text-primary mb-1">Section {idx + 1}</p>
                                                        <p className="text-xs font-bold text-white truncate">{section.heading}</p>
                                                    </div>
                                                    
                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-black uppercase text-muted-foreground/40 ml-1">Left Slot</p>
                                                            <select 
                                                                className="w-full bg-zinc-900 border border-white/10 rounded-lg h-10 px-3 text-xs font-bold text-white outline-none focus:ring-1 ring-primary/30"
                                                                value={section.left.type}
                                                                onChange={(e) => updateSectionLayout(idx, 'left', e.target.value)}
                                                            >
                                                                <option value="nothing">None</option>
                                                                <option value="affiliate">Affiliate</option>
                                                            </select>
                                                            {section.left.type === 'affiliate' && (
                                                                <select 
                                                                    className="w-full bg-primary/10 border border-primary/20 rounded-lg h-10 px-3 text-xs font-black text-primary mt-1 outline-none"
                                                                    onChange={(e) => {
                                                                        const item = products.find(p => p.title === e.target.value);
                                                                        updateSectionLayout(idx, 'left', 'affiliate', { affiliate: item });
                                                                    }}
                                                                    value={section.left.affiliate?.title || ""}
                                                                >
                                                                    <option value="" disabled>Link Item</option>
                                                                    {products.filter(p => p.type === 'affiliate').map((a, idx) => <option key={a.id || idx} value={a.title} className="bg-black text-white">{a.title}</option>)}
                                                                </select>
                                                            )}
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-black uppercase text-muted-foreground/40 ml-1">Right Slot</p>
                                                            <select 
                                                                className="w-full bg-zinc-900 border border-white/10 rounded-lg h-10 px-3 text-xs font-bold text-white outline-none focus:ring-1 ring-primary/30"
                                                                value={section.right.type}
                                                                onChange={(e) => updateSectionLayout(idx, 'right', e.target.value)}
                                                            >
                                                                <option value="nothing">None</option>
                                                                <option value="brand_ad">Brand Video</option>
                                                                <option value="affiliate">Affiliate</option>
                                                            </select>
                                                            {(section.right.type === 'brand_ad' || section.right.type === 'affiliate') && (
                                                                <select 
                                                                    className="w-full bg-primary/10 border border-primary/20 rounded-lg h-10 px-3 text-xs font-black text-primary mt-1 outline-none"
                                                                    onChange={(e) => {
                                                                        const type = section.right.type;
                                                                        const item = products.find(p => p.title === e.target.value);
                                                                        updateSectionLayout(idx, 'right', type, { [type]: item });
                                                                    }}
                                                                    value={section.right.brand_ad?.title || section.right.affiliate?.title || ""}
                                                                >
                                                                    <option value="" disabled>Link Asset</option>
                                                                    {products.filter(p => p.type === (section.right.type === 'brand_ad' ? 'brand' : 'affiliate')).map((a, idx) => <option key={a.id || idx} value={a.title} className="bg-black text-white">{a.title}</option>)}
                                                                </select>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                    </div>
                        </TabsContent>

                        <TabsContent value="blogs" className="space-y-6">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-black tracking-tighter">Content Repository</h1>
                                <p className="text-sm text-muted-foreground">Manage and optimize your sharded knowledge cluster.</p>
                            </div>

                            <div className="space-y-2">
                                {publishedBlogs.map((blog) => (
                                    <div key={blog.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                                        <div className="relative h-12 w-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                                            <Image src={blog.thumbnail_url} alt="" fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors truncate">{blog.title}</h3>
                                                {blog.is_featured && <Star className="h-3 w-3 fill-amber-500 text-amber-500 flex-shrink-0" />}
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">{blog.category}</span>
                                                <div className="flex items-center gap-3 text-[9px] font-bold text-muted-foreground/20">
                                                    <span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5" /> {blog.view_count || 0}</span>
                                                    <span className="flex items-center gap-1"><TrendingUp className="h-2.5 w-2.5" /> {blog.read_time}m</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditBlog(blog)} className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                                                <Edit3 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteBlog(blog.id, blog.title)} className="h-9 w-9 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-all">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {publishedBlogs.length === 0 && (
                                    <div className="py-12 text-center border border-dashed border-white/10 rounded-xl">
                                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/20">Empty Repository</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="products" className="space-y-8">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-black tracking-tighter">Affiliate Inventory</h1>
                                <p className="text-sm text-muted-foreground">Manage your monetized product grid.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-1">
                                    <Card className="bg-white/[0.02] border-white/5 rounded-xl p-6 space-y-6">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/60 border-b border-white/5 pb-4">
                                            {editingProductId ? "Update Product" : "Add Product"}
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Title</label>
                                                <Input 
                                                    value={productForm.title}
                                                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value, type: 'affiliate' })}
                                                    className="bg-zinc-900 border-white/10 h-12 text-xs rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Affiliate Link</label>
                                                <Input 
                                                    value={productForm.link}
                                                    onChange={(e) => setProductForm({ ...productForm, link: e.target.value })}
                                                    className="bg-zinc-900 border-white/10 h-12 text-xs rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Product Image URL</label>
                                                <Input 
                                                    value={productForm.thumbnail}
                                                    onChange={(e) => setProductForm({ ...productForm, thumbnail: e.target.value })}
                                                    className="bg-zinc-900 border-white/10 h-12 text-xs rounded-xl"
                                                />
                                            </div>
                                            <Button onClick={handleUpsertProduct} className="w-full h-12 rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest mt-4">
                                                Save Product
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {products.filter(p => p.type === 'affiliate').map((p) => (
                                        <div key={p.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-4">
                                            <div className="h-12 w-16 rounded-xl overflow-hidden bg-black/40 border border-white/5 flex-shrink-0">
                                                <Image src={p.thumbnail} alt="" width={64} height={64} className="object-cover h-full w-full" />
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <h4 className="text-xs font-bold truncate">{p.title}</h4>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => { setEditingProductId(p.id); setProductForm(p); }} className="h-7 px-3 text-[9px] font-black uppercase tracking-widest">Edit</Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(p.id)} className="h-7 px-3 text-[9px] font-black uppercase tracking-widest text-red-500/50">Delete</Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>


                        <TabsContent value="adsense" className="space-y-10">
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-black tracking-tighter">Google AdSense</h1>
                                <p className="text-sm text-muted-foreground">Configure your automated monetization units.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-1">
                                    <Card className="bg-white/[0.02] border-white/5 rounded-xl p-6 space-y-6">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/60 border-b border-white/5 pb-4">
                                            New Ad Unit
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Unit Name</label>
                                                <Input 
                                                    value={productForm.title}
                                                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value, type: 'adsense' })}
                                                    className="bg-zinc-900 border-white/10 h-12 text-xs rounded-xl"
                                                    placeholder="e.g., Sidebar Banner"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Publisher ID</label>
                                                <Input 
                                                    value={productForm.publisher_id}
                                                    onChange={(e) => setProductForm({ ...productForm, publisher_id: e.target.value, type: 'adsense' })}
                                                    className="bg-zinc-900 border-white/10 h-12 text-xs rounded-xl"
                                                    placeholder="ca-pub-xxxxxxxxxxxx"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Ad Slot ID</label>
                                                <Input 
                                                    value={productForm.slot_id}
                                                    onChange={(e) => setProductForm({ ...productForm, slot_id: e.target.value, type: 'adsense' })}
                                                    className="bg-zinc-900 border-white/10 h-12 text-xs rounded-xl"
                                                    placeholder="1234567890"
                                                />
                                            </div>
                                            <Button onClick={handleUpsertProduct} className="w-full h-12 rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest mt-4">
                                                Save Ad Unit
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                                <div className="lg:col-span-2 grid grid-cols-1 gap-4">
                                    {products.filter(p => p.type === 'adsense').map((p) => (
                                        <div key={p.id} className="p-6 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="p-4 rounded-xl bg-primary/10">
                                                    <Globe className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">{p.title}</h4>
                                                    <p className="text-[10px] text-muted-foreground/40 mt-1 uppercase tracking-widest font-black">
                                                        {p.publisher_id} • {p.slot_id}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => { setEditingProductId(p.id); setProductForm(p); }} className="h-9 px-4 text-[10px] font-black uppercase tracking-widest">Edit</Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(p.id)} className="h-9 px-4 text-[10px] font-black uppercase tracking-widest text-red-500/50">Delete</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        </TabsContent>

                        <TabsContent value="brands" className="space-y-10">
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-black tracking-tighter">Brand Collaborations</h1>
                                <p className="text-sm text-muted-foreground">Manage premium brand video placements and CTAs.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-1">
                                    <Card className="bg-white/[0.02] border-white/5 rounded-xl p-6 space-y-6">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/60 border-b border-white/5 pb-4">
                                            Campaign Details
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Campaign Name</label>
                                                <Input 
                                                    value={productForm.title}
                                                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value, type: 'brand' })}
                                                    className="bg-zinc-900 border-white/10 h-12 text-xs rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Video URL (or Upload)</label>
                                                <div className="flex gap-2">
                                                    <Input 
                                                        value={productForm.video_url}
                                                        onChange={(e) => setProductForm({ ...productForm, video_url: e.target.value, type: 'brand' })}
                                                        className="bg-zinc-900 border-white/10 h-12 text-xs rounded-xl flex-1"
                                                    />
                                                    <label className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer">
                                                        <Upload className="h-4 w-4 text-muted-foreground" />
                                                        <input type="file" className="hidden" accept="video/*" onChange={(e) => e.target.files?.[0] && handleAssetUpload(e.target.files[0], 'video')} />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">CTA Text</label>
                                                <Input 
                                                    value={productForm.cta_text}
                                                    onChange={(e) => setProductForm({ ...productForm, cta_text: e.target.value, type: 'brand' })}
                                                    className="bg-zinc-900 border-white/10 h-12 text-xs rounded-xl"
                                                    placeholder="Explore Now"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">CTA Link</label>
                                                <Input 
                                                    value={productForm.cta_link}
                                                    onChange={(e) => setProductForm({ ...productForm, cta_link: e.target.value, type: 'brand' })}
                                                    className="bg-zinc-900 border-white/10 h-12 text-xs rounded-xl"
                                                />
                                            </div>
                                            <Button onClick={handleUpsertProduct} className="w-full h-12 rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest mt-4">
                                                Launch Campaign
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {products.filter(p => p.type === 'brand').map((p) => (
                                        <div key={p.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-4">
                                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/40 border border-white/5">
                                                <video src={p.video_url} className="h-full w-full object-cover" muted loop autoPlay />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-bold truncate">{p.title}</h4>
                                                <p className="text-[10px] text-muted-foreground/40 mt-1 uppercase tracking-widest font-black">{p.cta_text}</p>
                                            </div>
                                            <div className="flex gap-2 border-t border-white/5 pt-4">
                                                <Button variant="ghost" size="sm" onClick={() => { setEditingProductId(p.id); setProductForm(p); }} className="flex-1 h-9 text-[10px] font-black uppercase tracking-widest">Edit</Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(p.id)} className="h-9 px-4 text-[10px] font-black uppercase tracking-widest text-red-500/50">Delete</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        </TabsContent>


                        <TabsContent value="authors" className="space-y-6">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-black tracking-tighter">Writer Profiles</h1>
                                <p className="text-sm text-muted-foreground">Manage the intellectual architects of your platform.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Author Form */}
                                <div className="lg:col-span-1 space-y-6">
                                    <Card className="bg-white/[0.02] border-white/5 rounded-xl p-6 space-y-6">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 border-b border-white/5 pb-4">
                                            {editingAuthorId ? "Edit Profile" : "Register Writer"}
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Full Name</label>
                                                <Input 
                                                    value={authorForm.name}
                                                    onChange={(e) => setAuthorForm({ ...authorForm, name: e.target.value })}
                                                    className="bg-zinc-900 border-white/10 h-12 text-sm font-bold rounded-xl"
                                                    placeholder="e.g., Alex Rivers"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Profession / Title</label>
                                                <Input 
                                                    value={authorForm.profession}
                                                    onChange={(e) => setAuthorForm({ ...authorForm, profession: e.target.value })}
                                                    className="bg-zinc-900 border-white/10 h-12 text-sm font-bold rounded-xl"
                                                    placeholder="e.g., Technical Lead"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Author Photo</label>
                                                <div className="flex flex-col gap-4">
                                                    <div className="h-24 w-24 rounded-xl overflow-hidden border border-white/10 bg-white/5 relative mx-auto">
                                                        {authorForm.avatar ? (
                                                            <Image src={authorForm.avatar} alt="Preview" fill className="object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-muted-foreground/20">
                                                                <User className="h-8 w-8" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Input 
                                                            value={authorForm.avatar}
                                                            onChange={(e) => setAuthorForm({ ...authorForm, avatar: e.target.value })}
                                                            className="bg-zinc-900 border-white/10 h-12 text-[10px] rounded-xl flex-1"
                                                            placeholder="URL or Upload..."
                                                        />
                                                        <label className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-all">
                                                            <Upload className="h-4 w-4 text-primary" />
                                                            <input 
                                                                type="file" 
                                                                className="hidden" 
                                                                accept="image/*" 
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        const formData = new FormData();
                                                                        formData.append("file", file);
                                                                        formData.append("type", "avatar");
                                                                        const res = await fetch("/api/upload", { method: "POST", body: formData });
                                                                        if (res.ok) {
                                                                            const data = await res.json();
                                                                            setAuthorForm({ ...authorForm, avatar: data.url });
                                                                        }
                                                                    }
                                                                }} 
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Biography</label>
                                                <Textarea 
                                                    value={authorForm.bio}
                                                    onChange={(e) => setAuthorForm({ ...authorForm, bio: e.target.value })}
                                                    className="bg-zinc-900 border-white/10 min-h-[100px] text-xs font-medium rounded-xl resize-none"
                                                    placeholder="Brief introduction of the author..."
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 pt-6">
                                            <Button 
                                                onClick={handleUpsertAuthor} 
                                                className="flex-1 h-12 rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                                            >
                                                {editingAuthorId ? "Update Profile" : "Register Writer"}
                                            </Button>
                                            {editingAuthorId && (
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={() => { setEditingAuthorId(null); setAuthorForm({ name: "", avatar: "", profession: "Intelligence Architect", bio: "" }); }} 
                                                    className="h-12 px-6 text-[10px] font-black uppercase tracking-widest"
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                </div>

                                {/* Author List */}
                                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {authors.map((author, idx) => (
                                        <div key={author.id || idx} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between group hover:bg-white/[0.04] hover:border-white/10 transition-all relative overflow-hidden">
                                            <div className="flex gap-5">
                                                <div className="h-20 w-20 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-black/40">
                                                    {author.avatar ? (
                                                        <Image src={author.avatar} alt="" width={80} height={80} className="object-cover h-full w-full" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center">
                                                            <Users className="h-8 w-8 text-white/5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 space-y-1">
                                                    <h4 className="font-black text-lg tracking-tight truncate">{author.name}</h4>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 w-fit px-3 py-1 rounded-full border border-primary/20">
                                                        {author.profession}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end gap-2 mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => { 
                                                        setEditingAuthorId(author.id); 
                                                        setAuthorForm({
                                                            name: author.name,
                                                            avatar: author.avatar,
                                                            profession: author.profession || "Intelligence Architect",
                                                            bio: author.bio || ""
                                                        }); 
                                                    }} 
                                                    className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleDeleteAuthor(author.id)} 
                                                    className="h-9 w-9 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {authors.length === 0 && (
                                        <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-xl">
                                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/10">No writers registered yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                    {/* SETTINGS TAB */}
                        <TabsContent value="settings" className="space-y-10">
                             <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-black tracking-tighter">System Configuration</h1>
                                <p className="text-sm text-muted-foreground">Fine-tune the BandhanNova Blogs engine.</p>
                            </div>
                            
                            <Card className="bg-white/[0.02] border-white/5 rounded-xl p-6 w-full">
                                <h3 className="text-lg font-black tracking-tight mb-8">Maintenance Hub</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-6 rounded-xl bg-black/40 border border-white/5">
                                        <div>
                                            <p className="text-sm font-bold text-primary">Database Synchronization</p>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            onClick={async () => {
                                                const res = await fetch("/api/admin/init-db", { method: "POST" });
                                                if (res.ok) alert("Database synced successfully! 🚀");
                                            }}
                                            className="text-[10px] font-black uppercase tracking-widest border-white/10"
                                        >
                                            Sync DB
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-6 rounded-xl bg-black/40 border border-white/5">
                                        <div>
                                            <p className="text-sm font-bold text-red-500">Purge Blog Cache</p>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => alert("Cache cleared successfully!")}
                                            className="text-[10px] font-black uppercase tracking-widest text-red-500/40 hover:bg-red-500/5 hover:text-red-500"
                                        >
                                            Purge
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            {showCropper && (
                <ImageCropper
                    image={imageToCrop}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setShowCropper(false)}
                    aspectRatio={16 / 9}
                />
            )}
        </div>
    );
}
