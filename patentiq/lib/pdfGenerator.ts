const PdfPrinter = require('pdfmake/js/Printer').default;
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import path from 'path';

export async function generatePdfBuffer(searchRecord: any): Promise<Buffer> {
    console.log('[PDF Generator] Starting PDF generation...');

    // Resolve font paths from node_modules
    const fontPath = path.join(process.cwd(), 'node_modules', 'pdfmake', 'fonts', 'Roboto');

    const fontDescriptors = {
        Roboto: {
            normal: path.join(fontPath, 'Roboto-Regular.ttf'),
            bold: path.join(fontPath, 'Roboto-Medium.ttf'),
            italics: path.join(fontPath, 'Roboto-Italic.ttf'),
            bolditalics: path.join(fontPath, 'Roboto-MediumItalic.ttf')
        }
    };

    const printer = new PdfPrinter(fontDescriptors);

    const { query_text, analysis_results } = searchRecord;

    const title = searchRecord?.title || analysis_results?.title || 'Untitled Invention';
    const overview = analysis_results?.overview || 'No overview available.';
    const executiveSummary = analysis_results?.executive_summary || 'No executive summary provided.';
    const searchQueries = analysis_results?.patent_search_queries || [];
    const matches = analysis_results?.matches || [];
    const similaritySummary = analysis_results?.similarity_analysis_summary || { high: 0, medium: 0, low: 0 };
    const riskAssessment = analysis_results?.risk_assessment || 'No risk assessment provided.';
    const recommendation = analysis_results?.recommendation;
    const oldRecommendations = analysis_results?.recommendations; // Fallback
    const extractedConcepts = analysis_results?.extracted_concepts || [];

    const docDefinition: TDocumentDefinitions = {
        defaultStyle: {
            font: 'Roboto'
        },
        content: [
            { text: 'Structured Research Report', style: 'header' },

            { text: '1. Executive Summary', style: 'subheader' },
            { text: executiveSummary, margin: [0, 0, 0, 20] },

            { text: '2. Invention Description', style: 'subheader' },
            { text: `Title: ${title}`, style: 'matchTitle' as any, margin: [0, 0, 0, 5] as any },
            { text: query_text, margin: [0, 0, 0, 5] },
            { text: overview, margin: [0, 0, 0, 20] },

            { text: '3. Key Concepts Extracted', style: 'subheader' },
            {
                ul: extractedConcepts.length > 0 ? extractedConcepts : ['No concepts extracted'],
                margin: [0, 0, 0, 20] as any
            },

            { text: '4. Patent Search Queries', style: 'subheader' },
            {
                ul: searchQueries.length > 0 ? searchQueries : ['No search queries recorded'],
                margin: [0, 0, 0, 20] as any
            },

            { text: '5. Relevant Patent Results', style: 'subheader' },
            ...(matches.length > 0 ? matches.map((match: any) => {
                const matchBlock: any[] = [
                    {
                        text: `Patent ID: ${match.patent_id || 'Unknown ID'}`,
                        style: 'matchTitle',
                        margin: [0, 10, 0, 5]
                    },
                    {
                        text: `Title: ${match.title || 'N/A'}\nStatus: ${match.status || 'N/A'}\nSimilarity Score: ${match.similarity_score ? match.similarity_score + '%' : 'N/A'}`,
                        margin: [0, 0, 0, 10] as any
                    }
                ];
                return matchBlock;
            }).flat() : [{ text: 'No matches found.', margin: [0, 0, 0, 20] as any }]),

            { text: '6. Similarity Analysis Summary', style: 'subheader', margin: [0, 10, 0, 10] as any },
            {
                text: `High Similarity Patents: ${similaritySummary.high || 0}\nMedium Similarity Patents: ${similaritySummary.medium || 0}\nLow Similarity Patents: ${similaritySummary.low || 0}`,
                margin: [0, 0, 0, 20] as any
            },

            { text: '7. Risk Assessment', style: 'subheader' },
            { text: riskAssessment, margin: [0, 0, 0, 20] },

            { text: '8. Recommendation', style: 'subheader' },
            ...(recommendation ? [
                { text: `Recommendation: ${recommendation.action || 'Unknown'}`, style: 'matchTitle' as any, margin: [0, 0, 0, 5] as any },
                { text: 'Reason:', bold: true, margin: [0, 5, 0, 2] as any },
                { text: recommendation.reason || 'N/A', margin: [0, 0, 0, 5] as any },
                { text: 'Suggested Action:', bold: true, margin: [0, 5, 0, 2] as any },
                { text: recommendation.suggested_action || 'N/A', margin: [0, 0, 0, 20] as any }
            ] : [
                { text: oldRecommendations || 'No recommendation provided.', margin: [0, 0, 0, 20] }
            ])
        ],
        styles: {
            header: {
                fontSize: 22,
                bold: true,
                marginBottom: 20
            },
            subheader: {
                fontSize: 16,
                bold: true,
                marginBottom: 10
            },
            matchTitle: {
                fontSize: 14,
                bold: true
            }
        }
    };

    return new Promise(async (resolve, reject) => {
        try {
            console.log('[PDF Generator] Creating PDF document...');
            const pdfDoc = await printer.createPdfKitDocument(docDefinition);
            const chunks: Buffer[] = [];

            pdfDoc.on('data', (chunk: any) => chunks.push(chunk));
            pdfDoc.on('end', () => {
                console.log('[PDF Generator] PDF generation successful.');
                resolve(Buffer.concat(chunks));
            });
            pdfDoc.on('error', (err: any) => {
                console.error('[PDF Generator] PDF document error:', err);
                reject(err);
            });

            pdfDoc.end();
        } catch (err) {
            console.error('[PDF Generator] Catch block error:', err);
            reject(err);
        }
    });
}
