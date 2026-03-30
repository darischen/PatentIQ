import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    let content = '';

    if (fileName.endsWith('.pdf')) {
      // PDF parsing
      content = await parsePDF(buffer);
    } else if (fileName.endsWith('.docx')) {
      // DOCX parsing
      content = await parseDOCX(buffer);
    } else if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      // Text files
      content = buffer.toString('utf-8');
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format. Please use PDF, DOCX, TXT, or MD.' },
        { status: 400 }
      );
    }

    if (!content || content.trim().length < 50) {
      return NextResponse.json(
        { error: 'Document content too short (minimum 50 characters).' },
        { status: 400 }
      );
    }

    return NextResponse.json({ content: content.trim() });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to parse document';
    console.error('[Parse Document]', msg);
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}

// Parse PDF using pdf-parse
async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    // Set up Node.js environment for pdfjs-dist
    if (typeof global !== 'undefined' && !(global as any).DOMMatrix) {
      (global as any).DOMMatrix = class DOMMatrix {
        a = 1;
        b = 0;
        c = 0;
        d = 1;
        e = 0;
        f = 0;
      };
    }

    // Dynamic import to avoid issues if pdf-parse isn't installed
    const pdfParse = await import('pdf-parse');
    const pdf = await (pdfParse as any)(buffer);
    return pdf.text;
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Parse DOCX using docx-parser
async function parseDOCX(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid issues if docx-parser isn't installed
    const { DocxParser } = await import('docx-parser');
    const parser = new DocxParser();
    const result = await parser.parseBuffer(buffer);
    return result.text || '';
  } catch (error) {
    throw new Error(`DOCX parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
