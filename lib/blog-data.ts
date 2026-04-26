
// Blog categories
export const categories = [
    "All",
    "AI & Technology",
    "Software Development",
    "Cloud & DevOps",
    "Cybersecurity",
    "Web 3.0 & Blockchain",
    "Learning & Education",
    "Digital Skill Development",
    "Blogging & Content",
    "Tools & Resources",
    "Business & Startups",
    "Productivity",
    "Research & Innovation",
] as const;

export type Category = typeof categories[number];

// Blog post interface (for reference, actual data now in Turso via BFOBS)
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

// Empty array - blogs now fetched from Turso via BFOBS
export const blogPosts: BlogPost[] = [];
