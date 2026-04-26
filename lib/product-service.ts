import { executeQuery } from './bfobs';
import { setCache, getCache, deleteCache } from './redis';

// Product Interface
export interface Product {
    id: string;
    type: 'affiliate' | 'brand';
    title: string;
    thumbnail?: string;
    link?: string;
    video_url?: string;
    cta_text?: string;
    cta_link?: string;
    created_at?: string;
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
    try {
        const results = await executeQuery('SELECT * FROM products ORDER BY created_at DESC');
        return results as any as Product[];
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
}

// Create or update product
export async function upsertProduct(product: Partial<Product>): Promise<Product> {
    const id = product.id || Math.random().toString(36).substring(7);
    
    // Check if exists
    const existing = await executeQuery('SELECT id FROM products WHERE id = ?', [id]);
    
    if (existing.length > 0) {
        // Update
        const updates: string[] = [];
        const params: any[] = [];
        Object.entries(product).forEach(([key, value]) => {
            if (key === 'id') return;
            updates.push(`${key} = ?`);
            params.push(value);
        });
        params.push(id);
        await executeQuery(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, params);
    } else {
        // Insert
        const keys = Object.keys(product).join(', ');
        const placeholders = Object.keys(product).map(() => '?').join(', ');
        const params = Object.values(product);
        await executeQuery(`INSERT INTO products (${keys}) VALUES (${placeholders})`, params);
    }
    
    const results = await executeQuery('SELECT * FROM products WHERE id = ?', [id]);
    return (results[0] as any) as Product;
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
    await executeQuery('DELETE FROM products WHERE id = ?', [id]);
}
