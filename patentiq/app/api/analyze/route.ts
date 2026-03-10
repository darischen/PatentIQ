import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { ratelimit, throttleCall } from '@/lib/ratelimit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    let body;
    try {
        body = await request.json();
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const userId = body.userId || 'anonymous_user';
    const query = body.query || 'Default test query';

    // 1. Check strict Workflow Rate Limit
    const wfLimit = await ratelimit.checkWorkflow(userId);
    if (!wfLimit.success) {
        return NextResponse.json({ error: wfLimit.message }, { status: 429 });
    }

    // Start Workflow Logging
    const logId = await logger.startWorkflow(userId, 'Patent Analysis Simulation');

    try {
        // Step 1: Extract concepts (LLM) - THROTTLED
        await throttleCall(() => ratelimit.checkLLM(userId), async () => {
            // Simulate 500ms LLM processing
            await new Promise(r => setTimeout(r, 500));
            await logger.logApiCall({
                workflowLogId: logId,
                service: 'LLM - Concept Extraction',
                endpoint: 'openai.com/v1/chat/completions',
                requestParams: { model: 'gpt-4o', prompt_length: query.length },
                responseStatus: 200,
                tokenUsage: 120
            });
        });

        // Step 2: Query Generation (LLM) - THROTTLED
        await throttleCall(() => ratelimit.checkLLM(userId), async () => {
            await new Promise(r => setTimeout(r, 300));
            await logger.logApiCall({
                workflowLogId: logId,
                service: 'LLM - Query Generator',
                endpoint: 'openai.com/v1/chat/completions',
                requestParams: { model: 'gpt-4o', prompt_length: 50 },
                responseStatus: 200,
                tokenUsage: 80
            });
        });

        // Step 3: USPTO Search (API) - THROTTLED
        await throttleCall(() => ratelimit.checkUSPTO(), async () => {
            await new Promise(r => setTimeout(r, 800));
            await logger.logApiCall({
                workflowLogId: logId,
                service: 'USPTO',
                endpoint: '/api/v1/patent/search',
                requestParams: { query: 'simulated_query' },
                responseStatus: 200,
                tokenUsage: 0
            });
        });

        // Step 4: Similarity Scoring (LLM) - THROTTLED
        await throttleCall(() => ratelimit.checkLLM(userId), async () => {
            await new Promise(r => setTimeout(r, 600));
            await logger.logApiCall({
                workflowLogId: logId,
                service: 'LLM - Similarity Scoring',
                endpoint: 'openai.com/v1/chat/completions',
                requestParams: { patents_analyzed: 3 },
                responseStatus: 200,
                tokenUsage: 450
            });
        });

        // Step 5: Recommendation Logic (LLM) - THROTTLED
        await throttleCall(() => ratelimit.checkLLM(userId), async () => {
            await new Promise(r => setTimeout(r, 400));
            await logger.logApiCall({
                workflowLogId: logId,
                service: 'LLM - Recommendation',
                endpoint: 'openai.com/v1/chat/completions',
                requestParams: { scope: 'final_review' },
                responseStatus: 200,
                tokenUsage: 200
            });
        });

        // End Workflow normally
        await logger.endWorkflow(logId, 'completed');

        return NextResponse.json({
            success: true,
            logId,
            message: 'Workflow completed and logged successfully.'
        }, { status: 200 });

    } catch (error: any) {
        await logger.endWorkflow(logId, 'failed', error.message || 'Unknown error');
        return NextResponse.json({
            error: 'Workflow aborted.',
            details: error.message
        }, { status: 500 });
    }
}
