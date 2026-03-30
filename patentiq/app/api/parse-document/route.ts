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

// Parse PDF - text extraction only
async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    // Polyfill DOMMatrix before importing pdfjs
    if (typeof global !== 'undefined' && !(global as any).DOMMatrix) {
      (global as any).DOMMatrix = class DOMMatrix {
        constructor() {
          (this as any).a = 1;
          (this as any).b = 0;
          (this as any).c = 0;
          (this as any).d = 1;
          (this as any).e = 0;
          (this as any).f = 0;
        }
      };
    }

    // Use legacy build for Node.js compatibility
    const pdfModule = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const { getDocument } = pdfModule as any;

    // Set worker source to CDN before parsing (avoids bundled worker path issues on Vercel)
    const pdfAny = pdfModule as any;
    if (pdfAny.GlobalWorkerOptions) {
      pdfAny.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    const pdfDocument = await getDocument({ data: new Uint8Array(buffer) }).promise;
    let fullText = '';

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      try {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent({ normalizeWhitespace: true });
        const pageText = (textContent.items as any[]).map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      } catch (pageError) {
        console.warn(`[Parse Document] Failed to extract text from page ${i}:`, pageError);
      }
    }

    if (!fullText.trim()) {
      throw new Error('No text content could be extracted from PDF');
    }

    return fullText.trim();
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
