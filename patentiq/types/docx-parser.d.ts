declare module 'mammoth' {
  export function extractRawText(input: Buffer | ArrayBufferLike): Promise<{ value: string }>;
}

declare module 'pdfjs-dist/build/pdf.mjs' {
  export function getDocument(params: { data: Uint8Array }): { promise: Promise<any> };
}
