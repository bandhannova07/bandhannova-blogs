// Increment blog view count - Disabled (Static Mode)
export async function incrementBlogViews(slug: string): Promise<void> {
    // No-op in static mode
    // We could use localStorage if we really wanted to track local views
}
