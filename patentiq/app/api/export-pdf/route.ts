import { NextResponse } from 'next/server';
import { patentRepository } from '@/lib/repository';
import { generatePdfBuffer } from '@/lib/pdfGenerator';
import { ratelimit } from '@/lib/ratelimit';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    console.log('>>> [PDF API] Route Started');

    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get('queryId');
    console.log(`>>> [PDF API] Request for queryId: ${queryId}`);

    if (!queryId) {
        return NextResponse.json({ error: 'Missing queryId parameter' }, { status: 400 });
    }

    // 1. Rate Limit (Enforced)
    const limitRes = await ratelimit.checkWorkflow('anonymous_pdf_client');
    if (!limitRes.success) {
        console.warn(`[PDF API] Rate limit hit: ${limitRes.message}`);
        return NextResponse.json({ error: limitRes.message }, { status: 429 });
    }

    // Initialize Audit Workflow Log
    const logId = await logger.startWorkflow('anonymous_pdf_client', 'Export PDF Action');


    // 2. Fetch Data (with robust mock fallback)
    let record = null;
    try {
        console.log('>>> [PDF API] Attempting database fetch...');
        record = await patentRepository.getSearchById(queryId);
        console.log(`>>> [PDF API] Database fetch result: ${record ? 'Found' : 'Not Found'}`);
    } catch (dbError) {
        console.error('>>> [PDF API] Database fetch failed (critical auth/connection error):', dbError);
        console.log('>>> [PDF API] Proceeding to check for mock fallback...');
    }

    // 3. Mock Fallback
    if (!record) {
        if (queryId === 'mock-id') {
            console.log('>>> [PDF API] Loading MOCK DATA...');
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
                    similarity_analysis_summary: {
                        high: 1,
                        medium: 1,
                        low: 1
                    },
                    risk_assessment: 'High similarity detected with predictive maintenance patents. Potential infringement risk if core algorithms are not sufficiently distinct.',
                    recommendation: {
                        action: 'REFINE',
                        reason: 'Moderate to high similarity detected with existing patents regarding predictive maintenance and smart beverage controls.',
                        suggested_action: 'Refine core quantum brewing algorithms to differentiate the invention from traditional AI approaches.'
                    }
                }
            };
        } else {
            console.error('>>> [PDF API] Result not found and no mock available for this ID');
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }
    }

    // 4. Generate PDF
    try {
        console.log('>>> [PDF API] Calling generatePdfBuffer...');
        const pdfBuffer = await generatePdfBuffer(record);
        console.log('>>> [PDF API] PDF Buffer generated size:', pdfBuffer.length);

        console.log('>>> [PDF API] Sending Response...');

        await logger.logApiCall({
            workflowLogId: logId,
            service: 'App - PDF Generator',
            endpoint: '/api/export-pdf',
            requestParams: { queryId },
            responseStatus: 200,
            tokenUsage: 0
        });
        await logger.endWorkflow(logId, 'completed');

        return new NextResponse(pdfBuffer as unknown as BodyInit, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="patent-analysis-${queryId}.pdf"`,
            },
        });
    } catch (pdfError) {
        console.error('>>> [PDF API] PDF GENERATION FAILED:', pdfError);

        await logger.endWorkflow(logId, 'failed', pdfError instanceof Error ? pdfError.message : String(pdfError));

        return NextResponse.json({
            error: 'Failed to generate PDF',
            details: pdfError instanceof Error ? pdfError.message : String(pdfError)
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    console.log('>>> [PDF API] POST Route Started');

    try {
        const body = await request.json();
        console.log('>>> [PDF API] Received sandbox data');

        // 1. Rate Limit (Enforced)
        const limitRes = await ratelimit.checkWorkflow('anonymous_pdf_client');
        if (!limitRes.success) {
            console.warn(`[PDF API] Rate limit hit: ${limitRes.message}`);
            return NextResponse.json({ error: limitRes.message }, { status: 429 });
        }

        // Initialize Audit Workflow Log
        const logId = await logger.startWorkflow('anonymous_pdf_client', 'Export PDF Action (Sandbox)');

        // Transform sandbox data into record format
        const record = {
            title: body.title || 'Patent Strategy Analysis',
            query_text: body.query_text || body.title || 'Sandbox Analysis',
            analysis_results: {
                executive_summary: body.summary || 'This is a strategy sandbox analysis of a patent concept.',
                overview: body.overview || 'Sandbox configuration analysis',
                extracted_concepts: body.features?.map((f: any) => f.name) || [],
                patent_search_queries: [],
                overlapping_concepts: [],
                matches: body.matches || [],
                similarity_analysis_summary: {
                    high: 0,
                    medium: 0,
                    low: 0
                },
                risk_assessment: body.riskAssessment || 'Risk assessment pending.',
                recommendation: {
                    action: 'PROCEED',
                    reason: 'Sandbox analysis completed.',
                    suggested_action: 'Review configuration and refine as needed.'
                }
            }
        };

        // 2. Generate PDF
        console.log('>>> [PDF API] Calling generatePdfBuffer...');
        const pdfBuffer = await generatePdfBuffer(record);
        console.log('>>> [PDF API] PDF Buffer generated size:', pdfBuffer.length);

        await logger.logApiCall({
            workflowLogId: logId,
            service: 'App - PDF Generator',
            endpoint: '/api/export-pdf',
            requestParams: { source: 'sandbox' },
            responseStatus: 200,
            tokenUsage: 0
        });
        await logger.endWorkflow(logId, 'completed');

        return new NextResponse(pdfBuffer as unknown as BodyInit, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="patent-strategy-${Date.now()}.pdf"`,
            },
        });
    } catch (error) {
        console.error('>>> [PDF API] Error:', error);
        return NextResponse.json({
            error: 'Failed to generate PDF',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
