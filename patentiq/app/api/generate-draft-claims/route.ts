import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
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

    console.log('[Draft Claims] Generating claims for:', projectName);

    const prompt = `Generate a set of draft patent claims for the following invention analysis. Use this data:

Project: ${projectName}
Novelty Score: ${analysisData.noveltyScore}%
Features: ${analysisData.features.map((f) => f.name).join(', ')}

Unique Features (claim these broadly):
${analysisData.features.filter((f) => f.status === 'unique').map((f) => `- ${f.name}`).join('\n')}

Partial Features (claim these carefully):
${analysisData.features.filter((f) => f.status === 'partial').map((f) => `- ${f.name}`).join('\n')}

High-Risk Features (avoid claiming broadly):
${analysisData.features.filter((f) => f.status === 'high-risk').map((f) => `- ${f.name}`).join('\n')}

Similar Patents Found: ${analysisData.similarPatents}
Top Risk Feature: ${analysisData.topRiskFeature}

Generate 4-6 draft patent claims following USPTO format:
1. One broad independent claim covering the core invention
2. One medium-scope independent claim with key features
3. One narrow independent claim with specific details
4. 2-3 dependent claims adding specific limitations

Format each claim clearly with numbers. Include:
- Claim type (independent/dependent)
- Technical scope
- Key features included
- Brief explanation of patentability strategy for each claim

Make claims specific enough to avoid prior art but broad enough for meaningful protection.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an experienced patent attorney drafting patent claims. Follow USPTO format and include strategic explanation for each claim.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const claimsContent = completion.choices[0]?.message?.content || '';
    console.log('[Draft Claims] Claims generated successfully');

    // Create DOCX document
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'DRAFT CLAIMS SUMMARY',
              heading: HeadingLevel.HEADING_1,
              run: { bold: true, size: 24 },
            }),
            new Paragraph({
              text: `Project: ${projectName}`,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `Generated: ${new Date().toLocaleString()}`,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `Novelty Score: ${analysisData.noveltyScore}%`,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `Confidence: ${analysisData.confidence}%`,
              spacing: { after: 400 },
            }),
            ...claimsContent.split('\n').map(
              (line) =>
                new Paragraph({
                  text: line || ' ',
                  spacing: { after: 100 },
                })
            ),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="draft-claims-${projectName}.docx"`,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to generate draft claims';
    console.error('[Draft Claims]', msg);
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
