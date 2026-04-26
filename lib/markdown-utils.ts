import { marked } from 'marked';
import hljs from 'highlight.js';

// Configure marked with a custom renderer using the modern .use() API
marked.use({
    renderer: {
        // Custom Code Block Renderer for High Level Look
        code({ text, lang }) {
            const validLanguage = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
            const highlightedCode = hljs.highlight(text, { language: validLanguage }).value;

            // Safe Base64 for Unicode (Bengali)
            const base64Code = Buffer.from(text, 'utf-8').toString('base64');

            return `
            <div class="premium-code-block group my-16 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-[#0d1117] transition-all duration-500 hover:shadow-primary/10">
                <div class="code-header flex items-center justify-between px-10 py-5 bg-[#161b22] border-b border-white/5">
                    <div class="flex items-center gap-3">
                        <div class="flex gap-1.5">
                            <div class="w-3 h-3 rounded-full bg-[#ff5f56] opacity-80"></div>
                            <div class="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-80"></div>
                            <div class="w-3 h-3 rounded-full bg-[#27c93f] opacity-80"></div>
                        </div>
                        <span class="text-[10px] font-mono text-white/40 font-black uppercase tracking-[0.3em] ml-6">${validLanguage}</span>
                    </div>
                    <button 
                        class="copy-button px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-primary/20 text-white/40 hover:text-primary transition-all duration-300 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border border-white/5 group/btn"
                        onclick="copyToClipboard(this, '${base64Code}')"
                    >
                        <span class="copy-text">Copy Code</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </button>
                </div>
                <div class="relative overflow-x-auto p-10 font-mono text-sm md:text-base leading-relaxed text-[#e6edf3]">
                    <pre><code class="hljs language-${validLanguage}">${highlightedCode}</code></pre>
                </div>
            </div>
            `;
        },

        // Custom Blockquote Renderer for Callouts (GitHub style)
        blockquote({ tokens }) {
            const text = this.parser.parse(tokens).trim();
            const match = text.match(/^<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);

            if (match) {
                const type = match[1].toUpperCase();
                const content = text.replace(/^<p>\[!.*?\]\s*/i, '<p>');
                
                // Icon Mapping
                const icons: Record<string, string> = {
                    NOTE: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
                    TIP: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.7.7 1.3 1.5 1.5 2.4"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
                    IMPORTANT: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500"><path d="M12 2v20"/><path d="m4.93 4.93 14.14 14.14"/><path d="M2 12h20"/><path d="m19.07 4.93-14.14 14.14"/></svg>',
                    WARNING: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
                    CAUTION: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><path d="M12 9v4"/><path d="m12.839 2.132-1.678-.839a2 2 0 0 0-1.79 0l-6.983 3.491A2 2 0 0 0 1.25 6.574V21a2 2 0 0 0 2 2h17.5a2 2 0 0 0 2-2V6.574a2 2 0 0 0-1.139-1.79l-6.983-3.491a2 2 0 0 0-1.79 0Z"/><path d="M12 17h.01"/></svg>'
                };

                return `
                <div class="premium-callout callout-${type.toLowerCase()} my-12 p-8 rounded-[2rem] border-l-8 transition-all duration-500 hover:scale-[1.01] bg-white/5 dark:bg-white/5 backdrop-blur-xl border-white/10 shadow-lg relative overflow-hidden group">
                    <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div class="flex items-start gap-6 relative z-10">
                        <div class="callout-icon-container p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                            ${icons[type] || ''}
                        </div>
                        <div class="callout-content flex-1">
                            <div class="callout-label font-black text-[10px] uppercase tracking-[0.3em] mb-3 opacity-60">${type}</div>
                            <div class="callout-body prose prose-sm md:prose-base dark:prose-invert font-medium leading-relaxed">${content}</div>
                        </div>
                    </div>
                </div>
                `;
            }

            return `<blockquote class="border-l-4 border-primary/30 pl-6 my-8 italic text-muted-foreground/90 bg-primary/5 py-4 rounded-r-xl">${text}</blockquote>`;
        },

        // Custom Link Renderer for "High Level" look
        link({ href, title, text }) {
            return `<a href="${href}" title="${title || ''}" class="premium-link relative inline-block font-bold text-primary group">
                <span class="relative z-10">${text}</span>
                <span class="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>`;
        },

        // Custom Image Renderer for auto-captioning and glassmorphism
        image({ href, title, text }) {
            return `
            <figure class="my-12 overflow-hidden rounded-3xl border border-white/10 shadow-2xl group">
                <div class="relative overflow-hidden">
                    <img src="${href}" alt="${text}" title="${title || ''}" class="w-full h-auto transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                ${text ? `<figcaption class="p-6 text-center text-sm font-medium text-muted-foreground italic bg-background/80 backdrop-blur-md border-t border-white/5 uppercase tracking-wide">
                    ${text}
                </figcaption>` : ''}
            </figure>
            `;
        }
    }
});

marked.setOptions({
    breaks: true,
    gfm: true,
});

export function markdownToHtml(markdown: string): string {
    if (!markdown) return '';
    
    // Fix literal \n strings that might come from DB
    const processedMarkdown = markdown.replace(/\\n/g, '\n');
    
    try {
        return marked.parse(processedMarkdown) as string;
    } catch (error: any) {
        console.error('Error parsing markdown:', error);
        // Fallback to plain text if parsing fails
        return `<p>${processedMarkdown}</p>`;
    }
}
