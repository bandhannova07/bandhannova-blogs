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
        profession: "Intelligence Architect"
    });
    const [cropType, setCropType] = useState<"thumbnail" | "avatar">("thumbnail");
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    // Image Prompt States
    const [placeholderImages, setPlaceholderImages] = useState<Record<string, string>>({});
    const [uploadingPlaceholder, setUploadingPlaceholder] = useState<string | null>(null);

    // Simplified Source Context
    const [sources, setSources] = useState<string[]>([""]);

    // Products & AdSense states
    const [products, setProducts] = useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [productForm, setProductForm] = useState({
        type: "affiliate" as "affiliate" | "brand",
        title: "",
        thumbnail: "",
        link: "",
        video_url: "",
        cta_text: "",
        cta_link: "",
        publisher_id: "",
        slot_id: ""
    });

    const [uploadingAsset, setUploadingAsset] = useState(false);

    const handleAssetUpload = async (file: File, type: "image" | "video") => {
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
            } else {
                alert("Upload failed. Please check server logs.");
            }
        } catch (error) {
            console.error("Asset upload failed:", error);
            alert("Upload error occurred.");
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
                fetchProducts();
                fetchAuthors();
                fetchStats();
            } else {
                router.push("/admin/login");
            }
        } catch (error) {
            router.push("/admin/login");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/blogs/stats");
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats);
            }
        } catch (e) { console.error(e); }
    };

    const fetchPublishedBlogs = async () => {
        setLoadingBlogs(true);
        try {
            const response = await fetch("/api/blogs");
            if (response.ok) {
                const data = await response.json();
                setPublishedBlogs(data.blogs);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoadingBlogs(false);
        }
    };

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const response = await fetch("/api/products");
            if (response.ok) {
                const data = await response.json();
                setProducts(data.products);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const fetchAuthors = async () => {
        setLoadingAuthors(true);
        try {
            const response = await fetch("/api/authors");
            if (response.ok) {
                const data = await response.json();
                setAuthors(data.authors);
            }
        } catch (error) {
            console.error("Error fetching authors:", error);
        } finally {
            setLoadingAuthors(false);
        }
    };

    const handleUpsertAuthor = async () => {
        if (!authorForm.name) {
            alert("Please enter the writer's name.");
            return;
        }
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
                setAuthorForm({ name: "", avatar: "", profession: "Intelligence Architect" });
                fetchAuthors();
                alert(editingAuthorId ? "Profile updated! ✨" : "Writer registered! ✨");
            } else {
                const errorData = await response.json();
                alert(`Failed to save author: ${errorData.error || "Unknown error"}`);
            }
        } catch (error: any) {
            console.error("Error saving author:", error);
            alert(`Error saving author: ${error.message}`);
        }
    };

    const handleDeleteAuthor = async (id: string) => {
        if (!confirm("Delete this writer profile?")) return;
        try {
            const response = await fetch(`/api/authors/${id}`, { method: "DELETE" });
            if (response.ok) {
                fetchAuthors();
                alert("Writer profile deleted.");
            } else {
                alert("Failed to delete writer.");
            }
        } catch (error) {
            console.error("Error deleting author:", error);
        }
    };

    const handleGenerate = async () => {
        if (!topic) return;
        setGenerating(true);
        setGeneratedBlog("");
        setMetadata(null);
        setEditMode(false);
        
        try {
            const response = await fetch("/api/blogs/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    topic, 
                    category: category || "Auto-detect", 
                    isFeatured,
                    author_name: authorName,
                    author_avatar: authorAvatarPreview,
                    sources: sources.filter(s => s.trim() !== ""),
                    layouts: sectionLayouts
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setGeneratedBlog(data.blog.content);
                setMetadata({
                    slug: data.blog.slug,
                    tags: data.blog.tags,
                    excerpt: data.blog.excerpt,
                    title: data.blog.title
                });
                setSectionLayouts(data.blog.layouts || []);
            }
        } catch (error) {
            console.error("Generation failed:", error);
        } finally {
            setGenerating(false);
        }
    };

    const handlePublish = async () => {
        if (!generatedBlog || !metadata) return;

        try {
            const blogData = {
                title: metadata.title,
                slug: metadata.slug,
                excerpt: metadata.excerpt,
                content: generatedBlog,
                category: category || "Uncategorized",
                author_name: authorName,
                author_avatar: authorAvatarPreview,
                thumbnail_url: thumbnailPreview,
                is_featured: isFeatured,
                tags: metadata.tags,
                layouts: sectionLayouts
            };

            const url = editingBlogId ? `/api/blogs/${editingBlogId}` : "/api/blogs";
            const method = editingBlogId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(blogData),
            });

            if (response.ok) {
                alert(editingBlogId ? "Blog updated successfully!" : "Blog published successfully!");
                setTopic("");
                setGeneratedBlog("");
                setMetadata(null);
                setThumbnailPreview("");
                setEditingBlogId(null);
                setSectionLayouts([]);
                fetchPublishedBlogs();
                setActiveTab("blogs");
            }
        } catch (error) {
            console.error("Publishing failed:", error);
        }
    };

    const handleEditBlog = (blog: Blog) => {
        setEditingBlogId(blog.id);
        setTopic(blog.title);
        setCategory(blog.category);
        setAuthorName(blog.author_name);
        setAuthorAvatarPreview(blog.author_avatar);
        setThumbnailPreview(blog.thumbnail_url);
        setGeneratedBlog(blog.content);
        setMetadata({
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            tags: blog.tags
        });
        setSectionLayouts((blog as any).layouts || []);
        setActiveTab("generate");
    };

    const updateSectionLayout = (index: number, side: 'left' | 'right', type: any, data: any = {}) => {
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
                setCropType("thumbnail");
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = async (croppedBlob: Blob) => {
        setShowCropper(false);
        setImageToCrop("");

        if (cropType === "thumbnail") {
            const croppedFile = new File([croppedBlob], "thumbnail.jpg", { type: "image/jpeg" });
            setThumbnail(croppedFile);

            const reader = new FileReader();
            reader.onloadend = () => setThumbnailPreview(reader.result as string);
            reader.readAsDataURL(croppedBlob);
        } else {
            setUploadingAvatar(true);
            try {
                const croppedFile = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
                const formData = new FormData();
                formData.append("file", croppedFile);
                formData.append("type", "avatar");

                const res = await fetch("/api/upload", { method: "POST", body: formData });
                if (res.ok) {
                    const data = await res.json();
                    setAuthorForm(prev => ({ ...prev, avatar: data.url }));
                } else {
                    alert("Failed to upload avatar");
                }
            } catch (error) {
                console.error("Avatar upload failed:", error);
                alert("Error uploading avatar");
            } finally {
                setUploadingAvatar(false);
            }
        }
    };

    const handleAuthorAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result as string);
                setCropType("avatar");
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpsertProduct = async () => {
        if (!productForm.title) {
            alert("Please enter a title for the asset.");
            return;
        }
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
                alert(editingProductId ? "Asset updated! ✨" : "Asset registered! ✨");
            } else {
                alert("Failed to save asset.");
            }
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Delete this product?")) return;
        try {
            const response = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
            if (response.ok) {
                fetchProducts();
                alert("Asset deleted.");
            } else {
                alert("Failed to delete asset.");
            }
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
            console.error("Error deleting blog:", error);
        }
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
            
            {showSidebar && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setShowSidebar(false)}
                />
            )}
            
            <main className="lg:pl-64 min-h-screen">
                <header className="h-12 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 md:px-6 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">Management</span>
                        <div className="h-3 w-px bg-white/10" />
                        <h2 className="text-xs font-bold text-muted-foreground/60">BandhanNova Blogs</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white/5" onClick={() => setShowSidebar(!showSidebar)}>
                            <Layout className="lg:hidden h-4 w-4 text-muted-foreground/40" />
                            <Search className="hidden lg:block h-4 w-4 text-muted-foreground/40" />
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
                                                <CardTitle className="text-lg font-black tracking-tight">Recent Activity</CardTitle>
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
                                                        <ArrowUpRight className="h-3 w-3 text-muted-foreground/20 group-hover:text-white transition-colors" />
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
                                <h1 className="text-3xl font-black tracking-tighter">
                                    {editingBlogId ? "Edit Intelligence" : "AI Generator"}
                                </h1>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <Card className="bg-white/[0.02] border-white/5 rounded-xl p-6">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Knowledge Topic</label>
                                                <Input 
                                                    value={topic}
                                                    onChange={(e) => setTopic(e.target.value)}
                                                    placeholder="e.g., The Future of Edge Computing in Web3"
                                                    className="bg-white/5 border-white/10 h-14 text-lg font-bold rounded-xl focus:ring-1 ring-primary/30 transition-all"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Intellectual Architect (Author)</label>
                                                    <select 
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-sm font-bold text-white outline-none focus:ring-1 ring-primary/30 transition-all"
                                                        onChange={(e) => {
                                                            if (e.target.value === "manual") {
                                                                setAuthorName("");
                                                                setAuthorAvatarPreview("/bandhannova-logo-final.svg");
                                                            } else {
                                                                const author = authors.find(a => a.id === e.target.value);
                                                                if (author) {
                                                                    setAuthorName(author.name);
                                                                    setAuthorAvatarPreview(author.avatar);
                                                                }
                                                            }
                                                        }}
                                                        value={authors.find(a => a.name === authorName)?.id || ""}
                                                    >
                                                        <option value="" disabled className="bg-zinc-950">Select a Writer</option>
                                                        {authors.map(author => (
                                                            <option key={author.id} value={author.id} className="bg-zinc-900">{author.name}</option>
                                                        ))}
                                                        <option value="manual" className="bg-zinc-900">Manual Entry</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Author Name (Manual)</label>
                                                    <Input
                                                        placeholder="e.g., Alex Rivers"
                                                        value={authorName}
                                                        onChange={(e) => setAuthorName(e.target.value)}
                                                        className="bg-white/5 border-white/10 h-12 text-sm font-bold rounded-xl"
                                                        disabled={generating}
                                                    />
                                                </div>
                                            </div>

                                            <Button 
                                                onClick={handleGenerate} 
                                                disabled={generating || !topic}
                                                className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 group"
                                            >
                                                {generating ? (
                                                    <div className="flex items-center gap-3">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        <span>Architecting Intelligence...</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
                                                        <span>Initialize Generation</span>
                                                    </div>
                                                )}
                                            </Button>
                                        </div>
                                    </Card>

                                    {generatedBlog && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                                <div className="flex items-center gap-4">
                                                    <h3 className="text-xl font-black tracking-tighter">Draft Review</h3>
                                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black tracking-widest">AI ARCHITECTED</Badge>
                                                </div>
                                                <Button onClick={handlePublish} className="rounded-xl bg-primary px-8 font-black uppercase tracking-widest text-[10px] shadow-lg h-11">
                                                    {editingBlogId ? "Update Content" : "Publish to Production"}
                                                </Button>
                                            </div>
                                            <Card className="bg-white/[0.01] rounded-xl p-8 border border-white/5 relative group">
                                                {editMode ? (
                                                    <textarea
                                                        value={generatedBlog}
                                                        onChange={(e) => setGeneratedBlog(e.target.value)}
                                                        className="w-full h-[800px] bg-transparent text-white font-mono text-sm leading-relaxed outline-none resize-none scrollbar-thin p-4"
                                                    />
                                                ) : (
                                                    <div 
                                                        className="prose prose-invert prose-sm md:prose-base max-w-none !text-white"
                                                        dangerouslySetInnerHTML={{ __html: markdownToHtml(generatedBlog) }}
                                                    />
                                                )}
                                                <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)} className="absolute top-6 right-6 h-8 rounded-xl text-[8px] font-black uppercase tracking-widest bg-black/60 border-white/10">
                                                    {editMode ? "Exit Editor" : "Edit Raw Markdown"}
                                                </Button>
                                            </Card>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <Card className="bg-white/[0.02] border-white/5 rounded-xl p-6 space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1">Thumbnail</label>
                                            <div 
                                                className="relative aspect-video w-full rounded-xl border-2 border-dashed border-white/5 flex items-center justify-center cursor-pointer overflow-hidden group"
                                                onClick={() => document.getElementById("thumb-upload")?.click()}
                                            >
                                                {thumbnailPreview ? (
                                                    <Image src={thumbnailPreview} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                                ) : (
                                                    <Upload className="h-6 w-6 text-white/10" />
                                                )}
                                            </div>
                                            <input id="thumb-upload" type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1">Classification</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {categories.filter(c => c !== "All").map((cat) => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => setCategory(cat)}
                                                        className={cn(
                                                            "px-3 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest text-left transition-all",
                                                            category === cat ? "bg-primary border-primary text-white" : "bg-white/[0.02] border-white/5 text-muted-foreground/40 hover:bg-white/5"
                                                        )}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="authors" className="space-y-6">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-black tracking-tighter">Writer Profiles</h1>
                                <p className="text-sm text-muted-foreground">Manage the intellectual architects of your platform.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-1 space-y-6">
                                    <Card className="bg-white/[0.02] border-white/5 rounded-xl p-6 space-y-6">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/60 border-b border-white/5 pb-4">
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
                                                    <div className="h-24 w-24 rounded-xl overflow-hidden border border-white/10 bg-white/5 relative mx-auto group">
                                                        {authorForm.avatar ? (
                                                            <Image src={authorForm.avatar} alt="Preview" fill className="object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-muted-foreground/20">
                                                                <User className="h-8 w-8" />
                                                            </div>
                                                        )}
                                                        {uploadingAvatar && (
                                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
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
                                                            {uploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Upload className="h-4 w-4 text-primary" />}
                                                            <input 
                                                                type="file" 
                                                                className="hidden" 
                                                                accept="image/*" 
                                                                onChange={handleAuthorAvatarChange} 
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 pt-6">
                                            <Button 
                                                onClick={handleUpsertAuthor} 
                                                disabled={uploadingAvatar}
                                                className="flex-1 h-12 rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                                            >
                                                {uploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                                {editingAuthorId ? "Update Profile" : "Register Writer"}
                                            </Button>
                                            {editingAuthorId && (
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={() => { setEditingAuthorId(null); setAuthorForm({ name: "", avatar: "", profession: "Intelligence Architect" }); }} 
                                                    className="h-12 px-6 text-[10px] font-black uppercase tracking-widest"
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                </div>

                                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {authors.map((author, idx) => (
                                        <div key={author.id || idx} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between group hover:bg-white/[0.04] hover:border-white/10 transition-all relative overflow-hidden">
                                            <div className="flex gap-5">
                                                <div className="h-20 w-20 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-black/40 relative">
                                                    {author.avatar ? <Image src={author.avatar} alt="" fill className="object-cover" /> : <User className="h-8 w-8 text-white/10" />}
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <h4 className="font-black text-lg tracking-tight truncate">{author.name}</h4>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 w-fit px-3 py-1 rounded-full border border-primary/20 mt-2">
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
                                                            profession: author.profession || "Intelligence Architect"
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

                        <TabsContent value="blogs" className="space-y-6">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-black tracking-tighter">Content Repository</h1>
                                <p className="text-sm text-muted-foreground">Manage and optimize your sharded knowledge cluster.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {publishedBlogs.map((blog) => (
                                    <Card key={blog.id} className="bg-white/[0.02] border-white/5 overflow-hidden group hover:bg-white/[0.04] transition-all">
                                        <div className="aspect-video relative overflow-hidden">
                                            <Image src={blog.thumbnail_url} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute top-4 left-4">
                                                <Badge className="bg-black/60 backdrop-blur-md border-white/10 text-[8px] font-black uppercase tracking-widest">{blog.category}</Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-6">
                                            <h4 className="text-sm font-bold line-clamp-2 min-h-[40px] mb-4">{blog.title}</h4>
                                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditBlog(blog)} className="h-8 px-3 text-[10px] font-black uppercase tracking-widest">Edit</Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteBlog(blog.id, blog.title)} className="h-8 px-3 text-[10px] font-black uppercase tracking-widest text-red-500/50">Delete</Button>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-muted-foreground/40">
                                                    <Eye className="h-3 w-3" />
                                                    <span className="text-[10px] font-bold">{blog.view_count || 0}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="products" className="space-y-6">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-black tracking-tighter">Asset Inventory</h1>
                                <p className="text-sm text-muted-foreground">Manage monetization links and brand visual assets.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <Card className="lg:col-span-1 bg-white/[0.02] border-white/5 p-6 space-y-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/60 border-b border-white/5 pb-4">
                                        {editingProductId ? "Update Asset" : "Register Asset"}
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Type</label>
                                            <select 
                                                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-xs font-bold text-white"
                                                value={productForm.type}
                                                onChange={(e) => setProductForm({ ...productForm, type: e.target.value as any })}
                                            >
                                                <option value="affiliate">Affiliate Link</option>
                                                <option value="brand">Brand Video</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Title</label>
                                            <Input 
                                                value={productForm.title}
                                                onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                                                className="bg-zinc-900 border-white/10 h-12"
                                            />
                                        </div>
                                        <Button onClick={handleUpsertProduct} className="w-full h-12 rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest">
                                            {editingProductId ? "Save Changes" : "Register Asset"}
                                        </Button>
                                    </div>
                                </Card>

                                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {products.map((p) => (
                                        <div key={p.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                                                    {p.type === 'brand' ? <Video className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                                                </div>
                                                <p className="text-xs font-bold truncate max-w-[150px]">{p.title}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => { setEditingProductId(p.id); setProductForm(p); }}><Edit3 className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(p.id)} className="text-red-500/50"><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="brands" className="space-y-10">
                            <div className="space-y-10">
                                <div className="flex flex-col gap-1">
                                    <h1 className="text-3xl font-black tracking-tighter">Brand Collaborations</h1>
                                    <p className="text-sm text-muted-foreground">Manage premium brand video placements.</p>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {products.filter(p => p.type === 'brand').map((p) => (
                                        <Card key={p.id} className="bg-white/[0.02] border-white/5 p-4 space-y-4">
                                            <div className="aspect-video relative rounded-lg overflow-hidden bg-black/40">
                                                <video src={p.video_url} className="h-full w-full object-cover" muted loop autoPlay />
                                            </div>
                                            <h4 className="text-xs font-bold">{p.title}</h4>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => { setEditingProductId(p.id); setProductForm(p); }} className="flex-1 h-9 text-[10px] font-black uppercase tracking-widest">Edit</Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(p.id)} className="h-9 px-4 text-red-500/50">Delete</Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-10">
                             <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-black tracking-tighter">System Configuration</h1>
                                <p className="text-sm text-muted-foreground">Fine-tune the engine.</p>
                            </div>
                            <Card className="bg-white/[0.02] border-white/5 rounded-xl p-6">
                                <Button 
                                    variant="outline" 
                                    onClick={async () => {
                                        const res = await fetch("/api/admin/init-db", { method: "POST" });
                                        if (res.ok) alert("Database synced! 🚀");
                                    }}
                                    className="text-[10px] font-black uppercase tracking-widest"
                                >
                                    Sync DB
                                </Button>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            {showCropper && (
                <ImageCropper
                    image={imageToCrop}
                    onCropComplete={handleCropComplete}
                    onCancel={() => {
                        setShowCropper(false);
                        setImageToCrop("");
                    }}
                    aspectRatio={cropType === "avatar" ? 1 : 16 / 9}
                />
            )}
        </div>
    );
}
