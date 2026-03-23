import { NextResponse } from 'next/server';
import { db } from '@/lib/database/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // In a real production app, enforce admin authentication here
    // e.g. check for a specific admin header or session token

    console.log('>>> [Admin API] Fetching Logs');

    try {
        const url = new URL(request.url);
        const limitParam = url.searchParams.get('limit') || '50';
        const limit = parseInt(limitParam, 10);

        // Fetch recent workflows
        const workflowQuery = `
            SELECT id, user_id, workflow_name, status, start_time, end_time, error_message
            FROM workflow_logs
            ORDER BY start_time DESC
            LIMIT $1;
        `;
        const workflowResult = await db.query(workflowQuery, [limit]);

        // For simplicity, we just fetch recent API/LLM logs as well
        const apiQuery = `
            SELECT id, workflow_log_id, service, endpoint, request_params, response_status, token_usage, error_message, created_at
            FROM api_llm_logs
            ORDER BY created_at DESC
            LIMIT $1;
        `;
        const apiResult = await db.query(apiQuery, [limit]);

        return NextResponse.json({
            workflows: workflowResult.rows,
            api_calls: apiResult.rows
        }, { status: 200 });

    } catch (error: any) {
        console.error('>>> [Admin API] Failed to fetch logs:', error);
        return NextResponse.json({
            error: 'Failed to fetch audit logs',
            details: error.message
        }, { status: 500 });
    }
}
