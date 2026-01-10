"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Copy, Check, LogOut, Upload, X, Trash2, RefreshCw } from "lucide-react";
import { categories } from "@/lib/blog-data";
import Image from "next/image";
import type { Blog } from "@/lib/supabase/types";
import { ImageCropper } from "@/components/image-cropper";

export default function AdminPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Blog generation states
    const [topic, setTopic] = useState("");
    const [category, setCategory] = useState("AI & Technology");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [showCropper, setShowCropper] = useState(false);
    const [imageToCrop, setImageToCrop] = useState("");
    const [generating, setGenerating] = useState(false);
    const [generatedBlog, setGeneratedBlog] = useState("");
    const [metadata, setMetadata] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    // Published blogs states
    const [publishedBlogs, setPublishedBlogs] = useState<Blog[]>([]);
    const [loadingBlogs, setLoadingBlogs] = useState(false);

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

    const fetchPublishedBlogs = async () => {
        setLoadingBlogs(true);
        try {
            const response = await fetch("/api/blogs");
            if (response.ok) {
                const data = await response.json();
                setPublishedBlogs(data.blogs || []);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoadingBlogs(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
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
        reader.onloadend = () => {
            setThumbnailPreview(reader.result as string);
        };
        reader.readAsDataURL(croppedBlob);

        setShowCropper(false);
        setImageToCrop("");
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setImageToCrop("");
    };

    const handleGenerate = async () => {
        if (!topic.trim()) {
            alert("Please enter a topic!");
            return;
        }

        setGenerating(true);
        setGeneratedBlog("");
        setMetadata(null);

        try {
            const response = await fetch("/api/generate-blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, category }),
            });

            if (!response.ok) throw new Error("Failed to generate blog");

            const data = await response.json();
            setGeneratedBlog(data.content);
            setMetadata(data.metadata);
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to generate blog. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const handlePublish = async () => {
        if (!generatedBlog || !metadata) return;

        setGenerating(true);
        try {
            let thumbnailUrl = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop";

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

            const response = await fetch("/api/blogs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: metadata.title,
                    slug: metadata.slug,
                    excerpt: metadata.excerpt,
                    content: generatedBlog,
                    category,
                    author_name: "BandhanNova AI Team",
                    author_avatar: "/bandhannova-logo-final.svg",
                    thumbnail_url: thumbnailUrl,
                    read_time: metadata.readTime,
                    tags: metadata.tags,
                    published_at: new Date().toISOString(),
                }),
            });

            if (!response.ok) throw new Error("Failed to publish blog");

            alert("Blog published successfully! 🎉");

            setTopic("");
            setThumbnail(null);
            setThumbnailPreview("");
            setGeneratedBlog("");
            setMetadata(null);

            fetchPublishedBlogs();
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to publish blog. Please try again.");
        } finally {
            setGenerating(false);
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

    const copyToClipboard = () => {
        if (!generatedBlog || !metadata) return;

        const blogObject = `{
  id: "${Date.now()}",
  slug: "${metadata.slug}",
  title: "${metadata.title}",
  excerpt: "${metadata.excerpt}",
  content: \`${generatedBlog}\`,
  category: "${category}",
  author: {
    name: "BandhanNova AI Team",
    avatar: "/bandhannova-logo-final.svg",
  },
  publishedAt: new Date("${new Date().toISOString().split('T')[0]}"),
  readTime: ${metadata.readTime},
  image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
  tags: ${JSON.stringify(metadata.tags)},
},`;

        navigator.clipboard.writeText(blogObject);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-bold gradient-text">
                            🤖 AI Blog Generator
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Powered by OpenRouter • xiaomi/mimo-v2-flash ✨
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="gap-2">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="generate" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="generate">Generate Blog</TabsTrigger>
                        <TabsTrigger value="published">Published Blogs ({publishedBlogs.length})</TabsTrigger>
                    </TabsList>

                    {/* Generate Tab */}
                    <TabsContent value="generate" className="space-y-6">
                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="text-2xl">Generate New Blog Post 📝</CardTitle>
                                <CardDescription className="text-base">
                                    Enter a topic, upload thumbnail, and let AI create SEO-optimized content
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Topic</label>
                                    <Input
                                        placeholder="e.g., How AI is Transforming Education"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="text-lg h-12"
                                        disabled={generating}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.filter(c => c !== "All").map((cat) => (
                                            <Badge
                                                key={cat}
                                                variant={category === cat ? "default" : "outline"}
                                                className="cursor-pointer text-sm px-4 py-2"
                                                onClick={() => !generating && setCategory(cat)}
                                            >
                                                {cat}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Thumbnail Image (Optional)</label>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => document.getElementById("thumbnail-upload")?.click()}
                                            disabled={generating}
                                            className="gap-2"
                                        >
                                            <Upload className="h-4 w-4" />
                                            Choose Image
                                        </Button>
                                        <input
                                            id="thumbnail-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailChange}
                                            className="hidden"
                                        />
                                        {thumbnail && <span className="text-sm text-muted-foreground">{thumbnail.name}</span>}
                                    </div>
                                    {thumbnailPreview && (
                                        <div className="relative w-full h-48 rounded-lg overflow-hidden border-2">
                                            <Image src={thumbnailPreview} alt="Preview" fill className="object-cover" />
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="absolute top-2 right-2"
                                                onClick={() => {
                                                    setThumbnail(null);
                                                    setThumbnailPreview("");
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    onClick={handleGenerate}
                                    disabled={generating || !topic.trim()}
                                    size="lg"
                                    className="w-full text-lg h-14"
                                >
                                    {generating ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Generating Amazing Content...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-5 w-5" />
                                            Generate Blog Post 🚀
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Generated Content */}
                        {generatedBlog && metadata && (
                            <Card className="border-2 border-primary/20">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-2xl">Generated Blog ✨</CardTitle>
                                        <div className="flex gap-2">
                                            <Button onClick={copyToClipboard} variant="outline" className="gap-2">
                                                {copied ? (
                                                    <>
                                                        <Check className="h-4 w-4" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-4 w-4" />
                                                        Copy Code
                                                    </>
                                                )}
                                            </Button>
                                            <Button onClick={handlePublish} disabled={generating} className="gap-2">
                                                <Sparkles className="h-4 w-4" />
                                                Publish to Database ✨
                                            </Button>
                                        </div>
                                    </div>
                                    <CardDescription className="text-base">
                                        Review and publish your blog post
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Title</p>
                                            <p className="font-semibold">{metadata.title}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Slug</p>
                                            <p className="font-mono text-sm">{metadata.slug}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Read Time</p>
                                            <p className="font-semibold">{metadata.readTime} min ⏱️</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Content Preview:</p>
                                        <div className="max-h-96 overflow-y-auto p-6 bg-muted/30 rounded-lg prose prose-sm max-w-none">
                                            <pre className="whitespace-pre-wrap text-sm">{generatedBlog.substring(0, 500)}...</pre>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Published Blogs Tab */}
                    <TabsContent value="published" className="space-y-6">
                        <Card className="border-2">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl">Published Blogs 📚</CardTitle>
                                        <CardDescription className="text-base">
                                            Manage your published blog posts
                                        </CardDescription>
                                    </div>
                                    <Button onClick={fetchPublishedBlogs} variant="outline" size="icon">
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loadingBlogs ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                ) : publishedBlogs.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <p className="text-lg">No blogs published yet</p>
                                        <p className="text-sm">Generate and publish your first blog!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {publishedBlogs.map((blog) => (
                                            <div
                                                key={blog.id}
                                                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="relative h-20 w-32 rounded overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={blog.thumbnail_url}
                                                        alt={blog.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-lg truncate">{blog.title}</h3>
                                                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                        <Badge variant="outline">{blog.category}</Badge>
                                                        <span>{blog.read_time} min read</span>
                                                        <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleDeleteBlog(blog.id, blog.title)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Image Cropper Modal */}
            {showCropper && (
                <ImageCropper
                    image={imageToCrop}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                    aspectRatio={16 / 9}
                />
            )}
        </div>
    );
}
