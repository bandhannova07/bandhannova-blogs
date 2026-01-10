import { marked } from 'marked';

// Configure marked for better HTML output
marked.setOptions({
    breaks: true,
    gfm: true,
});

export function markdownToHtml(markdown: string): string {
    return marked(markdown) as string;
}
