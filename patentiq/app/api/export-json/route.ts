import { NextResponse } from 'next/server';
import { patentRepository } from '@/lib/database/repository';
import { ratelimit } from '@/lib/infra/ratelimit';
import { logger } from '@/lib/infra/logger';
import { encryptData } from '@/lib/infra/encryption';

export const dynamic = 'force-dynamic';

async function handleExport(record: any, identifier: string, skipRateLimit: boolean = false) {
    if (!skipRateLimit) {
        const limitRes = await ratelimit.checkWorkflow('anonymous_json_client');
        if (!limitRes.success) {
            console.warn(`[JSON API] Rate limit hit: ${limitRes.message}`);
            return NextResponse.json({ error: limitRes.message }, { status: 429 });
        }
    }

    const logId = await logger.startWorkflow('anonymous_json_client', 'Export JSON Action');

    await logger.logApiCall({
        workflowLogId: logId,
        service: 'App - JSON Generator',
        endpoint: '/api/export-json',
        requestParams: { identifier },
        responseStatus: 200,
        tokenUsage: 0
    });
    await logger.endWorkflow(logId, 'completed');

    // Encrypt the analysis data
    console.log('[JSON Export] Encrypting export data...');
    const { success, encrypted } = await encryptData(record);

    if (success) {
        console.log('[JSON Export] Export data encrypted successfully');
        // Return both encrypted (for storage) and plaintext (for download)
        const exportContent = {
            encrypted: encrypted,
            plaintext: record,
            exportedAt: new Date().toISOString(),
        };

        return new NextResponse(JSON.stringify(exportContent, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="patent-analysis-${identifier}.json"`,
                'X-Encrypted': 'true',
            },
        });
    } else {
        console.warn('[JSON Export] Encryption failed, returning plaintext');
        return new NextResponse(JSON.stringify(record, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="patent-analysis-${identifier}.json"`,
            },
        });
    }
}

export async function POST(request: Request) {
    console.log('>>> [JSON API] POST Route Started');

    try {
        const body = await request.json();
        const { data } = body;

        if (!data || !data.analysis_results) {
            return NextResponse.json({ error: 'Missing analysis data in request body' }, { status: 400 });
        }

        console.log('>>> [JSON API] Using provided analysis data');
        return handleExport(data, 'sandbox-export', true); // skipRateLimit for sandbox
    } catch (error) {
        console.error('>>> [JSON API] Error parsing request:', error);
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get('queryId');

    if (!queryId) {
        return NextResponse.json({ error: 'Missing queryId parameter' }, { status: 400 });
    }

    let record = null;
    try {
        record = await patentRepository.getSearchById(queryId);
    } catch (dbError) { }

    if (!record) {
        if (queryId === 'mock-id') {
            record = {
                title: 'AI Powered Quantum Coffee Maker',
                query_text: 'A novel device combining quantum algorithms to brew coffee perfectly.',
                analysis_results: {
                    executive_summary: 'This report evaluates the patent landscape for an AI-powered quantum brewing device. The analysis found moderate similarity with existing predictive maintenance and smart beverage systems. Proceeding with refinement is advised.',
                    patent_search_queries: [
                        '("quantum algorithm" OR "quantum computing") AND ("coffee" OR "brewing device")',
                        '"AI optimization" AND "predictive maintenance" AND "beverage"'
                    ],
                    overview: 'Predictive maintenance system using sensor data and AI-based anomaly detection.',
                    extracted_concepts: ['Quantum brewing', 'AI Optimization', 'Beverage', 'Predictive Maintenance'],
                    overlapping_concepts: ['predictive maintenance', 'sensor data monitoring', 'equipment health analysis'],
                    matches: [
                        { patent_id: 'US 10,456,221', title: 'Predictive Maintenance System', status: 'Granted', filing_date: '2018-05-12', similarity_score: 82 },
                        { patent_id: 'US 11,234,567', title: 'AI Driven Beverage Quality Control', status: 'Pending', filing_date: '2021-08-20', similarity_score: 75 },
                        { patent_id: 'US 9,876,543', title: 'Smart Coffee Machine IoT', status: 'Granted', filing_date: '2015-11-02', similarity_score: 45 }
                    ],
                    similarity_analysis_summary: { high: 1, medium: 1, low: 1 },
                    risk_assessment: 'High similarity detected with predictive maintenance patents. Potential infringement risk if core algorithms are not sufficiently distinct.',
                    recommendation: {
                        action: 'REFINE',
                        reason: 'Moderate to high similarity detected with existing patents regarding predictive maintenance and smart beverage controls.',
                        suggested_action: 'Refine core quantum brewing algorithms to differentiate the invention from traditional AI approaches.'
                    }
                }
            };
        } else {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }
    }

    return handleExport(record, queryId);
}
