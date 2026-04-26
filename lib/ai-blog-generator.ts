export async function generateBlogWithAI(topic: string, currentCategory: string, categories: string[], sources?: { url: string; content: string }[]) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || "liquid/lfm-2.5-1.2b-instruct:free";

    let sourcesContext = "";
    if (sources && sources.length > 0) {
        sourcesContext = "\n\nCRITICAL REFERENCE SOURCES:\n";
        sources.forEach((source, index) => {
            sourcesContext += `\n--- SOURCE ${index + 1} --- \nURL: ${source.url}\nCONTENT: ${source.content}\n--------------------\n`;
        });
        sourcesContext += "\nSTRICT INSTRUCTIONS: Use the information from these sources to write a high-level, unique blog. Synthesize the data, don't just copy. Ensure all technical terms are explained correctly.\n";
    }

    const prompt = `You are a professional blog writer for BandhanNova AI Hub, an AI platform for students.

Write a comprehensive, SEO-optimized blog post about: "${topic}"

Category: ${currentCategory}${sourcesContext}

IMPORTANT REQUIREMENTS:
- Write for students (avoid specific class/board references like "Class 10", "CBSE", etc.)
- Use generic terms like "students", "learners", "young minds"
- Word count: 1300-1500 words
- Use emojis naturally throughout the content (🚀 💡 ✨ 🎯 📚 etc.)
- Write in a friendly, mentor-like tone
- Include practical examples relevant to Indian students
- NO fake statistics or copied content
- AdSense safe content
- Include a soft CTA mentioning BandhanNova AI naturally

STRUCTURE & STYLE REFERENCE (Follow this "High-Level" standard):
1. Use # [Title with Emoji] for the main heading.
2. Use ## for major sections and ### for sub-sections.
3. Use GitHub-style callouts for key information (NOTE, TIP, IMPORTANT, etc.).
4. Include at least one complex code block if relevant, with comments in Bengali.
5. Use --- (horizontal rules) between major sections.
6. IMAGE STRATEGY (CRITICAL): 
   - Identify 3-4 locations where a high-fidelity image or technical diagram would enhance the blog.
   - At each location, insert this exact special tag: \`[IMAGE_PROMPT: Provide a 4-5 line high-fidelity AI image generation prompt describing exactly what should be in the image, the style, lighting, and technical details.]\`
   - Do NOT use standard markdown image tags. ONLY use the [IMAGE_PROMPT: ...] format.
7. End with a strong Conclusion and a soft Call to Action.

CATEGORY SELECTION:
Choose the most appropriate category from: ${categories.filter(c => c !== "All").join(", ")}

METADATA BLOCK (MANDATORY):
At the very top of your response, before anything else, include this exact block:
---
Selected-Category: [Your Choice]
---

Write the complete blog post in markdown format now:`;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://blogs.bandhannova.in",
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
    // Extract category from metadata block
    const categoryMatch = content.match(/Selected-Category:\s+(.+)/i);
    const category = categoryMatch ? categoryMatch[1].trim() : "AI & Technology";

    // Extract title from markdown (ignoring metadata block)
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

    // Generate unique slug with timestamp
    const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const timestamp = Date.now();
    const slug = `${baseSlug}-${timestamp}`;

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

    // Remove metadata blocks from the final content to avoid showing them to users
    // We preserve [IMAGE_PROMPT: ...] tags as they will be handled by the editor UI
    const cleanContent = content
        .replace(/---[\s\S]+?Selected-Category:[\s\S]+?---/, '')
        .trim();

    return {
        title,
        slug,
        excerpt,
        tags,
        readTime,
        category,
        cleanContent,
    };
}
