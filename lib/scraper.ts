/**
 * BandhanNova Web Scraper
 * Extracts clean text content from URLs to provide context for AI Blog Generation.
 */
export async function scrapeUrl(url: string): Promise<string> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) throw new Error(`Failed to fetch ${url}`);

        const html = await response.text();

        // Simple but effective text extraction using Regex
        // 1. Remove scripts and styles
        let text = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '');
        text = text.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, '');
        
        // 2. Extract content from body (or main/article tags if present)
        const bodyMatch = text.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) text = bodyMatch[1];

        // 3. Remove all HTML tags
        text = text.replace(/<[^>]+>/g, ' ');

        // 4. Clean up whitespace and special entities
        text = text.replace(/&nbsp;/g, ' ')
                   .replace(/&amp;/g, '&')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/\s+/g, ' ')
                   .trim();

        // 5. Limit content size to prevent prompt overflow (approx 3000 words per source)
        return text.substring(0, 12000); 
    } catch (error) {
        console.error(`Scraping error for ${url}:`, error);
        return `Error: Could not retrieve content from ${url}`;
    }
}
