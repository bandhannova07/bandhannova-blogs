export async function generateBlogWithAI(topic: string, category: string) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || "xiaomi/mimo-v2-flash:free";

    const prompt = `You are a professional blog writer for BandhanNova AI Hub, an AI platform for students.

Write a comprehensive, SEO-optimized blog post about: "${topic}"

Category: ${category}

IMPORTANT REQUIREMENTS:
- Write for students (avoid specific class/board references like "Class 10", "CBSE", etc.)
- Use generic terms like "students", "learners", "young minds"
- Word count: 1200-1500 words
- Use emojis naturally throughout the content (🚀 💡 ✨ 🎯 📚 etc.)
- Write in a friendly, mentor-like tone
- Include practical examples relevant to Indian students
- NO fake statistics or copied content
- AdSense safe content
- Include a soft CTA mentioning BandhanNova AI naturally

STRUCTURE:
# [SEO-Friendly Title with Emoji]

## Introduction (120-150 words)
[Engaging introduction that hooks the reader]

## [Main Section 1]
[Detailed content with H3 subheadings, bullet points, examples]

### [Subsection]
[Content with practical tips]

## [Main Section 2]
[More detailed content]

## [Main Section 3]
[Continue with valuable information]

## Key Takeaways
- [Bullet point 1]
- [Bullet point 2]
- [Bullet point 3]

## [Soft CTA Section]
[Natural mention of how BandhanNova AI can help]

Write the complete blog post in markdown format now:`;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://bandhannova.in",
                "X-Title": "BandhanNova AI Hub Blog Generator",
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 4000,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
            throw new Error("No content generated");
        }

        return content;
    } catch (error) {
        console.error("Error generating blog:", error);
        throw error;
    }
}

export async function generateBlogMetadata(content: string) {
    // Extract title from markdown
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].replace(/[#*_`]/g, '').trim() : "Untitled Blog Post";

    // Generate excerpt (first paragraph after title)
    const lines = content.split('\n').filter(line => line.trim());
    const firstParagraph = lines.find(line =>
        !line.startsWith('#') &&
        !line.startsWith('##') &&
        line.length > 50
    );
    const excerpt = firstParagraph
        ? firstParagraph.substring(0, 200) + "..."
        : "Explore insights from BandhanNova AI Hub";

    // Generate slug
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    // Extract tags (look for keywords in title and content)
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];
    const words = title.toLowerCase().split(/\s+/).filter(w =>
        w.length > 3 && !commonWords.includes(w)
    );
    const tags = words.slice(0, 4).map(w =>
        w.charAt(0).toUpperCase() + w.slice(1)
    );

    // Estimate read time (average 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    return {
        title,
        slug,
        excerpt,
        tags,
        readTime,
    };
}
