export interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author_name: string;
    author_avatar: string;
    published_at: string;
    read_time: number;
    thumbnail_url: string;
    tags: string[];
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
