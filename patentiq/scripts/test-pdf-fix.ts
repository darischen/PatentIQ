import { generatePdfBuffer } from '../lib/pdfGenerator';
import path from 'path';

async function testPdfFix() {
    console.log('--- Testing PDF Export Fix ---');
    
    const mockSearchRecord = {
        title: 'Mock Invention Title',
        query_text: 'This is a mock invention description for testing purposes.',
        analysis_results: {
            executive_summary: 'This is a mock executive summary.',
            overview: 'This is a mock overview.',
            extracted_concepts: ['Concept 1', 'Concept 2'],
            patent_search_queries: ['Query 1', 'Query 2'],
            matches: [
                { patent_id: 'US1234567', title: 'Match 1', similarity_score: 85, status: 'Active' },
                { patent_id: 'US7654321', title: 'Match 2', similarity_score: 70, status: 'Pending' }
            ],
            similarity_analysis_summary: { high: 1, medium: 1, low: 0 },
            risk_assessment: 'Low risk identified.',
            recommendations: 'Proceed with caution.'
        }
    };

    try {
        console.log('Generating PDF buffer...');
        const buffer = await generatePdfBuffer(mockSearchRecord);
        console.log('✅ Success! PDF buffer generated. Length:', buffer.length);
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed to generate PDF:', err);
        process.exit(1);
    }
}

testPdfFix();
