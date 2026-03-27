declare module 'docx-parser' {
  export class DocxParser {
    parseBuffer(buffer: Buffer): Promise<{ text: string }>;
  }
}
