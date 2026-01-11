// Blog categories
export const categories = [
    "All",
    "AI & Technology",
    "Learning & Education",
    "Digital Skill Development",
    "Blogging & Content",
    "Tools & Resources",
] as const;

export type Category = typeof categories[number];

// Blog post interface (for reference, actual data now in Supabase)
export interface BlogPost {
    id: string;
    slug: string;
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

// Empty array - blogs now fetched from Supabase
export const blogPosts: BlogPost[] = [];
