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

    const prompt = `You are an elite content architect and storyteller for BandhanNova AI Hub. Your mission is to write a blog post that feels 100% human-written, authentic, and deeply engaging.

Write a comprehensive, SEO-optimized blog post about: "${topic}"

Category: ${currentCategory}${sourcesContext}

AUTHENTICITY & STYLE GUIDELINES (MANDATORY):
1. PERSONAL OPENING: Start with a relatable, personal-feeling hook. Use phrases like "I've been thinking a lot about...", "Recently, I noticed...", or "Let's be honest...". Connect with the student's perspective immediately.
2. STORYTELLING & ANECDOTES: Weave in a small anecdote or a "what-if" scenario that illustrates the topic. Make it feel like a real experience. Use specific, vivid details.
3. CONVERSATIONAL RHYTHM: Write like a mentor talking to a friend over coffee. Use rhetorical questions (e.g., "Ever wondered why...?", "Sounds familiar, right?"). Use natural "filler" phrases occasionally to break the formal structure (e.g., "Actually...", "Wait, let's step back for a second...").
4. AVOID ROBOTIC TRANSITIONS: NEVER use "In conclusion", "Firstly", "Secondly", "Moreover", "Furthermore", or "Additionally". Instead, use smooth, natural bridges between ideas that feel like a logical flow of thought.
5. SENTENCE VARIATION: Mix short, punchy sentences for impact with longer, descriptive ones for depth. Avoid the uniform sentence length that identifies AI writing.
6. PRACTICAL EMPATHY: Acknowledge the struggles students face (procrastination, exam stress, confusion) and offer genuine, actionable advice.
7. INTELLECTUAL HUMILITY: Don't sound like an all-knowing machine. Admit when a topic is complex or has multiple perspectives.

IMPORTANT REQUIREMENTS:
- Write for students (avoid specific class/board references).
- Use generic terms like "students", "learners", "young minds".
- Word count: 1400-1600 words of HIGH-VALUE content.
- Use emojis naturally but strategically (🚀 💡 ✨ 🎯 📚).
- Include practical examples relevant to the Indian student ecosystem.
- NO fake statistics. If you don't have a source, speak from a "general observation" standpoint.
- AdSense safe content.

STRUCTURE:
1. Use # [Title with Emoji] for the main heading.
2. Use ## for major sections and ### for sub-sections.
3. Use GitHub-style callouts for key information (NOTE, TIP, IMPORTANT, etc.).
4. Include at least one complex code block if relevant, with comments in Bengali.
5. Use --- (horizontal rules) between major sections.
6. IMAGE STRATEGY: 
   - Identify 3-4 locations for high-fidelity images.
   - Insert: \`[IMAGE_PROMPT: Detailed AI image generation prompt]\`.
7. End with a "Final Thoughts" section (NOT "Conclusion") and a soft, natural CTA for BandhanNova AI.

CATEGORY SELECTION:
Choose from: ${categories.filter(c => c !== "All").join(", ")}

METADATA BLOCK (MANDATORY):
At the very top:
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
