export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: Date;
  readTime: number;
  image: string;
  tags: string[];
}

export const categories = [
  "All",
  "AI & Machine Learning",
  "Web Development",
  "Mobile Apps",
  "Cloud Computing",
  "Data Science",
  "Tutorials"
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with BandhanNova AI Hub",
    excerpt: "Discover how BandhanNova AI Hub is revolutionizing the way developers build intelligent applications with cutting-edge AI technology.",
    content: "Full blog content here...",
    category: "AI & Machine Learning",
    author: {
      name: "BandhanNova Team",
      avatar: "/bandhannova-logo-final.svg"
    },
    publishedAt: new Date("2026-01-05"),
    readTime: 5,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    tags: ["AI", "Getting Started", "Tutorial"]
  },
  {
    id: "2",
    title: "Building Scalable Web Applications with Next.js",
    excerpt: "Learn best practices for building high-performance, scalable web applications using Next.js and modern web technologies.",
    content: "Full blog content here...",
    category: "Web Development",
    author: {
      name: "Dev Team",
      avatar: "/bandhannova-logo-final.svg"
    },
    publishedAt: new Date("2026-01-03"),
    readTime: 8,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
    tags: ["Next.js", "React", "Web Development"]
  },
  {
    id: "3",
    title: "The Future of AI in Mobile Development",
    excerpt: "Explore how artificial intelligence is transforming mobile app development and creating smarter, more intuitive user experiences.",
    content: "Full blog content here...",
    category: "Mobile Apps",
    author: {
      name: "AI Research Team",
      avatar: "/bandhannova-logo-final.svg"
    },
    publishedAt: new Date("2026-01-01"),
    readTime: 6,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop",
    tags: ["AI", "Mobile", "Innovation"]
  },
  {
    id: "4",
    title: "Cloud Computing Best Practices for 2026",
    excerpt: "Stay ahead of the curve with the latest cloud computing strategies and best practices for modern application deployment.",
    content: "Full blog content here...",
    category: "Cloud Computing",
    author: {
      name: "Cloud Team",
      avatar: "/bandhannova-logo-final.svg"
    },
    publishedAt: new Date("2025-12-28"),
    readTime: 7,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop",
    tags: ["Cloud", "DevOps", "Best Practices"]
  },
  {
    id: "5",
    title: "Data Science Fundamentals: A Beginner's Guide",
    excerpt: "Master the basics of data science with this comprehensive guide covering essential concepts, tools, and techniques.",
    content: "Full blog content here...",
    category: "Data Science",
    author: {
      name: "Data Team",
      avatar: "/bandhannova-logo-final.svg"
    },
    publishedAt: new Date("2025-12-25"),
    readTime: 10,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    tags: ["Data Science", "Python", "Analytics"]
  },
  {
    id: "6",
    title: "Advanced TypeScript Patterns for React Developers",
    excerpt: "Level up your React development with advanced TypeScript patterns that improve code quality and developer experience.",
    content: "Full blog content here...",
    category: "Web Development",
    author: {
      name: "Frontend Team",
      avatar: "/bandhannova-logo-final.svg"
    },
    publishedAt: new Date("2025-12-22"),
    readTime: 9,
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop",
    tags: ["TypeScript", "React", "Advanced"]
  }
];
