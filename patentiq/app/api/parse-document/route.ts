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
      // PDF parsing not available on Vercel due to canvas native dependency
      return NextResponse.json(
        { error: 'PDF parsing is not available in this environment. Please convert to DOCX, TXT, or MD format.' },
        { status: 400 }
      );
    } else if (fileName.endsWith('.docx')) {
      // DOCX parsing
      content = await parseDOCX(buffer);
    } else if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      // Text files
      content = buffer.toString('utf-8');
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format. Please use DOCX, TXT, or MD.' },
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

// Parse DOCX using mammoth
async function parseDOCX(buffer: Buffer): Promise<string> {
  try {
    // Use mammoth which handles buffers directly without filesystem writes
    const mammoth = await import('mammoth');
    // Pass buffer directly - mammoth accepts buffers as input
    const result = await (mammoth as any).extractRawText(buffer);
    return result.value || '';
  } catch (error) {
    throw new Error(`DOCX parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
