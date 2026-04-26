import { createClient } from '@libsql/client';

/**
 * BandhanNova Database Client (Direct Turso Integration)
 * Previously this was a proxy to BFOBS, now it connects directly to Turso
 * to ensure maximum stability and performance.
 */

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
    console.error('TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing in .env.local');
}

const client = createClient({
    url: url || '',
    authToken: authToken || '',
});

export async function executeQuery(query: string, params: any[] = []) {
    try {
        const result = await client.execute({
            sql: query,
            args: params
        });
        return result.rows;
    } catch (error) {
        console.error('Turso Execution Error:', error);
        throw error;
    }
}

export async function executeTransaction(queries: { query: string, params?: any[] }[]) {
    try {
        const transaction = await client.transaction("write");
        const results = [];
        for (const q of queries) {
            results.push(await transaction.execute({
                sql: q.query,
                args: q.params || []
            }));
        }
        await transaction.commit();
        return results.map(r => r.rows);
    } catch (error) {
        console.error('Turso Transaction Error:', error);
        throw error;
    }
}
