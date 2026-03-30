declare module 'docx-parser' {
  export function parseDocx(buffer: Buffer): Promise<{ text: string } | string>;
}

declare module 'pdfjs-dist/build/pdf.mjs' {
  export function getDocument(params: { data: Uint8Array }): { promise: Promise<any> };
}
