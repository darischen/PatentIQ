import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { jsPDF } from 'jspdf';
import type { AnalysisResult } from '@/lib/types/project';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { analysisData, projectName } = await req.json() as { analysisData: AnalysisResult; projectName: string };

    if (!analysisData) {
      return NextResponse.json(
        { error: 'No analysis data provided' },
        { status: 400 }
      );
    }

    console.log('[Novelty Audit] Generating report for:', projectName);

    const prompt = `Generate a comprehensive Novelty Audit report for a patent application. Use this analysis data:

Project: ${projectName}
Novelty Score: ${analysisData.noveltyScore}%
Features Analyzed: ${analysisData.features.length}
Similar Patents Found: ${analysisData.similarPatents}
Confidence: ${analysisData.confidence}%

Features:
${analysisData.features.map((f) => `- ${f.name}: Status=${f.status}, Novelty=${f.noveltyScore || 'N/A'}`).join('\n')}

Top Risk Feature: ${analysisData.topRiskFeature}
Closest Prior Art: ${analysisData.closestPriorArt}

Generate a detailed, professional novelty audit report that includes:
1. Executive Summary (2-3 sentences)
2. Feature-by-Feature Novelty Analysis (novelty %, risk level, similar patents)
3. Prior Art Assessment (list of similar patents and their relevance)
4. Patentability Assessment (which features are safe to claim, which are risky)
5. Risk Summary (high-risk areas and mitigation strategies)
6. Filing Recommendations (strategy for patent claims)
7. Confidence Assessment (overall confidence in the analysis)

Format as a professional audit report.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a patent attorney generating a comprehensive novelty audit report for patent filing.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const reportContent = completion.choices[0]?.message?.content || '';
    console.log('[Novelty Audit] Report generated successfully');

    // Generate PDF using jsPDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const maxWidth = pageWidth - margin * 2;

    // Title
    doc.setFontSize(18);
    doc.text('NOVELTY AUDIT REPORT', margin, 15);

    // Metadata
    doc.setFontSize(11);
    doc.text(`Project: ${projectName}`, margin, 25);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 32);
    doc.text(`Novelty Score: ${analysisData.noveltyScore}%`, margin, 39);
    doc.text(`Confidence: ${analysisData.confidence}%`, margin, 46);

    // Content - split into lines to fit page width
    doc.setFontSize(10);
    let yPosition = 55;
    const lines = doc.splitTextToSize(reportContent, maxWidth);

    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="novelty-audit-${projectName}.pdf"`,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to generate novelty audit';
    console.error('[Novelty Audit]', msg);
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
