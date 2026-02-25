/**
 * Input Processing Service
 *
 * Handles the initial processing of user invention input:
 * - Text idea submissions
 * - Document uploads (PDF, DOCX)
 * - Technical keyword extraction
 * - CPC code suggestion
 * - Query expansion for patent search
 */

export interface ProcessedInput {
  rawText: string;
  cleanedText: string;
  keywords: string[];
  suggestedCpcCodes: string[];
  expandedQueries: string[];
  inputType: "text" | "document" | "diagram";
}

export async function preprocessInput(
  content: string,
  inputType: "text" | "document" | "diagram"
): Promise<ProcessedInput> {
  const cleanedText = cleanText(content);
  const keywords = extractKeywords(cleanedText);

  return {
    rawText: content,
    cleanedText,
    keywords,
    suggestedCpcCodes: [], // populated by LLM service
    expandedQueries: [], // populated by query expansion
    inputType,
  };
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/[^\w\s.,;:!?()-]/g, "")
    .trim();
}

function extractKeywords(text: string): string[] {
  // Basic keyword extraction - will be enhanced by LLM
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will",
    "would", "could", "should", "may", "might", "can", "shall",
    "of", "in", "to", "for", "with", "on", "at", "from", "by",
    "and", "or", "but", "not", "this", "that", "these", "those",
  ]);

  const words = text.toLowerCase().split(/\s+/);
  const filtered = words.filter(
    (w) => w.length > 3 && !stopWords.has(w)
  );

  const frequency = new Map<string, number>();
  for (const word of filtered) {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  }

  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

export async function parseDocument(
  fileBuffer: Buffer,
  mimeType: string
): Promise<string> {
  // TODO: Integrate document parsing (PDF, DOCX)
  // Will use libraries like pdf-parse or mammoth
  throw new Error(`Document parsing not yet implemented for: ${mimeType}`);
}
