export interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author_name: string;
    author_avatar: string;
    thumbnail_url: string;
    read_time: number;
    tags: string[];
    published_at: string;
    created_at: string;
    updated_at: string;
}

export interface Database {
    public: {
        Tables: {
            blogs: {
                Row: Blog;
                Insert: Omit<Blog, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Blog, 'id' | 'created_at' | 'updated_at'>>;
            };
        };
    };
}
