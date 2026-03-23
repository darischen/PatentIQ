import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export async function generateDocxBuffer(searchRecord: any): Promise<Buffer> {
    console.log('[DOCX Generator] Starting DOCX generation...');

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

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: 'Structured Research Report',
                    heading: HeadingLevel.TITLE,
                    spacing: { after: 400 },
                }),

                // 1. Executive Summary
                new Paragraph({ text: '1. Executive Summary', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 100 } }),
                new Paragraph({ text: executiveSummary, spacing: { after: 200 } }),

                // 2. Invention Description
                new Paragraph({ text: '2. Invention Description', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 100 } }),
                new Paragraph({
                    children: [new TextRun({ text: `Title: ${title}`, bold: true })],
                    spacing: { after: 100 }
                }),
                new Paragraph({ text: query_text, spacing: { after: 100 } }),
                new Paragraph({ text: overview, spacing: { after: 200 } }),

                // 3. Key Concepts Extracted
                new Paragraph({ text: '3. Key Concepts Extracted', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 100 } }),
                ...(extractedConcepts.length > 0 ? extractedConcepts.map((concept: string) => new Paragraph({ text: concept, bullet: { level: 0 } })) : [new Paragraph({ text: 'No concepts extracted' })]),
                new Paragraph({ text: '', spacing: { after: 200 } }),

                // 4. Patent Search Queries
                new Paragraph({ text: '4. Patent Search Queries', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 100 } }),
                ...(searchQueries.length > 0 ? searchQueries.map((query: string) => new Paragraph({ text: query, bullet: { level: 0 } })) : [new Paragraph({ text: 'No search queries recorded' })]),
                new Paragraph({ text: '', spacing: { after: 200 } }),

                // 5. Relevant Patent Results
                new Paragraph({ text: '5. Relevant Patent Results', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 100 } }),
                ...(matches.length > 0 ? matches.map((match: any) => [
                    new Paragraph({
                        children: [new TextRun({ text: `Patent ID: ${match.patent_id || 'Unknown ID'}`, bold: true })],
                        spacing: { before: 100, after: 50 }
                    }),
                    new Paragraph({ text: `Title: ${match.title || 'N/A'}` }),
                    new Paragraph({ text: `Status: ${match.status || 'N/A'}` }),
                    new Paragraph({ text: `Similarity Score: ${match.similarity_score ? match.similarity_score + '%' : 'N/A'}` }),
                    new Paragraph({ text: '', spacing: { after: 100 } }),
                ]).flat() : [new Paragraph({ text: 'No matches found.', spacing: { after: 200 } })]),

                // 6. Similarity Analysis Summary
                new Paragraph({ text: '6. Similarity Analysis Summary', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 100 } }),
                new Paragraph({ text: `High Similarity Patents: ${similaritySummary.high || 0}` }),
                new Paragraph({ text: `Medium Similarity Patents: ${similaritySummary.medium || 0}` }),
                new Paragraph({ text: `Low Similarity Patents: ${similaritySummary.low || 0}`, spacing: { after: 200 } }),

                // 7. Risk Assessment
                new Paragraph({ text: '7. Risk Assessment', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 100 } }),
                new Paragraph({ text: riskAssessment, spacing: { after: 200 } }),

                // 8. Recommendation
                new Paragraph({ text: '8. Recommendation', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 100 } }),
                ...(recommendation ? [
                    new Paragraph({
                        children: [new TextRun({ text: `Recommendation: ${recommendation.action || 'Unknown'}`, bold: true })],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({ children: [new TextRun({ text: 'Reason:', bold: true })] }),
                    new Paragraph({ text: recommendation.reason || 'N/A', spacing: { after: 100 } }),
                    new Paragraph({ children: [new TextRun({ text: 'Suggested Action:', bold: true })] }),
                    new Paragraph({ text: recommendation.suggested_action || 'N/A', spacing: { after: 200 } }),
                ] : [
                    new Paragraph({ text: oldRecommendations || 'No recommendation provided.', spacing: { after: 200 } })
                ])
            ],
        }],
    });

    console.log('[DOCX Generator] Creating buffer...');
    const buffer = await Packer.toBuffer(doc);
    console.log('[DOCX Generator] DOCX generation successful.');
    return buffer;
}
