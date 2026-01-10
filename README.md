# BandhanNova AI Hub - Blog Platform

A modern, AI-powered blog platform built with Next.js, featuring dynamic content management, AI-generated blog posts, and a beautiful responsive design.

## 🌟 Features

### Core Features
- **AI-Powered Content Generation** - Generate SEO-optimized blog posts using AI
- **Dynamic Blog Management** - Create, edit, and delete blogs through admin panel
- **Image Cropper** - Built-in image cropper for perfect blog thumbnails (16:9 aspect ratio)
- **Responsive Design** - Optimized for all devices from mobile to desktop
- **Dark/Light Mode** - Seamless theme switching with system preference support
- **Search & Filter** - Find blogs by category, tags, or search query
- **Real-time Database** - Powered by Supabase for instant updates

### Admin Features
- **Secure Authentication** - Two-factor authentication with email and passkey
- **Blog Editor** - Generate and publish blogs with AI assistance
- **Thumbnail Management** - Upload and crop images before publishing
- **Content Preview** - Preview generated content before publishing
- **Blog Management** - View, edit, and delete published blogs

## 🛠️ Tech Stack

- **Framework:** Next.js 16.1.1 (with Turbopack)
- **UI Library:** React 19, Tailwind CSS v4
- **Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **AI:** OpenRouter API
- **Image Processing:** react-easy-crop
- **Animations:** Framer Motion
- **Markdown:** marked
- **Date Handling:** date-fns

## 📁 Project Structure

```
bandhannova-blogs/
├── app/                      # Next.js app directory
│   ├── admin/               # Admin panel pages
│   ├── blog/[slug]/         # Dynamic blog post pages
│   ├── api/                 # API routes
│   └── page.tsx             # Homepage
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── blog-card.tsx        # Blog card component
│   ├── blog-grid.tsx        # Blog grid layout
│   ├── blog-hero.tsx        # Hero section
│   └── image-cropper.tsx    # Image cropping component
├── lib/                     # Utility functions
│   ├── supabase/            # Supabase client & types
│   ├── ai-blog-generator.ts # AI content generation
│   └── blog-service.ts      # Blog CRUD operations
└── supabase/                # Database migrations
    └── migrations/          # SQL migration files
```

## 🎨 Design Features

- **Gradient Text Effects** - Beautiful gradient on hero section
- **Smooth Animations** - Fade-in, slide-up, and floating animations
- **Responsive Typography** - Auto-scaling text for all screen sizes
- **Blog Card Hover Effects** - Interactive cards with smooth transitions
- **Wave Dividers** - Elegant SVG wave separators
- **Grid Patterns** - Subtle background patterns

## 🚀 Key Functionalities

### Blog Generation
1. Enter topic and select category
2. AI generates SEO-optimized content with metadata
3. Upload and crop thumbnail image
4. Preview generated content
5. Publish directly to database

### Blog Management
- View all published blogs in admin panel
- Edit existing blog posts
- Delete blogs with confirmation
- Real-time updates across the platform

### User Experience
- Fast page loads with Next.js optimization
- Smooth scroll navigation
- Responsive images with Next.js Image component
- Accessible UI with proper ARIA labels
- SEO-friendly with proper meta tags

## 🔒 Security Features

- Two-factor authentication for admin access
- Secure session management with HTTP-only cookies
- Environment variable protection
- Input validation on all forms
- Protected API routes
- Row-level security in Supabase

## 📱 Responsive Breakpoints

- **Mobile:** 1 column grid, compact text
- **Small (sm):** 2 column grid, medium text
- **Large (lg):** 3 column grid, full-size text
- **Extra Large (xl):** Optimized spacing

## 🎯 Blog Categories

- Career Guide
- Study Guide
- AI & Technology
- Skills Development

## ✨ Special Features

### Image Cropper
- Fixed 16:9 aspect ratio for consistency
- Zoom and pan controls
- Real-time preview
- Optimized output for web

### AI Blog Generator
- SEO-optimized content
- Student-friendly language
- Auto-generated metadata (title, slug, excerpt, tags)
- Estimated read time calculation
- Markdown formatting

### Theme System
- Light mode (default)
- Dark mode
- Persistent theme preference
- Smooth transitions

## 🌐 Live Features

- **Homepage:** Dynamic blog listing with search and filters
- **Blog Posts:** Individual pages with full content and related posts
- **Admin Panel:** Secure dashboard for content management
- **Newsletter:** Email subscription section

## 📊 Performance

- Optimized images with Next.js Image
- Code splitting and lazy loading
- Minimal bundle size
- Fast Time to Interactive (TTI)
- Excellent Core Web Vitals

## 🎓 Target Audience

Indian students seeking guidance on:
- Career development
- Study techniques
- Technology trends
- Skill building
- Digital literacy

## 🤝 Contributing

This is a private project for BandhanNova AI Hub.

## 📄 License

© 2026 BandhanNova AI Hub. All rights reserved.

---

**Built with ❤️ by BandhanNova AI Hub**

Visit us at [bandhannova.in](https://www.bandhannova.in)
