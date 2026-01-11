# AdSense Integration Guide for BandhanNova Blogs

## 📋 Overview

This guide will help you integrate Google AdSense ads into your blog posts for monetization while maintaining a great user experience.

---

## 🚀 Getting Started

### Step 1: Get AdSense Approval

1. **Apply for AdSense:**
   - Go to [google.com/adsense](https://www.google.com/adsense)
   - Sign up with your Google account
   - Add your website URL
   - Wait for approval (usually 1-2 weeks)

2. **Requirements:**
   - Original, high-quality content
   - Minimum 20-30 blog posts
   - Privacy Policy page
   - About page
   - Contact page
   - Regular traffic (recommended 100+ daily visitors)

---

## 📍 Ad Placement Strategy

### Recommended Ad Positions

1. **Above the Fold** (Top of blog post)
   - Display ad (728x90 or 970x90)
   - Best for visibility

2. **In-Article Ads** (Between paragraphs)
   - Native ads that blend with content
   - Place after 2-3 paragraphs
   - Maximum 3 per article

3. **Sidebar Ads** (Desktop only)
   - Sticky sidebar (300x600)
   - Follows user scroll

4. **Below Content** (End of article)
   - Multiplex ad unit
   - Related content ads

---

## 💻 Implementation Code

### 1. Add AdSense Script to Layout

Update `app/layout.tsx`:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 2. Create Ad Component

Create `components/adsense-ad.tsx`:

```tsx
"use client";

import { useEffect } from "react";

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
}

export function AdSenseAd({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: "block" },
}: AdSenseAdProps) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive.toString()}
    />
  );
}
```

### 3. Add Ads to Blog Post Page

Update `app/blog/[slug]/page.tsx`:

```tsx
import { AdSenseAd } from "@/components/adsense-ad";

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // ... existing code ...

  return (
    <main className="min-h-screen">
      {/* Top Ad */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <AdSenseAd adSlot="1234567890" />
      </div>

      {/* Blog Content */}
      <article className="py-12 md:py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Content here */}
          
          {/* Mid-Article Ad */}
          <div className="my-8">
            <AdSenseAd 
              adSlot="0987654321"
              adFormat="fluid"
            />
          </div>

          {/* More content */}
        </div>
      </article>

      {/* Bottom Ad */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <AdSenseAd adSlot="1122334455" />
      </div>
    </main>
  );
}
```

---

## 🎨 Styling Ads

### Make Ads Blend with Your Design

```css
/* app/globals.css */

.adsbygoogle {
  border-radius: 0.5rem;
  padding: 1rem;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
}

/* Mobile responsive */
@media (max-width: 768px) {
  .adsbygoogle {
    padding: 0.5rem;
  }
}
```

---

## 📱 Mobile Optimization

### Responsive Ad Sizes

```tsx
// Mobile-friendly ad component
export function ResponsiveAd({ adSlot }: { adSlot: string }) {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <AdSenseAd
        adSlot={adSlot}
        adFormat="auto"
        fullWidthResponsive={true}
        style={{
          display: "block",
          minHeight: "100px",
        }}
      />
    </div>
  );
}
```

---

## ⚠️ Best Practices

### DO's ✅

- **Place ads naturally** - Don't interrupt reading flow
- **Use responsive ads** - Works on all devices
- **Limit ad density** - Maximum 3 ads per 1000 words
- **Test on mobile** - Ensure good mobile UX
- **Monitor performance** - Check AdSense dashboard regularly

### DON'Ts ❌

- **Don't click your own ads** - Violates AdSense policy
- **Don't place too many ads** - Hurts user experience
- **Don't use misleading labels** - Like "Click here"
- **Don't place ads on error pages** - Against policy
- **Don't modify ad code** - Use as provided by Google

---

## 📊 Ad Performance Tips

1. **A/B Testing:**
   - Test different ad positions
   - Try various ad sizes
   - Monitor click-through rates (CTR)

2. **Content Quality:**
   - Write longer articles (1500+ words)
   - Use engaging headlines
   - Add relevant images

3. **Traffic Sources:**
   - Focus on organic search traffic
   - Build email list
   - Share on social media

---

## 🔒 Compliance

### Required Pages

1. **Privacy Policy** - Must mention AdSense
2. **Terms of Service** - User agreement
3. **Cookie Consent** - GDPR compliance (for EU visitors)

### Privacy Policy Template

```markdown
## Advertising

This site uses Google AdSense to display advertisements. Google uses cookies to serve ads based on your prior visits to this website or other websites. You can opt out of personalized advertising by visiting [Ads Settings](https://www.google.com/settings/ads).
```

---

## 🐛 Troubleshooting

### Ads Not Showing?

1. **Check AdSense approval status**
2. **Verify ad code is correct**
3. **Disable ad blockers**
4. **Check browser console for errors**
5. **Wait 24-48 hours after adding code**

### Low Revenue?

1. **Improve content quality**
2. **Increase traffic**
3. **Optimize ad placement**
4. **Target high-CPC keywords**
5. **Enable auto ads**

---

## 📈 Monitoring Performance

### Key Metrics to Track

- **Page RPM** (Revenue per 1000 impressions)
- **CTR** (Click-through rate)
- **CPC** (Cost per click)
- **Impressions**
- **Earnings**

### Access Reports

1. Go to [AdSense Dashboard](https://www.google.com/adsense)
2. Click "Reports"
3. View performance metrics
4. Analyze trends

---

## 🎯 Next Steps

1. ✅ Get AdSense approval
2. ✅ Add AdSense script to layout
3. ✅ Create ad component
4. ✅ Place ads strategically in blog posts
5. ✅ Test on mobile and desktop
6. ✅ Monitor performance
7. ✅ Optimize based on data

---

## 📞 Support

- **AdSense Help:** [support.google.com/adsense](https://support.google.com/adsense)
- **Policy Center:** [support.google.com/adsense/answer/48182](https://support.google.com/adsense/answer/48182)
- **Community Forum:** [support.google.com/adsense/community](https://support.google.com/adsense/community)

---

**Good luck with monetization! 🚀**

*Remember: Quality content + Good UX = Better ad revenue*
