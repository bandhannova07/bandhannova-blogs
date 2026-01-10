# 🤖 AI Blog Generator - User Guide

## What is This?

An AI-powered blog generator that automatically creates SEO-optimized blog posts for BandhanNova AI Hub using OpenRouter's xiaomi/mimo-v2-flash model.

---

## 🚀 How to Use

### Step 1: Access Admin Panel
Navigate to: **http://localhost:3000/admin**

### Step 2: Generate Blog
1. **Enter Topic**: Type your blog topic (e.g., "How AI is Transforming Education")
2. **Select Category**: Choose from:
   - Career Guide
   - Study Guide
   - AI & Technology
   - Skills Development
3. **Click "Generate Blog Post 🚀"**
4. Wait 10-30 seconds for AI to generate content

### Step 3: Copy & Add to Blog
1. Click **"Copy Code"** button
2. Open `lib/blog-data.ts`
3. Find the `blogPosts` array
4. Paste the copied code inside the array (before the closing `]`)
5. Save the file
6. Your new blog will appear on the homepage! 🎉

---

## ✨ Features

### AI-Generated Content
- ✅ 1200-1500 words per blog
- ✅ SEO-optimized titles and content
- ✅ Natural emoji usage (🚀 💡 ✨ 🎯 📚)
- ✅ Student-friendly language
- ✅ No specific class/board references
- ✅ Indian context examples
- ✅ Soft CTA for BandhanNova AI

### Auto-Generated Metadata
- **Title**: Extracted from AI content
- **Slug**: Auto-generated URL-friendly slug
- **Excerpt**: First 200 characters
- **Tags**: Auto-extracted keywords
- **Read Time**: Calculated based on word count
- **Category**: Your selected category
- **Publish Date**: Today's date

### Content Quality
- 📝 Professional, mentor-like tone
- 🎯 Practical examples and tips
- 🔍 AdSense-safe content
- 🚫 No fake statistics
- ✅ Original, non-plagiarized content

---

## 🎨 Example Usage

**Input:**
```
Topic: "Essential Digital Skills for Modern Students"
Category: Skills Development
```

**Output:**
```typescript
{
  id: "1736438400000",
  slug: "essential-digital-skills-modern-students",
  title: "Essential Digital Skills for Modern Students 💻✨",
  excerpt: "In today's digital age, students need more than just...",
  content: `[Full 1500-word blog post with proper formatting]`,
  category: "Skills Development",
  author: {
    name: "BandhanNova AI Team",
    avatar: "/bandhannova-logo-final.svg",
  },
  publishedAt: new Date("2026-01-09"),
  readTime: 8,
  image: "https://images.unsplash.com/photo-...",
  tags: ["Digital", "Skills", "Students", "Technology"],
}
```

---

## 🔧 Technical Details

### API Configuration
- **Provider**: OpenRouter
- **Model**: xiaomi/mimo-v2-flash:free
- **API Key**: Stored in `.env.local`
- **Max Tokens**: 4000
- **Temperature**: 0.7 (balanced creativity)

### File Structure
```
app/
├── admin/
│   └── page.tsx          # Admin UI
├── api/
│   └── generate-blog/
│       └── route.ts      # API endpoint
lib/
└── ai-blog-generator.ts  # AI service
```

### Environment Variables
```env
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=xiaomi/mimo-v2-flash:free
```

---

## 💡 Tips for Best Results

### Topic Ideas
- **Career Guide**: "Career Paths in AI and Machine Learning"
- **Study Guide**: "Effective Study Techniques for Competitive Exams"
- **AI & Technology**: "Understanding ChatGPT and Large Language Models"
- **Skills Development**: "Public Speaking Skills for Students"

### Topic Format
✅ **Good**: "How to Build a Portfolio for Tech Jobs"
✅ **Good**: "Time Management Strategies for Busy Students"
❌ **Avoid**: "Class 10 CBSE Math Tips" (too specific)
❌ **Avoid**: "JEE Preparation Guide" (too exam-specific)

### After Generation
1. **Review Content**: Always read the generated blog
2. **Edit if Needed**: You can modify the content before adding
3. **Change Image**: Update the Unsplash image URL if desired
4. **Adjust Read Time**: Modify if you edit the content significantly

---

## 🎯 Content Guidelines

The AI is programmed to follow these rules:
- Write for **students** (not specific classes)
- Use **Indian context** examples
- Include **emojis** naturally
- Maintain **friendly tone**
- Add **practical tips**
- Include **soft CTA** for BandhanNova AI
- Ensure **AdSense safety**
- Create **SEO-optimized** content

---

## 🐛 Troubleshooting

### "Failed to generate blog"
- Check internet connection
- Verify API key in `.env.local`
- Try a different topic
- Wait a moment and try again

### Content too short/long
- AI generates 1200-1500 words typically
- You can edit the content after generation
- Adjust `max_tokens` in `ai-blog-generator.ts` if needed

### Formatting issues
- Content is in markdown format
- It will be converted to HTML automatically
- Check the preview before copying

---

## 📊 Cost & Limits

- **Model**: xiaomi/mimo-v2-flash:free
- **Cost**: FREE! 🎉
- **Rate Limits**: Check OpenRouter dashboard
- **Recommended**: Generate 1-2 blogs at a time

---

## 🚀 Next Steps

1. Try generating your first blog!
2. Experiment with different topics
3. Build a content library
4. Share with your audience

**Happy Blogging! ✨🚀**

---

## 📞 Support

For issues or questions:
- Check the code in `lib/ai-blog-generator.ts`
- Review API logs in browser console
- Contact BandhanNova team

---

**Built with ❤️ for BandhanNova AI Hub**
