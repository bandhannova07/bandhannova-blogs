import { createAdminClient } from './supabase/server';
import type { Blog } from './supabase/types';

// ... existing functions ...

// Increment blog view count
export async function incrementBlogViews(slug: string): Promise<void> {
    try {
        const supabase = createAdminClient();

        // Get current view count
        const { data: blog } = await supabase
            .from('blogs')
            .select('view_count')
            .eq('slug', slug)
            .single();

        if (blog) {
            // Increment view count
            await supabase
                .from('blogs')
                .update({ view_count: (blog.view_count || 0) + 1 })
                .eq('slug', slug);
        }
    } catch (error) {
        // Silently fail - don't break page if view tracking fails
        console.error('Error incrementing view count:', error);
    }
}
