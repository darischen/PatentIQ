declare module 'mammoth' {
  export function extractRawText(input: Buffer | ArrayBufferLike): Promise<{ value: string }>;
}
