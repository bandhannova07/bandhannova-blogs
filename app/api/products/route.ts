import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, upsertProduct } from '@/lib/product-service';

export async function GET() {
    try {
        const products = await getAllProducts();
        return NextResponse.json({ success: true, products });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const product = await upsertProduct(data);
        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
