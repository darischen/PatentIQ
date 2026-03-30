declare module 'docx-parser' {
  export class DocxParser {
    parseBuffer(buffer: Buffer): Promise<{ text: string }>;
  }
}

declare module 'pdfjs-dist/build/pdf.mjs' {
  export function getDocument(params: { data: Uint8Array }): { promise: Promise<any> };
}
