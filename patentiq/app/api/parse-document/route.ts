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

// Parse PDF - hidden require to avoid bundler detection
async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    // Provide polyfills for Node.js environment
    if (typeof global !== 'undefined') {
      if (!(global as any).DOMMatrix) {
        (global as any).DOMMatrix = class DOMMatrix {
          a = 1;
          b = 0;
          c = 0;
          d = 1;
          e = 0;
          f = 0;
        };
      }
    }

    // Hide require from bundler using Function constructor
    // This allows pdfjs-dist to load at runtime without build-time bundling
    const requireFunc = new Function('moduleName', 'return require(moduleName)');
    const pdfModule = requireFunc('pdfjs-dist') as any;
    const { getDocument, GlobalWorkerOptions } = pdfModule;

    // Disable worker to avoid worker loading issues in serverless
    if (GlobalWorkerOptions) {
      GlobalWorkerOptions.disableWorker = true;
    }

    const pdfDocument = await getDocument({
      data: new Uint8Array(buffer),
      disableWorker: true,
    }).promise;

    let fullText = '';

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      try {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent({ normalizeWhitespace: true });
        const pageText = (textContent.items as any[]).map((item: any) => item.str || '').join(' ');
        fullText += pageText + '\n';
      } catch (pageError) {
        console.warn(`[Parse Document] Failed to extract text from page ${i}:`, pageError);
      }
    }

    if (!fullText.trim()) {
      throw new Error('No text content extracted from PDF');
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
