/**
 * BandhanNova BFOBS Storage Client
 * Handles file uploads to BFOBS Storage Buckets (thumbnails, assets, videos, avatars)
 */

const BFOBS_URL = process.env.BFOBS_URL || 'https://lordbandhan07-bandhannova-api-hunter.hf.space';
const BFOBS_TOKEN = process.env.BFOBS_TOKEN;
const PRODUCT_SLUG = 'bandhannova-blogs';

// Bucket Names
export const BUCKETS = {
    THUMBNAILS: 'blogs-thumbnails',
    ASSETS: 'blog-assets',
} as const;

/**
 * Upload a file to a BFOBS Storage Bucket
 * @returns The public CDN URL for the uploaded file
 */
export async function uploadToStorage(file: File, bucket: string, customFileName?: string): Promise<string> {
    if (!BFOBS_TOKEN) {
        throw new Error('BFOBS_TOKEN is not defined');
    }

    // Generate unique filename to avoid collisions
    const ext = file.name.split('.').pop() || 'bin';
    const fileName = customFileName || `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const formData = new FormData();
    formData.append('file', file, fileName);

    const response = await fetch(`${BFOBS_URL}/storage/upload/${PRODUCT_SLUG}/${bucket}`, {
        method: 'POST',
        headers: {
            'X-BandhanNova-Token': BFOBS_TOKEN,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Upload failed: ${errorData}`);
    }

    // Return the public CDN URL
    return `${BFOBS_URL}/storage/view/${PRODUCT_SLUG}/${bucket}/${fileName}`;
}

/**
 * Upload a blog thumbnail
 */
export async function uploadThumbnail(file: File): Promise<string> {
    return uploadToStorage(file, BUCKETS.THUMBNAILS, `thumb-${Date.now()}.${file.name.split('.').pop()}`);
}

/**
 * Upload a writer avatar
 */
export async function uploadWriterAvatar(file: File): Promise<string> {
    return uploadToStorage(file, BUCKETS.ASSETS, `avatar-${Date.now()}.${file.name.split('.').pop()}`);
}

/**
 * Upload a brand ad video
 */
export async function uploadBrandVideo(file: File): Promise<string> {
    return uploadToStorage(file, BUCKETS.ASSETS, `brand-video-${Date.now()}.${file.name.split('.').pop()}`);
}

/**
 * Upload an affiliate product image
 */
export async function uploadProductImage(file: File): Promise<string> {
    return uploadToStorage(file, BUCKETS.ASSETS, `product-${Date.now()}.${file.name.split('.').pop()}`);
}

/**
 * Upload a general blog content image (for inline use in markdown)
 */
export async function uploadBlogImage(file: File): Promise<string> {
    return uploadToStorage(file, BUCKETS.ASSETS, `content-${Date.now()}.${file.name.split('.').pop()}`);
}
