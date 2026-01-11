import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

interface BlogMetadata {
    title: string;
    slug: string;
    excerpt: string;
    tags: string[];
    readTime: number;
}

interface GeneratedBlog {
    metadata: BlogMetadata;
    content: string;
}

// Generate unique slug with timestamp
function generateUniqueSlug(title: string): string {
    const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    // Add timestamp to ensure uniqueness
    const timestamp = Date.now();
    return `${baseSlug}-${timestamp}`;
}

export async function generateBlogPost(topic: string, category: string): Promise<GeneratedBlog> {
    const systemPrompt = `You are an expert content writer for BandhanNova AI Hub, a platform dedicated to helping Indian students with career guidance, study tips, AI technology, and skill development.

Your writing style:
- Clear, practical, and student-friendly
- Uses simple language that Indian students can easily understand
- Includes real-world examples and actionable advice
- Optimistic and encouraging tone
- Focuses on practical implementation

Target audience: Indian students (ages 16-25) looking for guidance on careers, studies, technology, and skills.`;

    const userPrompt = `Write a comprehensive blog post about "${topic}" in the "${category}" category.

Requirements:
1. Title: Catchy and SEO-friendly (50-60 characters)
2. Content: 1500-2000 words in Markdown format
3. Structure:
   - Engaging introduction
   - 4-6 main sections with clear headings
   - Practical examples and tips
   - Conclusion with actionable takeaways
4. Excerpt: Compelling 150-character summary
5. Tags: 5-7 relevant tags
6. Estimated read time in minutes

Format your response as JSON:
{
  "title": "Blog title here",
  "excerpt": "Brief summary here",
  "content": "Full markdown content here",
  "tags": ["tag1", "tag2", "tag3"],
  "readTime": 8
}`;

    try {
        const completion = await openai.chat.completions.create({
            model: process.env.OPENROUTER_MODEL || 'xiaomi/mimo-v2-flash:free',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
            max_tokens: 4000,
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
            throw new Error('No response from AI');
        }

        const parsed = JSON.parse(response);

        // Generate unique slug with timestamp
        const slug = generateUniqueSlug(parsed.title);

        return {
            metadata: {
                title: parsed.title,
                slug: slug,
                excerpt: parsed.excerpt,
                tags: parsed.tags || [],
                readTime: parsed.readTime || 5,
            },
            content: parsed.content,
        };
    } catch (error) {
        console.error('Error generating blog:', error);
        throw new Error('Failed to generate blog post');
    }
}
